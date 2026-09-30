// Put in: backend/src/routes/cibilRoutes.js
const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {sendCibilOtp, verifyCibilOtp} = require('../controllers/cibilController');

router.use(requireAuth);
router.post('/send-otp', sendCibilOtp);
router.post('/verify-otp', verifyCibilOtp);

module.exports = router;