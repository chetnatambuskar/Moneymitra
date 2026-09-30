export interface LoanSummaryRow {
  label: string;
  value: string;
}

export interface InsurancePaymentData {
  loanTitle: string;
  loanSubtitle: string;
  headlineAmount: string;
  rows: LoanSummaryRow[];
  insuranceCharge: number;
}

// Mock data — replace with the real API response. The Figma frame used
// "Loan Amount" as a placeholder for EMI / rate / total, so these are sample
// values (12% p.a., 12 months) that are internally consistent.
export const MOCK_INSURANCE_PAYMENT: InsurancePaymentData = {
  loanTitle: 'Personal Loan',
  loanSubtitle: 'Self Employed',
  headlineAmount: '1 Lakh',
  rows: [
    {label: 'Loan Amount', value: '1,00,000'},
    {label: 'Loan Tenure', value: '12 Months'},
    {label: 'Monthly EMI', value: '8,885'},
    {label: 'Interest Rate', value: '12%'},
    {label: 'Total Repayable Amount', value: '1,06,619'},
    {label: 'Processing Fee', value: '500'},
    {label: 'Final Transferable Amount', value: '98,500'},
  ],
  insuranceCharge: 1000,
};