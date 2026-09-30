import {LoanApplicationRecord, ProcessStep} from '../services/api';

/**
 * The 7 checklist steps and the App.tsx route each one opens.
 * These names match the AppRoute values in App.tsx.
 */
export const STEP_ROUTES: Record<number, string> = {
  1: 'personalInfoForm', // Loan Application
  2: 'selectLoanAmount', // Select Loan Amount
  3: 'uploadDocuments', // Document Verification
  4: 'bankDetails', // Add Bank Details
  5: 'insurancePayment', // Payment For Insurance
  6: 'reviewLoan', // Review & Sign Agreement
  7: 'agreementPreview', // Transfer Money (re-sign, then disburse)
};
export const FINAL_DETAILS_ROUTE = 'finalLoanDetails';
export const TOTAL_STEPS = 7;

/** First step that is not completed yet, or null when all 7 are done. */
export const getNextStep = (steps: ProcessStep[] = []): ProcessStep | null => {
  const sorted = [...steps].sort((a, b) => a.step_number - b.step_number);
  return sorted.find(s => !s.completed) ?? null;
};

export const countCompleted = (steps: ProcessStep[] = []) =>
  steps.filter(s => s.completed).length;

// ---------- formatting ----------

/** Indian digit grouping: 106619 -> "1,06,619". */
export const formatINR = (value: number | string | null | undefined) => {
  const n = Math.round(Number(value));
  if (!isFinite(n)) {
    return '—';
  }
  const s = String(Math.abs(n));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;
  return (n < 0 ? '-' : '') + grouped;
};

const trim = (n: number) => String(Number(n.toFixed(2)));

/** 100000 -> "1 Lakh", 250000 -> "2.5 Lakh", 20000000 -> "2 Crore", 45000 -> "45,000". */
export const formatAmountShort = (value: number | string | null | undefined) => {
  const n = Number(value);
  if (!value || !isFinite(n)) {
    return 'Amount not selected';
  }
  if (n >= 10000000) {
    return `${trim(n / 10000000)} Crore`;
  }
  if (n >= 100000) {
    return `${trim(n / 100000)} Lakh`;
  }
  return formatINR(n);
};

export const employmentLabel = (type?: string | null) =>
  type === 'self_employed'
    ? 'Self Employed'
    : type === 'salaried'
    ? 'Salaried'
    : '';

// ---------- Application-tab card ----------

export interface ApplicationCardModel {
  loan: LoanApplicationRecord;
  title: string;
  subtitle: string;
  amount: string;
  /** 'approved' = money disbursed, 'pending' = still in the process. */
  status: 'approved' | 'pending' | 'completed';
  ctaLabel: string;
  ctaDisabled: boolean;
  /** Screen to open when the button is pressed. */
  route: string | null;
  nextStep: ProcessStep | null;
  isClosed: boolean;
}

export const buildApplicationCard = (
  loan: LoanApplicationRecord,
): ApplicationCardModel => {
  const steps = loan.steps ?? [];
  const nextStep = getNextStep(steps);
  const done = countCompleted(steps);
  const employment = employmentLabel(loan.employment_type);

  const base = {
    loan,
    title: loan.loan_title,
    amount: formatAmountShort(loan.amount),
    nextStep,
  };

  // Repaid / closed
  if (loan.status === 'closed') {
    return {
      ...base,
      subtitle: employment || 'Loan closed',
      status: 'completed',
      ctaLabel: 'Completed',
      ctaDisabled: true,
      route: null,
      isClosed: true,
    };
  }

  // Money already transferred (all 7 steps done) -> show final loan details
  if (loan.status === 'approved' || !nextStep) {
    return {
      ...base,
      subtitle: employment || 'Loan disbursed',
      status: 'approved',
      ctaLabel: 'Final Loan Details',
      ctaDisabled: false,
      route: FINAL_DETAILS_ROUTE,
      isClosed: false,
    };
  }

  // In progress: resume exactly where the user stopped.
  return {
    ...base,
    subtitle: `Step ${nextStep.step_number} of ${TOTAL_STEPS} · ${nextStep.title}`,
    status: 'pending',
    ctaLabel: done === 0 ? 'Start Application' : 'Continue',
    ctaDisabled: false,
    route: STEP_ROUTES[nextStep.step_number] ?? null,
    isClosed: false,
  };
};