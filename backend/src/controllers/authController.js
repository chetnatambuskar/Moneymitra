// const db = require('../config/db');
// const { ok, fail } = require('../utils/apiResponse');
// const asyncHandler = require('../utils/asyncHandler');
// const { signToken } = require('../utils/jwt');
// const { generateOtp, hashOtp, getExpiryDate, sendOtpSms } = require('../utils/otp');

// // POST /api/auth/send-otp  { mobileNumber }
// // Powers LoginScreen's "Continue" button.
// const sendOtp = asyncHandler(async (req, res) => {

//   const mobileNumber = req.body.mobile;
//   // console.log("otpppp", req.body.mobile)
//   if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
//     return fail(res, 'Enter a valid 10-digit mobile number.', 422);
//   }

//   const otp = generateOtp();
//   await db.query(
//     `INSERT INTO otps (mobile_number, otp_hash, purpose, expires_at)
//      VALUES (?, ?, 'login', ?)`,
//     [mobileNumber, hashOtp(otp), getExpiryDate()],
//   );

//   await sendOtpSms(mobileNumber, otp);

//   const debugPayload = process.env.OTP_DEBUG_MODE === 'true' ? { otp } : undefined;
//   return ok(res, { mobileNumber, ...debugPayload });
// });

// // POST /api/auth/verify-otp  { mobileNumber, otp }
// // Powers OtpVerificationScreen's "Verify OTP" button. Creates the user on
// // first login (there's no separate signup step in the app).
// const verifyOtp = asyncHandler(async (req, res) => {
//   const { mobileNumber, otp } = req.body;
//   if (!mobileNumber || !otp) {
//     return fail(res, 'mobileNumber and otp are required.', 422);
//   }

//   const [rows] = await db.query(
//     `SELECT id FROM otps
//      WHERE mobile_number = ? AND purpose = 'login' AND otp_hash = ? AND verified = FALSE
//        AND expires_at > NOW()
//      ORDER BY id DESC LIMIT 1`,
//     [mobileNumber, hashOtp(otp)],
//   );

//   if (rows.length === 0) {
//     return fail(res, 'Incorrect or expired OTP.', 401);
//   }

//   await db.query('UPDATE otps SET verified = TRUE WHERE id = ?', [rows[0].id]);

//   let [users] = await db.query('SELECT * FROM users WHERE mobile_number = ?', [mobileNumber]);
//   let user = users[0];
//   if (!user) {
//     const [result] = await db.query('INSERT INTO users (mobile_number) VALUES (?)', [mobileNumber]);
//     [users] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
//     user = users[0];
//   }

//   const token = signToken({ id: user.id, mobileNumber: user.mobile_number });
//   return ok(res, { token, user });
// });

// module.exports = { sendOtp, verifyOtp };


const db = require('../config/db');
const { ok, fail } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/jwt');
const { generateOtp, hashOtp, getExpiryDate, sendOtpSms } = require('../utils/otp');

// POST /api/auth/send-otp  { mobileNumber }
// Powers LoginScreen's "Continue" button.
const sendOtp = asyncHandler(async (req, res) => {
  // The app sends `mobileNumber`; `mobile` is accepted as a fallback.
  const mobileNumber = String(req.body.mobileNumber || req.body.mobile || '').trim();

  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    return fail(res, 'Enter a valid 10-digit mobile number.', 422);
  }

  const otp = generateOtp();
  await db.query(
    `INSERT INTO otps (mobile_number, otp_hash, purpose, expires_at)
     VALUES (?, ?, 'login', ?)`,
    [mobileNumber, hashOtp(otp), getExpiryDate()],
  );

  await sendOtpSms(mobileNumber, otp);

  const debugPayload = process.env.OTP_DEBUG_MODE === 'true' ? { otp } : undefined;
  return ok(res, { mobileNumber, ...debugPayload });
});

// POST /api/auth/verify-otp  { mobileNumber, otp }
// Powers OtpVerificationScreen's "Verify OTP" button. Creates the user on
// first login (there's no separate signup step in the app).
const verifyOtp = asyncHandler(async (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) {
    return fail(res, 'mobileNumber and otp are required.', 422);
  }

  const [rows] = await db.query(
    `SELECT id FROM otps
     WHERE mobile_number = ? AND purpose = 'login' AND otp_hash = ? AND verified = FALSE
       AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [mobileNumber, hashOtp(otp)],
  );

  if (rows.length === 0) {
    return fail(res, 'Incorrect or expired OTP.', 401);
  }

  await db.query('UPDATE otps SET verified = TRUE WHERE id = ?', [rows[0].id]);

  let [users] = await db.query('SELECT * FROM users WHERE mobile_number = ?', [mobileNumber]);
  let user = users[0];
  if (!user) {
    const [result] = await db.query('INSERT INTO users (mobile_number) VALUES (?)', [mobileNumber]);
    [users] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    user = users[0];
  }

  const token = signToken({ id: user.id, mobileNumber: user.mobile_number });
  return ok(res, { token, user });
});

module.exports = { sendOtp, verifyOtp };