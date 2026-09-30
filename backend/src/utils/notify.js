const db = require('../config/db');

const inr = n => '\u20B9' + Number(n).toLocaleString('en-IN', {maximumFractionDigits: 0});
const istDate = d => d.toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata', day: '2-digit', month: 'long', year: 'numeric'});
const istTime = d => d.toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true}).toUpperCase();
const maskAcc = n => (n ? 'XXXX XXXX ' + String(n).slice(-4) : '-');

const SUPPORT = 'If you have any questions, please contact our customer support team through the Help Center.';

/**
 * Saves one notification for a user. Never throws: a failed notification
 * must not break the loan step that triggered it.
 * `data` = {intro, loanDetails: [{label, value}], whatsNext, needAssistance}
 */
async function notify(userId, {title, message, type = 'general', data = null}) {
  try {
    await db.query(
      'INSERT INTO notifications (user_id, title, message, type, data) VALUES (?, ?, ?, ?, ?)',
      [userId, title, message, type, data ? JSON.stringify(data) : null],
    );
  } catch (err) {
    console.error('[notify] failed:', err.message);
  }
}

const notifyApplicationSubmitted = (userId, loan) =>
  notify(userId, {
    title: 'Application Submitted',
    message: `Your ${loan.loan_title} application has been submitted. Complete the remaining steps to get your money.`,
    type: 'application',
    data: {
      intro: `Your ${loan.loan_title} application was submitted successfully.`,
      loanDetails: [{label: 'Loan Type', value: loan.loan_title}, {label: 'Application ID', value: String(loan.id)}],
      whatsNext: 'Select your loan amount, verify your documents and add your bank details to continue.',
      needAssistance: SUPPORT,
    },
  });

const notifyDocumentsUploaded = userId =>
  notify(userId, {
    title: 'Documents Uploaded',
    message: 'Your selfie, Aadhaar and PAN have been uploaded successfully.',
    type: 'documents',
    data: {
      intro: 'All three verification documents (selfie, Aadhaar and PAN) were received.',
      loanDetails: [],
      whatsNext: 'Continue with your bank details to move to the next step.',
      needAssistance: SUPPORT,
    },
  });

const notifyInsurancePaid = (userId, loan) =>
  notify(userId, {
    title: 'Insurance Payment Received',
    message: `We received your insurance payment of ${inr(loan.insurance_charge)}.`,
    type: 'payment',
    data: {
      intro: 'Your insurance payment was received.',
      loanDetails: [
        {label: 'Insurance Charge', value: inr(loan.insurance_charge)},
        {label: 'Paid On', value: `${istDate(new Date())} ${istTime(new Date())}`},
      ],
      whatsNext: 'Review your loan agreement and sign it with an OTP.',
      needAssistance: SUPPORT,
    },
  });

const notifyAgreementSigned = (userId, loan) =>
  notify(userId, {
    title: 'Agreement Signed',
    message: 'Your loan agreement was signed successfully with OTP.',
    type: 'agreement',
    data: {
      intro: 'You have digitally signed your loan agreement using an OTP.',
      loanDetails: [
        {label: 'Loan Amount', value: loan.amount ? inr(loan.amount) : '-'},
        {label: 'Signed On', value: `${istDate(new Date())} ${istTime(new Date())}`},
      ],
      whatsNext: 'Your loan amount will be transferred to your bank account next.',
      needAssistance: SUPPORT,
    },
  });

const notifyLoanDisbursed = (userId, loan, summary, bank) => {
  const now = new Date();
  return notify(userId, {
    title: 'Loan Disbursed Successfully',
    message: `Your loan amount of ${inr(loan.amount)} has been disbursed to your bank account.`,
    type: 'disbursement',
    data: {
      intro:
        `Congratulations! Your approved loan of ${inr(loan.amount)} has been disbursed to your registered bank account ending in ${bank ? String(bank.account_number).slice(-4) : 'XXXX'}.\n` +
        "The funds should be available shortly, depending on your bank's processing time.",
      loanDetails: [
        {label: 'Loan Amount', value: inr(loan.amount)},
        {label: 'Disbursed Amount', value: inr(summary.finalTransferable)},
        {label: 'Bank Account', value: maskAcc(bank && bank.account_number)},
        {label: 'Monthly EMI', value: inr(summary.monthlyEmi)},
        {label: 'Disbursement Date', value: istDate(now)},
        {label: 'Disbursement Time', value: istTime(now)},
      ],
      whatsNext:
        'Your EMI schedule is now active. Please keep enough balance in your account on the due dates to avoid delays or extra charges.',
      needAssistance: SUPPORT,
    },
  });
};

module.exports = {
  notify,
  notifyApplicationSubmitted,
  notifyDocumentsUploaded,
  notifyInsurancePaid,
  notifyAgreementSigned,
  notifyLoanDisbursed,
};