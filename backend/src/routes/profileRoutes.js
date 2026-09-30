const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {upload, withCategory} = require('../middleware/upload');
const {getProfile, updateProfile, uploadAvatar} = require('../controllers/profileController');

router.use(requireAuth);
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', withCategory('avatar'), upload.single('file'), uploadAvatar);

module.exports = router;