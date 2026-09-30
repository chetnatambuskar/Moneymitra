export type LoanStatus = 'approved' | 'pending' | 'completed';

export interface LoanApplication {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  status: LoanStatus;
  ctaLabel: string;
  ctaDisabled?: boolean;
}

export const ACTIVE_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: '1',
    title: 'Personal Loan',
    subtitle: 'Self Employed',
    amount: '1 Lakh',
    status: 'approved',
    ctaLabel: 'Complete your process',
  },
  {
    id: '2',
    title: 'Personal Loan',
    subtitle: 'Self Employed',
    amount: '1 Lakh',
    status: 'approved',
    ctaLabel: 'Final Loan Details',
  },
  {
    id: '3',
    title: 'Personal Loan',
    subtitle: 'Self Employed',
    amount: '1 Lakh',
    status: 'pending',
    ctaLabel: 'Loan Not Approved Yet',
    ctaDisabled: true,
  },
];

export const CLOSED_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: '4',
    title: 'Personal Loan',
    subtitle: 'Self Employed',
    amount: '1 Lakh',
    status: 'completed',
    ctaLabel: 'Completed',
    ctaDisabled: true,
  },
];