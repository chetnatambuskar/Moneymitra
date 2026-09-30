const db = require('../config/db');
const {ok, fail} = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {fileUrl} = require('../middleware/upload');
const {buildLoanSummary} = require('../utils/loanMath');
const {signDownloadToken, verifyToken} = require('../utils/jwt');
const {streamAgreementPdf} = require('../utils/agreementPdf');
const {
  notifyApplicationSubmitted,
  notifyInsurancePaid,
  notifyAgreementSigned,
  notifyLoanDisbursed,
} = require('../utils/notify');
const {generateOtp, hashOtp, getExpiryDate, sendOtpSms} = require('../utils/otp');

const PROCESS_STEPS = [
  'Loan Application',
  'Select Loan Amount',
  'Document Verification',
  'Add Bank Details',
  'Payment For Insurance',
  'Review & Sign Agreement',
  'Transfer Money To Bank Account',
];

async function loadLoanOr404(loanId, userId, res) {
  const [rows] = await db.query(
    'SELECT * FROM loan_applications WHERE id = ? AND user_id = ?',
    [loanId, userId],
  );
  if (rows.length === 0) {
    fail(res, 'Loan application not found.', 404);
    return null;
  }
  return rows[0];
}

async function markStepComplete(loanId, stepNumber) {
  await db.query(
    `UPDATE loan_process_steps SET completed = TRUE, completed_at = NOW()
     WHERE loan_application_id = ? AND step_number = ?`,
    [loanId, stepNumber],
  );
}

// Returns the first step (up to `upTo`) that is not completed yet, or null.
async function firstIncompleteStep(loanId, upTo) {
  const [rows] = await db.query(
    `SELECT step_number, title FROM loan_process_steps
     WHERE loan_application_id = ? AND step_number <= ? AND completed = FALSE
     ORDER BY step_number LIMIT 1`,
    [loanId, upTo],
  );
  return rows[0] || null;
}

// Responds 409 and returns false if an earlier step is still pending.
async function requireStepsDone(loan, upTo, res) {
  const pending = await firstIncompleteStep(loan.id, upTo);
  if (!pending) return true;
  fail(res, `Please complete "${pending.title}" first.`, 409);
  return false;
}

const LOAN_WITH_EMPLOYMENT_SQL = `
  SELECT la.*, lp.employment_type
  FROM loan_applications la
  LEFT JOIN loan_professional_info lp ON lp.loan_application_id = la.id`;

// POST /api/loans  { loanTitle }
// Home screen's category cards / "Get Instant Loan" button.
const createLoan = asyncHandler(async (req, res) => {
  const {loanTitle} = req.body;
  if (!loanTitle) return fail(res, 'loanTitle is required.', 422);

  const [result] = await db.query(
    'INSERT INTO loan_applications (user_id, loan_title, status) VALUES (?, ?, "draft")',
    [req.user.id, loanTitle],
  );
  const loanId = result.insertId;

  const stepRows = PROCESS_STEPS.map((title, i) => [loanId, i + 1, title]);
  await db.query(
    'INSERT INTO loan_process_steps (loan_application_id, step_number, title) VALUES ?',
    [stepRows],
  );

  const loan = await loadLoanOr404(loanId, req.user.id, res);
  return ok(res, loan, 201);
});

// GET /api/loans — ApplicationScreen's Active/Closed tabs.
const listLoans = asyncHandler(async (req, res) => {
  const [rows] = await db.query(
    `${LOAN_WITH_EMPLOYMENT_SQL} WHERE la.user_id = ? ORDER BY la.created_at DESC`,
    [req.user.id],
  );

  // Attach each loan's checklist so the app can work out where to resume.
  let stepsByLoan = {};
  if (rows.length > 0) {
    const [steps] = await db.query(
      `SELECT loan_application_id, step_number, title, completed, completed_at
       FROM loan_process_steps WHERE loan_application_id IN (?)
       ORDER BY step_number`,
      [rows.map(r => r.id)],
    );
    stepsByLoan = steps.reduce((acc, {loan_application_id, ...step}) => {
      (acc[loan_application_id] = acc[loan_application_id] || []).push(step);
      return acc;
    }, {});
  }

  return ok(res, rows.map(r => ({...r, steps: stepsByLoan[r.id] || []})));
});

// GET /api/loans/:id — CompleteProcessScreen: loan + full checklist.
const getLoan = asyncHandler(async (req, res) => {
  const [loanRows] = await db.query(
    `${LOAN_WITH_EMPLOYMENT_SQL} WHERE la.id = ? AND la.user_id = ?`,
    [req.params.id, req.user.id],
  );
  if (loanRows.length === 0) return fail(res, 'Loan application not found.', 404);
  const loan = loanRows[0];

  const [steps] = await db.query(
    'SELECT step_number, title, completed, completed_at FROM loan_process_steps WHERE loan_application_id = ? ORDER BY step_number',
    [loan.id],
  );
  return ok(res, {...loan, steps});
});

// PUT /api/loans/:id/personal-info — PersonalInformationFormScreen "Next".
const savePersonalInfo = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const {fullName, dob, gender, email, maritalStatus, address, purpose} = req.body;
  if (!fullName) return fail(res, 'fullName is required.', 422);

  await db.query(
    `INSERT INTO loan_personal_info (loan_application_id, full_name, dob, gender, email, marital_status, address, purpose)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), dob=VALUES(dob), gender=VALUES(gender),
       email=VALUES(email), marital_status=VALUES(marital_status), address=VALUES(address),
       purpose=VALUES(purpose)`,
    [loan.id, fullName, dob || null, gender || null, email || null, maritalStatus || null, address || null, purpose || null],
  );

  // Also save these details on the user's account so Settings / Profile
  // show the real name for this mobile number.
  await db.query(
    `UPDATE users SET
       full_name = COALESCE(?, full_name),
       email = COALESCE(?, email),
       dob = COALESCE(?, dob),
       gender = COALESCE(?, gender),
       marital_status = COALESCE(?, marital_status)
     WHERE id = ?`,
    [fullName || null, email || null, dob || null, gender || null, maritalStatus || null, req.user.id],
  );

  return ok(res, {loanId: loan.id, saved: true});
});

// PUT /api/loans/:id/professional-info — ProfessionalInformationScreen "Submit".
// This is the last step of the intake form, so it also marks checklist
// step 1 ("Loan Application") complete and flips the loan to in_progress.
const saveProfessionalInfo = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const {employmentType, companyName, workEmail, monthlyIncome, sourceOfIncome} = req.body;
  if (!employmentType) return fail(res, 'employmentType is required.', 422);

  await db.query(
    `INSERT INTO loan_professional_info (loan_application_id, employment_type, company_name, work_email, monthly_income, source_of_income)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE employment_type=VALUES(employment_type), company_name=VALUES(company_name),
       work_email=VALUES(work_email), monthly_income=VALUES(monthly_income), source_of_income=VALUES(source_of_income)`,
    [loan.id, employmentType, companyName || null, workEmail || null, monthlyIncome || null, sourceOfIncome || null],
  );

  await db.query('UPDATE loan_applications SET status = "in_progress" WHERE id = ?', [loan.id]);
  await markStepComplete(loan.id, 1);
  if (loan.status === 'draft') await notifyApplicationSubmitted(req.user.id, loan); // first submit only

  return ok(res, {loanId: loan.id, saved: true});
});

// PUT /api/loans/:id/amount  { amount, tenureMonths }
// SelectLoanAmountScreen's "Confirm". Marks checklist step 2.
const setLoanAmount = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const {amount, tenureMonths} = req.body;
  if (!amount || !tenureMonths) {
    return fail(res, 'amount and tenureMonths are required.', 422);
  }

  await db.query(
    'UPDATE loan_applications SET amount = ?, tenure_months = ? WHERE id = ?',
    [amount, tenureMonths, loan.id],
  );
  await markStepComplete(loan.id, 2);

  const updated = await loadLoanOr404(loan.id, req.user.id, res);
  return ok(res, updated);
});

// GET /api/loans/:id/bank-details
const getBankDetails = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const [rows] = await db.query('SELECT * FROM bank_details WHERE loan_application_id = ?', [loan.id]);
  return ok(res, rows[0] || null);
});

// POST /api/loans/:id/bank-details  (multipart: bankName, accountHolderName,
// accountNumber, ifscCode, file). Powers BankDetailsScreen's "Continue".
const saveBankDetails = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const {bankName, accountHolderName, accountNumber, ifscCode} = req.body;
  if (!bankName || !accountHolderName || !accountNumber || !ifscCode) {
    return fail(res, 'bankName, accountHolderName, accountNumber and ifscCode are required.', 422);
  }

  const statementUrl = req.file ? fileUrl(req, 'bank-statement', req.file.filename) : null;

  await db.query(
    `INSERT INTO bank_details (loan_application_id, bank_name, account_holder_name, account_number, ifsc_code, statement_file_url)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE bank_name=VALUES(bank_name), account_holder_name=VALUES(account_holder_name),
       account_number=VALUES(account_number), ifsc_code=VALUES(ifsc_code),
       statement_file_url=COALESCE(VALUES(statement_file_url), statement_file_url)`,
    [loan.id, bankName, accountHolderName, accountNumber, ifscCode, statementUrl],
  );
  await markStepComplete(loan.id, 4);

  const [rows] = await db.query('SELECT * FROM bank_details WHERE loan_application_id = ?', [loan.id]);
  return ok(res, rows[0]);
});

// GET /api/loans/:id/insurance-summary — PaymentForInsuranceScreen's card.
const getInsuranceSummary = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  if (!loan.amount || !loan.tenure_months) {
    return fail(res, 'Select a loan amount and tenure before viewing this summary.', 400);
  }
  return ok(res, buildLoanSummary(loan));
});

// POST /api/loans/:id/insurance-payment — "Pay To Continue" button.
// Stubbed: marks the charge as paid immediately. Wire a real payment
// gateway here (Razorpay, etc.) and only mark paid on its webhook/callback.
const payInsurance = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  if (!(await requireStepsDone(loan, 4, res))) return; // steps 1-4 first

  await db.query(
    `INSERT INTO insurance_payments (loan_application_id, amount, status, paid_at)
     VALUES (?, ?, 'paid', NOW())
     ON DUPLICATE KEY UPDATE status='paid', paid_at=NOW()`,
    [loan.id, loan.insurance_charge],
  );
  await markStepComplete(loan.id, 5);
  await notifyInsurancePaid(req.user.id, loan);

  return ok(res, {loanId: loan.id, status: 'paid'});
});

// GET /api/loans/:id/review — ReviewLoanDetailsScreen's card.
const getReview = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  if (!loan.amount || !loan.tenure_months) {
    return fail(res, 'Select a loan amount and tenure before reviewing.', 400);
  }

  const summary = buildLoanSummary(loan);
  const firstEmiDate = new Date();
  firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);
  firstEmiDate.setDate(10);

  return ok(res, {
    lendingPartner: 'MoneyMitra',
    loanAmount: summary.loanAmount,
    processingFee: summary.processingFee,
    preEmi: summary.preEmi,
    amountTransferable: summary.finalTransferable,
    loanTenure: summary.tenureMonths,
    monthlyEmi: summary.monthlyEmi,
    firstEmiDate: firstEmiDate.toISOString().slice(0, 10),
    interestRate: summary.interestRate,
  });
});


// ---------------------------------------------------------------------------
// GET /api/loans/:id/agreement — AgreementPreviewScreen.
// Assembles the "Personal Loan Application Form" from everything the user has
// already entered, so nothing on the form is typed twice or hardcoded.
// ---------------------------------------------------------------------------
const MASK_ACCOUNT_NUMBER = true; // set false to show the full account number

const toDdMmYyyy = value => {
  if (!value) return null;
  const [y, m, d] = String(value).slice(0, 10).split('-');
  return y && m && d ? `${d}/${m}/${y}` : null;
};

const maskAccount = number => {
  if (!number) return null;
  if (!MASK_ACCOUNT_NUMBER || number.length <= 4) return number;
  return 'X'.repeat(number.length - 4) + number.slice(-4);
};

const GENDER_LABELS = {male: 'Male', female: 'Female', other: 'Others'};
const EMPLOYMENT_LABELS = {salaried: 'Salaried', self_employed: 'Self Employed'};

async function assembleAgreement(loan, userId, mobileFallback) {
  const [[personalRows], [professionalRows], [bankRows], [docRows], [agreementRows], [userRows]] =
    await Promise.all([
      db.query('SELECT * FROM loan_personal_info WHERE loan_application_id = ?', [loan.id]),
      db.query('SELECT * FROM loan_professional_info WHERE loan_application_id = ?', [loan.id]),
      db.query('SELECT * FROM bank_details WHERE loan_application_id = ?', [loan.id]),
      db.query('SELECT doc_type, file_url FROM kyc_documents WHERE user_id = ?', [userId]),
      db.query('SELECT signed, signed_at FROM loan_agreements WHERE loan_application_id = ?', [loan.id]),
      db.query('SELECT * FROM users WHERE id = ?', [userId]),
    ]);

  const personal = personalRows[0] || {};
  const professional = professionalRows[0] || {};
  const bank = bankRows[0] || null;
  const agreement = agreementRows[0] || {};
  const user = userRows[0] || {};
  const docs = Object.fromEntries(docRows.map(d => [d.doc_type, d.file_url]));

  // Application number: MM + YYMMDD of creation + loan id, e.g. MM26092900012
  const created = String(loan.created_at).slice(0, 10).split('-'); // [yyyy, mm, dd]
  const applicationNumber = `MM${created[0].slice(2)}${created[1]}${created[2]}${String(loan.id).padStart(5, '0')}`;

  let loanSummary = null;
  if (loan.amount && loan.tenure_months) {
    const firstEmi = new Date();
    firstEmi.setMonth(firstEmi.getMonth() + 1);
    firstEmi.setDate(10);
    loanSummary = {
      ...buildLoanSummary(loan),
      firstEmiDate: toDdMmYyyy(firstEmi.toISOString()),
    };
  }

  return {
    loanId: loan.id,
    applicationNumber,
    applicationDate: toDdMmYyyy(loan.created_at),
    loanTitle: loan.loan_title,
    applicant: {
      name: personal.full_name || user.full_name || null,
      dob: toDdMmYyyy(personal.dob || user.dob),
      gender: GENDER_LABELS[personal.gender || user.gender] || null,
      maritalStatus: personal.marital_status || user.marital_status || null,
      email: personal.email || user.email || null,
      phone: user.mobile_number || mobileFallback || null,
      address: personal.address || null,
      purpose: personal.purpose || null,
      photoUrl: docs.selfie || null,
    },
    documents: {
      identitySubmitted: Boolean(docs.pan),
      addressSubmitted: Boolean(docs.aadhaar),
      selfieSubmitted: Boolean(docs.selfie),
    },
    employment: {
      type: EMPLOYMENT_LABELS[professional.employment_type] || null,
      companyName: professional.company_name || null,
      workEmail: professional.work_email || null,
      monthlyIncome: professional.monthly_income != null ? Number(professional.monthly_income) : null,
    },
    loan: loanSummary,
    bank: bank
      ? {
          bankName: bank.bank_name,
          accountNumber: maskAccount(bank.account_number),
          ifscCode: bank.ifsc_code,
        }
      : null,
    signature: {
      signed: Boolean(agreement.signed),
      signedAt: agreement.signed_at || null,
    },
  };
}

const getAgreementForm = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  return ok(res, await assembleAgreement(loan, req.user.id, req.user.mobileNumber));
});

// POST /api/loans/:id/agreement/send-otp — AgreementPreviewScreen's "Get OTP".
const sendAgreementOtp = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  if (!(await requireStepsDone(loan, 5, res))) return; // insurance must be paid

  const otp = generateOtp();
  await db.query(
    `INSERT INTO otps (mobile_number, otp_hash, purpose, loan_application_id, expires_at)
     VALUES (?, ?, 'agreement', ?, ?)`,
    [req.user.mobileNumber, hashOtp(otp), loan.id, getExpiryDate()],
  );
  await sendOtpSms(req.user.mobileNumber, otp);

  const debugPayload = process.env.OTP_DEBUG_MODE === 'true' ? {otp} : undefined;
  return ok(res, {loanId: loan.id, ...debugPayload});
});

// POST /api/loans/:id/agreement/verify-otp  { otp }
// AgreementOtpScreen's "Verify". Marks the agreement signed and checklist step 6.
const verifyAgreementOtp = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;

  const {otp} = req.body;
  if (!otp) return fail(res, 'otp is required.', 422);

  const [rows] = await db.query(
    `SELECT id FROM otps
     WHERE loan_application_id = ? AND purpose = 'agreement' AND otp_hash = ? AND verified = FALSE
       AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [loan.id, hashOtp(otp)],
  );
  if (rows.length === 0) return fail(res, 'Incorrect or expired OTP.', 401);

  await db.query('UPDATE otps SET verified = TRUE WHERE id = ?', [rows[0].id]);
  await db.query(
    `INSERT INTO loan_agreements (loan_application_id, signed, signed_at)
     VALUES (?, TRUE, NOW())
     ON DUPLICATE KEY UPDATE signed=TRUE, signed_at=NOW()`,
    [loan.id],
  );
  await markStepComplete(loan.id, 6);
  await notifyAgreementSigned(req.user.id, loan);

  return ok(res, {loanId: loan.id, signed: true});
});

// Builds a short-lived link the phone can open in its browser. The browser
// can't send our Bearer header, so the link carries a 1-hour token that is
// only valid for this one loan's agreement download.
const downloadUrlFor = (req, loan) => {
  const token = signDownloadToken({loanId: loan.id, userId: req.user.id});
  return `${req.protocol}://${req.get('host')}/api/loans/${loan.id}/agreement/download?token=${token}`;
};

// POST /api/loans/:id/agreement/download-link — "Download Agreement" button.
const getAgreementDownloadLink = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  return ok(res, {url: downloadUrlFor(req, loan)});
});

// GET /api/loans/:id/agreement/download?token=...  (no Bearer header; token in URL)
const downloadAgreement = asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = verifyToken(String(req.query.token || ''));
  } catch (e) {
    return fail(res, 'This download link is invalid or has expired.', 401);
  }
  if (payload.purpose !== 'agreement-download' || String(payload.loanId) !== String(req.params.id)) {
    return fail(res, 'This download link is invalid or has expired.', 401);
  }

  const loan = await loadLoanOr404(req.params.id, payload.userId, res);
  if (!loan) return;

  const data = await assembleAgreement(loan, payload.userId, null);
  if (!data.signature.signed) {
    return fail(res, 'Please sign the agreement first.', 409);
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="MoneyMitra-Agreement-${data.applicationNumber}.pdf"`);
  streamAgreementPdf(data, res);
});

// POST /api/loans/:id/disburse — final step, shown on AmountDisbursedScreen.
// Stubbed the same way as the insurance payment: replace with a real payout
// integration and only call this from its success callback/webhook.
const disburse = asyncHandler(async (req, res) => {
  const loan = await loadLoanOr404(req.params.id, req.user.id, res);
  if (!loan) return;
  if (!(await requireStepsDone(loan, 6, res))) return; // agreement must be signed

  await db.query('UPDATE loan_applications SET status = "approved" WHERE id = ?', [loan.id]);
  await markStepComplete(loan.id, 7);

  const [[bankRow]] = await db.query('SELECT account_number FROM bank_details WHERE loan_application_id = ?', [loan.id]);
  await notifyLoanDisbursed(req.user.id, loan, buildLoanSummary(loan), bankRow);

  return ok(res, {
    loanId: loan.id,
    amount: loan.amount,
    agreementUrl: downloadUrlFor(req, loan),
  });
});

module.exports = {
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
};