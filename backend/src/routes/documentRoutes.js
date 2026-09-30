const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {upload, withCategory} = require('../middleware/upload');
const {listDocuments, uploadDocument} = require('../controllers/documentController');

router.use(requireAuth);
router.get('/', listDocuments);
// :docType becomes the folder name (selfie/aadhaar/pan) via withCategory.
router.post('/:docType', (req, res, next) => {
  withCategory(req.params.docType)(req, res, next);
}, upload.single('file'), uploadDocument);

module.exports = router;
