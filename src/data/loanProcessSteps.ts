export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  completed: boolean;
}

export type LoanProcessStep = ProcessStep;

export const LOAN_PROCESS_STEPS: ProcessStep[] = [
  {id: '1', step: 1, title: 'Loan Application', completed: true},
  {id: '2', step: 2, title: 'Select Loan Amount', completed: true},
  {id: '3', step: 3, title: 'Document Verification', completed: true},
  {id: '4', step: 4, title: 'Add Bank Details', completed: true},
  {id: '5', step: 5, title: 'Payment For Insurance', completed: false},
  {id: '6', step: 6, title: 'Review & Sign Agreement', completed: false},
  {id: '7', step: 7, title: 'Transfer Money To Bank Account', completed: false},
];
