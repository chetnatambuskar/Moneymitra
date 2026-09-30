const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const GREEN = '#17962F';
const GREY = '#757575';
const BLACK = '#1A1A1A';
const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');

// pdfkit's built-in fonts have no rupee glyph, so amounts use "Rs.".
const money = v =>
  v === null || v === undefined ? '-' : 'Rs. ' + Number(v).toLocaleString('en-IN', {maximumFractionDigits: 0});
const dash = v => (v === null || v === undefined || v === '' ? '-' : String(v));

// selfie URL -> file on disk (uploads/selfie/<name>), or null
function localSelfiePath(url) {
  if (!url) return null;
  const file = path.join(UPLOAD_ROOT, 'selfie', path.basename(String(url).split('?')[0]));
  return fs.existsSync(file) ? file : null;
}

function section(doc, title) {
  doc.moveDown(0.8);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK).text(title);
  const y = doc.y + 2;
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y)
    .lineWidth(1).strokeColor('#8BD17C').stroke();
  doc.moveDown(0.5);
}

// Two-column "label ........ value" row.
function row(doc, label, value, bold = false) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const y = doc.y;
  doc.font('Helvetica').fontSize(10).fillColor(GREY).text(label, left, y, {width: width * 0.5});
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor(BLACK)
    .text(dash(value), left + width * 0.5, y, {width: width * 0.5, align: 'right'});
  doc.moveDown(0.35);
}

/** Writes the signed agreement PDF for `data` (from assembleAgreement) into `res`. */
function streamAgreementPdf(data, res) {
  const doc = new PDFDocument({size: 'A4', margin: 48, info: {Title: 'MoneyMitra Loan Agreement'}});
  doc.pipe(res);

  const a = data.applicant;
  const l = data.loan;

  // ---- header
  doc.font('Helvetica-Bold').fontSize(18).fillColor(GREEN).text('MoneyMitra');
  doc.font('Helvetica-Bold').fontSize(13).fillColor(BLACK).text('PERSONAL LOAN APPLICATION & AGREEMENT');
  doc.font('Helvetica').fontSize(9).fillColor(GREY)
    .text(`Application Number: ${data.applicationNumber}`)
    .text(`Application Date: ${dash(data.applicationDate)}`);

  const photo = localSelfiePath(a.photoUrl);
  if (photo) {
    try {
      doc.image(photo, doc.page.width - doc.page.margins.right - 70, doc.page.margins.top, {fit: [70, 80]});
    } catch (e) {
      /* unsupported image: skip the photo */
    }
  }

  doc.moveDown(0.6);
  doc.font('Helvetica').fontSize(9).fillColor(GREY)
    .text(`I hereby request you to grant me a ${data.loanTitle} based on the following information.`, {width: 400});

  // ---- applicant
  section(doc, 'Applicant Detail');
  row(doc, 'Name', a.name);
  row(doc, 'Date of Birth', a.dob);
  row(doc, 'Gender', a.gender);
  row(doc, 'Marital Status', a.maritalStatus);
  row(doc, 'Email ID', a.email);
  row(doc, 'Phone No.', a.phone ? `+91${String(a.phone).replace(/^\+?91/, '')}` : null);

  section(doc, 'Documents');
  row(doc, 'Proof of Identity (PAN)', data.documents.identitySubmitted ? 'SUBMITTED' : 'NOT SUBMITTED');
  row(doc, 'Proof of Address (Aadhaar)', data.documents.addressSubmitted ? 'SUBMITTED' : 'NOT SUBMITTED');

  section(doc, 'Employment Details');
  row(doc, 'Source of Income', data.employment.type);
  row(doc, 'Monthly Income', data.employment.monthlyIncome != null ? money(data.employment.monthlyIncome) : null);
  row(doc, 'Company Name', data.employment.companyName);
  row(doc, 'Work Email ID', data.employment.workEmail);

  section(doc, 'Bank Account Details');
  row(doc, 'Bank Name', data.bank && data.bank.bankName);
  row(doc, 'Account Number', data.bank && data.bank.accountNumber);
  row(doc, 'IFSC Code', data.bank && data.bank.ifscCode);

  // ---- loan terms
  section(doc, 'Loan Terms');
  row(doc, 'Lending Partner', 'MoneyMitra', true);
  row(doc, 'Loan Amount', l ? money(l.loanAmount) : null);
  row(doc, 'Loan Tenure', l ? `${l.tenureMonths} Months` : null);
  row(doc, 'Interest Rate', l ? `${l.interestRate}% p.a.` : null);
  row(doc, 'Monthly EMI', l ? money(l.monthlyEmi) : null);
  row(doc, '1st EMI Date', l && l.firstEmiDate);
  row(doc, 'Total Repayable Amount', l ? money(l.totalRepayable) : null);
  row(doc, 'Processing Fee', l ? money(l.processingFee) : null);
  row(doc, 'Pre-EMI', l ? money(l.preEmi) : null);
  row(doc, 'Insurance Charge', l ? money(l.insuranceCharge) : null);
  row(doc, 'Amount Transferable', l ? money(l.finalTransferable) : null, true);

  // ---- declaration + signature
  section(doc, 'Declaration');
  doc.font('Helvetica').fontSize(9).fillColor(BLACK).text(
    'I confirm that the details given in this application are true and complete. I authorise MoneyMitra ' +
      'to verify them, to obtain my credit information, and to collect the EMI from the bank account ' +
      'mentioned in this application as per the repayment schedule. I have read and understood the ' +
      'interest rate, charges and repayment terms shown above.',
    {align: 'justify'},
  );

  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(10).fillColor(BLACK)
    .text(`Digitally signed by ${dash(a.name)}`);
  doc.font('Helvetica').fontSize(9).fillColor(GREY)
    .text('Method: e-Sign using OTP')
    .text(`Signed on: ${dash(data.signature.signedAt)}`);

  doc.end();
}

module.exports = {streamAgreementPdf};