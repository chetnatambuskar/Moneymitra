const crypto = require('crypto');

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 5;

function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function getExpiryDate() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

// Swap this out for a real SMS gateway (MSG91, Twilio, etc.) before
// shipping. In OTP_DEBUG_MODE it just logs, so you can test end-to-end
// without an SMS account — the OTP is also returned in the API response.
async function sendOtpSms(mobileNumber, otp) {
  if (process.env.OTP_DEBUG_MODE === 'true') {
    console.log(`[DEV OTP] ${mobileNumber} -> ${otp}`);
    return;
  }
  throw new Error(
    'No SMS gateway configured. Set OTP_DEBUG_MODE=true for local testing, ' +
      'or implement a real provider in src/utils/otp.js.',
  );
}

module.exports = {generateOtp, hashOtp, getExpiryDate, sendOtpSms, OTP_TTL_MINUTES};
