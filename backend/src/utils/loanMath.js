// Shared EMI math so SelectLoanAmountScreen, PaymentForInsuranceScreen and
// ReviewLoanDetailsScreen all compute the same numbers from the same inputs.

function calculateEmi(principal, annualRatePercent, tenureMonths) {
  const monthlyRate = annualRatePercent / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / tenureMonths);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

function buildLoanSummary(loan) {
  const principal = Number(loan.amount);
  const tenure = Number(loan.tenure_months);
  const rate = Number(loan.interest_rate);
  const processingFee = Number(loan.processing_fee);
  const insuranceCharge = Number(loan.insurance_charge);

  const monthlyEmi = calculateEmi(principal, rate, tenure);
  const totalRepayable = monthlyEmi * tenure;
  const preEmi = Math.round(monthlyEmi / 3); // sample pre-EMI, adjust to your policy
  const finalTransferable = Math.round(principal - processingFee - preEmi);

  return {
    loanAmount: principal,
    tenureMonths: tenure,
    interestRate: rate,
    monthlyEmi,
    totalRepayable,
    processingFee,
    preEmi,
    finalTransferable,
    insuranceCharge,
  };
}

module.exports = {calculateEmi, buildLoanSummary};
