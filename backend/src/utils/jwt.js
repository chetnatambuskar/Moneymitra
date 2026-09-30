const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Short-lived token for the "Download Agreement" link (opened in a browser,
// which can't send the Authorization header).
function signDownloadToken({loanId, userId}) {
  return jwt.sign({purpose: 'agreement-download', loanId, userId}, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

module.exports = {signToken, verifyToken, signDownloadToken};