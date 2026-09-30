export interface FinalLoanDetails {
  lendingPartner: string;
  loanAmount: string;
  processingFee: string;
  preEmi: string;
  amountTransferrableNote: string;
  loanTenure: string;
  monthlyEmi: string;
  firstEmiDate: string;
  interestRate: string;
}

export const MOCK_FINAL_LOAN_DETAILS: FinalLoanDetails = {
  lendingPartner: 'MoneyMitra',
  loanAmount: '1,00,000',
  processingFee: '500',
  preEmi: '1000',
  amountTransferrableNote: 'Subject To Date of Disbursal',
  loanTenure: '12 Months',
  monthlyEmi: '3000',
  firstEmiDate: '10 November 2026',
  interestRate: '12.0%',
};