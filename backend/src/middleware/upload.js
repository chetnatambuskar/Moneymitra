const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');

// Files land in uploads/<category>/ (selfie, aadhaar, pan, bank-statement)
// so they're easy to find on disk and to serve back as static URLs.
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const category = req.uploadCategory || 'misc';
    const dir = path.join(UPLOAD_ROOT, category);
    fs.mkdirSync(dir, {recursive: true});
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: {fileSize: 10 * 1024 * 1024}, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, or PDF files are allowed.'));
    }
  },
});

// Sets req.uploadCategory before multer runs, so files sort into folders.
function withCategory(category) {
  return (req, _res, next) => {
    req.uploadCategory = category;
    next();
  };
}

function fileUrl(req, category, filename) {
  return `${process.env.BASE_URL}/uploads/${category}/${filename}`;
}

module.exports = {upload, withCategory, fileUrl};
