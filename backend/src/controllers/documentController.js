const db = require('../config/db');
const {ok, fail} = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {notifyDocumentsUploaded} = require('../utils/notify');
const {fileUrl} = require('../middleware/upload');

const DOC_TYPES = ['selfie', 'aadhaar', 'pan'];

// Marks step 3 (Document Verification) complete on all of the user's loans
// when selfie + aadhaar + pan are all uploaded. Safe to call repeatedly.
async function syncDocumentStep(userId) {
  const [docs] = await db.query(
    'SELECT DISTINCT doc_type FROM kyc_documents WHERE user_id = ?',
    [userId],
  );
  const uploaded = new Set(docs.map(d => d.doc_type));
  if (!DOC_TYPES.every(t => uploaded.has(t))) return false;

  await db.query(
    `UPDATE loan_process_steps SET completed = TRUE, completed_at = NOW()
     WHERE step_number = 3 AND completed = FALSE
       AND loan_application_id IN (SELECT id FROM loan_applications WHERE user_id = ?)`,
    [userId],
  );
  return true;
}

// GET /api/documents — Settings -> Document Verified, and the checklist's
// own "Document Verification" step both read from this same list.
const listDocuments = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    'SELECT doc_type, file_url, verified, uploaded_at FROM kyc_documents WHERE user_id = ?',
    [req.user.id],
  );
  return ok(res, rows);
});

// POST /api/documents/:docType  (multipart, field name "file")
// Powers DocVerificationReviewScreen's "Confirm" button — the captured
// photo is uploaded here. Re-uploading the same docType overwrites it.
const uploadDocument = asyncHandler(async (req, res) => {
  const {docType} = req.params;
  if (!DOC_TYPES.includes(docType)) {
    return fail(res, `docType must be one of: ${DOC_TYPES.join(', ')}`, 422);
  }
  if (!req.file) {
    return fail(res, 'No file uploaded. Send it as multipart field "file".', 422);
  }

  const url = fileUrl(req, docType, req.file.filename);

  const [[before]] = await db.query(
    'SELECT COUNT(DISTINCT doc_type) AS n FROM kyc_documents WHERE user_id = ?',
    [req.user.id],
  );

  await db.query(
    `INSERT INTO kyc_documents (user_id, doc_type, file_url, verified)
     VALUES (?, ?, ?, FALSE)
     ON DUPLICATE KEY UPDATE file_url = VALUES(file_url), verified = FALSE, uploaded_at = NOW()`,
    [req.user.id, docType, url],
  );

  // Documents belong to the USER, not to one loan. As soon as all three are
  // uploaded (from Settings OR from a loan's checklist), mark the
  // "Document Verification" step complete on every loan of this user.
  const allDone = await syncDocumentStep(req.user.id);
  // Notify once, on the upload that completes the set (not on re-uploads).
  if (allDone && Number(before.n) < DOC_TYPES.length) {
    await notifyDocumentsUploaded(req.user.id);
  }

  return ok(res, {docType, fileUrl: url});
});

module.exports = {listDocuments, uploadDocument, syncDocumentStep};