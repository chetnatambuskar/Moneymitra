const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const {upload, withCategory} = require('../middleware/upload');
const {
  createLoan,
  listLoans,
  getLoan,
  savePersonalInfo,
  saveProfessionalInfo,
  setLoanAmount,
  getBankDetails,
  saveBankDetails,
  getInsuranceSummary,
  payInsurance,
  getReview,
  getAgreementForm,
  getAgreementDownloadLink,
  downloadAgreement,
  sendAgreementOtp,
  verifyAgreementOtp,
  disburse,
} = require('../controllers/loanController');

// Opened in the phone's browser, so it authenticates with a URL token instead
// of the Bearer header. Must stay ABOVE router.use(requireAuth).
router.get('/:id/agreement/download', downloadAgreement);

router.use(requireAuth);

router.post('/', createLoan);
router.get('/', listLoans);
router.get('/:id', getLoan);

router.put('/:id/personal-info', savePersonalInfo);
router.put('/:id/professional-info', saveProfessionalInfo);
router.put('/:id/amount', setLoanAmount);

router.get('/:id/bank-details', getBankDetails);
router.post(
  '/:id/bank-details',
  withCategory('bank-statement'),
  upload.single('file'),
  saveBankDetails,
);

router.get('/:id/insurance-summary', getInsuranceSummary);
router.post('/:id/insurance-payment', payInsurance);

router.get('/:id/review', getReview);

router.get('/:id/agreement', getAgreementForm);
router.post('/:id/agreement/download-link', getAgreementDownloadLink);
router.post('/:id/agreement/send-otp', sendAgreementOtp);
router.post('/:id/agreement/verify-otp', verifyAgreementOtp);

router.post('/:id/disburse', disburse);

module.exports = router;