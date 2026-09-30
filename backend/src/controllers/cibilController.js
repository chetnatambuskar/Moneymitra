// Put in: backend/src/controllers/cibilController.js
const db = require('../config/db');
const {ok, fail} = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {generateOtp, hashOtp, getExpiryDate, sendOtpSms} = require('../utils/otp');

// POST /api/cibil/send-otp  (Bearer token required)
// Sends an OTP to the logged-in user's mobile number for the CIBIL Report step.
const sendCibilOtp = asyncHandler(async (req, res) => {
  const mobileNumber = req.user.mobileNumber;

  const otp = generateOtp();
  await db.query(
    `INSERT INTO otps (mobile_number, otp_hash, purpose, expires_at)
     VALUES (?, ?, 'cibil', ?)`,
    [mobileNumber, hashOtp(otp), getExpiryDate()],
  );
  await sendOtpSms(mobileNumber, otp); // logs "[DEV OTP] ..." in debug mode

  // In dev mode the OTP is returned so the app can show / auto-fill it.
  const debugPayload = process.env.OTP_DEBUG_MODE === 'true' ? {otp} : undefined;
  return ok(res, {mobileNumber, ...debugPayload});
});

// POST /api/cibil/verify-otp  { otp }
const verifyCibilOtp = asyncHandler(async (req, res) => {
  const {otp} = req.body || {};
  if (!otp) return fail(res, 'otp is required.', 422);

  const [rows] = await db.query(
    `SELECT id FROM otps
     WHERE mobile_number = ? AND purpose = 'cibil' AND otp_hash = ? AND verified = FALSE
       AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [req.user.mobileNumber, hashOtp(String(otp))],
  );
  if (rows.length === 0) return fail(res, 'Incorrect or expired OTP.', 401);

  await db.query('UPDATE otps SET verified = TRUE WHERE id = ?', [rows[0].id]);
  return ok(res, {verified: true});
});

module.exports = {sendCibilOtp, verifyCibilOtp};