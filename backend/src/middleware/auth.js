const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/apiResponse');

// Reads "Authorization: Bearer <token>", verifies it, and attaches
// { id, mobileNumber } to req.user for downstream controllers.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return fail(res, 'Missing or invalid Authorization header.', 401);
  }

  try {
    const payload = verifyToken(token);
    // console.log("payload", req)
    req.user = { id: payload.id, mobileNumber: payload.mobileNumber };
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired token. Please log in again.', 401);
  }
}

module.exports = requireAuth;
