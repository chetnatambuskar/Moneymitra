const db = require('../config/db');
const {ok, fail} = require('../utils/apiResponse');
const {fileUrl} = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/profile — powers ProfileScreen / SettingsScreen header.
const getProfile = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    `SELECT id, mobile_number, full_name, email, dob, gender, marital_status, avatar_url, created_at
     FROM users WHERE id = ?`,
    [req.user.id],
  );
  if (rows.length === 0) return fail(res, 'User not found.', 404);
  return ok(res, rows[0]);
});

// PUT /api/profile — powers ProfileScreen's editable fields.
const updateProfile = asyncHandler(async (req, res) => {
  const {fullName, email, dob, gender, maritalStatus} = req.body;

  await db.query(
    `UPDATE users SET
       full_name = COALESCE(?, full_name),
       email = COALESCE(?, email),
       dob = COALESCE(?, dob),
       gender = COALESCE(?, gender),
       marital_status = COALESCE(?, marital_status)
     WHERE id = ?`,
    [fullName ?? null, email ?? null, dob ?? null, gender ?? null, maritalStatus ?? null, req.user.id],
  );

  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  return ok(res, rows[0]);
});

// POST /api/profile/avatar  (multipart, field name "file")
// Powers the profile-photo circle in Settings.
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return fail(res, 'No image uploaded. Send it as multipart field "file".', 422);
  }

  const url = fileUrl(req, 'avatar', req.file.filename);
  await db.query('UPDATE users SET avatar_url = ? WHERE id = ?', [url, req.user.id]);

  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  return ok(res, rows[0]);
});

module.exports = {getProfile, updateProfile, uploadAvatar};