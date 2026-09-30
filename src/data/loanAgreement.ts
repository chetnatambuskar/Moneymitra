export interface ReviewRow {
  label: string;
  value: string;
  bold?: boolean;
  caption?: string;
}

// Mock data — replace with the real API response.
export const REVIEW_LOAN_TOP_ROWS: ReviewRow[] = [
  {label: 'Lending Partner', value: 'MoneyMitra'},
  {label: 'Loan Amount', value: '1,00,000'},
  {label: 'Processing Fee (with taxes)', value: '500'},
  {label: 'Pre-EMI', value: '1000'},
  {
    label: 'Amount Transferrable',
    value: '98,500',
    bold: true,
    caption: 'Subject To Date of Disbursal',
  },
];

export const REVIEW_LOAN_BOTTOM_ROWS: ReviewRow[] = [
  {label: 'Loan Tenure', value: '12 Months'},
  {label: 'Monthly EMI', value: '3000'},
  {label: '1st EMI Date', value: '10 November 2026'},
  {label: 'Interest Rate', value: '12.0%'},
];

export const DISBURSED_AMOUNT = '1,00,000';