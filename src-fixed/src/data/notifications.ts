export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  detailIntro: string;
  loanDetails: {label: string; value: string}[];
  whatsNext: string;
  needAssistance: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Loan Disbursed Sucessfully',
    summary:
      'Your loan amount of 1,00,000 has been disbursed to your bank account.',
    timestamp: 'Today 03:45 PM',
    detailIntro:
      "Congratulations! Your approved loan amount of ₹1,00,000 has been successfully disbursed to your registered bank account ending in XXXX. The transfer was completed on 05 June 2026 at 03:45 PM.\nThe funds should be available in your account shortly, depending on your bank's processing time. You can use the amount for your financial needs immediately after it is credited.",
    loanDetails: [
      {label: 'Loan Amount', value: '₹1,00,000'},
      {label: 'Disbursed Amount', value: '₹1,00,000'},
      {label: 'Transaction ID', value: 'TXN784526987'},
      {label: 'Bank Account', value: 'XXXX XXXX 4582'},
      {label: 'Disbursement Date', value: '05 June 2026'},
      {label: 'Disbursement Time', value: '03:45 PM'},
    ],
    whatsNext:
      'Your EMI schedule is now active. Please ensure sufficient balance is maintained in your account on the due dates to avoid payment delays or additional charges. You can view your repayment schedule and loan agreement from the Loan Details section.',
    needAssistance:
      'If you have any questions regarding your loan or disbursement, please contact our customer support team through the Help Center.',
  },
  {
    id: '2',
    title: 'Loan Disbursed Sucessfully',
    summary:
      'Your loan amount of 1,00,000 has been disbursed to your bank account.',
    timestamp: 'Today 03:45 PM',
    detailIntro:
      "Congratulations! Your approved loan amount of ₹1,00,000 has been successfully disbursed to your registered bank account ending in XXXX. The transfer was completed on 05 June 2026 at 03:45 PM.\nThe funds should be available in your account shortly, depending on your bank's processing time. You can use the amount for your financial needs immediately after it is credited.",
    loanDetails: [
      {label: 'Loan Amount', value: '₹1,00,000'},
      {label: 'Disbursed Amount', value: '₹1,00,000'},
      {label: 'Transaction ID', value: 'TXN784526987'},
      {label: 'Bank Account', value: 'XXXX XXXX 4582'},
      {label: 'Disbursement Date', value: '05 June 2026'},
      {label: 'Disbursement Time', value: '03:45 PM'},
    ],
    whatsNext:
      'Your EMI schedule is now active. Please ensure sufficient balance is maintained in your account on the due dates to avoid payment delays or additional charges. You can view your repayment schedule and loan agreement from the Loan Details section.',
    needAssistance:
      'If you have any questions regarding your loan or disbursement, please contact our customer support team through the Help Center.',
  },
  {
    id: '3',
    title: 'Loan Disbursed Sucessfully',
    summary:
      'Your loan amount of 1,00,000 has been disbursed to your bank account.',
    timestamp: 'Today 03:45 PM',
    detailIntro:
      "Congratulations! Your approved loan amount of ₹1,00,000 has been successfully disbursed to your registered bank account ending in XXXX. The transfer was completed on 05 June 2026 at 03:45 PM.\nThe funds should be available in your account shortly, depending on your bank's processing time. You can use the amount for your financial needs immediately after it is credited.",
    loanDetails: [
      {label: 'Loan Amount', value: '₹1,00,000'},
      {label: 'Disbursed Amount', value: '₹1,00,000'},
      {label: 'Transaction ID', value: 'TXN784526987'},
      {label: 'Bank Account', value: 'XXXX XXXX 4582'},
      {label: 'Disbursement Date', value: '05 June 2026'},
      {label: 'Disbursement Time', value: '03:45 PM'},
    ],
    whatsNext:
      'Your EMI schedule is now active. Please ensure sufficient balance is maintained in your account on the due dates to avoid payment delays or additional charges. You can view your repayment schedule and loan agreement from the Loan Details section.',
    needAssistance:
      'If you have any questions regarding your loan or disbursement, please contact our customer support team through the Help Center.',
  },
  {
    id: '4',
    title: 'Loan Disbursed Sucessfully',
    summary:
      'Your loan amount of 1,00,000 has been disbursed to your bank account.',
    timestamp: 'Today 03:45 PM',
    detailIntro:
      "Congratulations! Your approved loan amount of ₹1,00,000 has been successfully disbursed to your registered bank account ending in XXXX. The transfer was completed on 05 June 2026 at 03:45 PM.\nThe funds should be available in your account shortly, depending on your bank's processing time. You can use the amount for your financial needs immediately after it is credited.",
    loanDetails: [
      {label: 'Loan Amount', value: '₹1,00,000'},
      {label: 'Disbursed Amount', value: '₹1,00,000'},
      {label: 'Transaction ID', value: 'TXN784526987'},
      {label: 'Bank Account', value: 'XXXX XXXX 4582'},
      {label: 'Disbursement Date', value: '05 June 2026'},
      {label: 'Disbursement Time', value: '03:45 PM'},
    ],
    whatsNext:
      'Your EMI schedule is now active. Please ensure sufficient balance is maintained in your account on the due dates to avoid payment delays or additional charges. You can view your repayment schedule and loan agreement from the Loan Details section.',
    needAssistance:
      'If you have any questions regarding your loan or disbursement, please contact our customer support team through the Help Center.',
  },
  {
    id: '5',
    title: 'Loan Disbursed Sucessfully',
    summary:
      'Your loan amount of 1,00,000 has been disbursed to your bank account.',
    timestamp: 'Today 03:45 PM',
    detailIntro:
      "Congratulations! Your approved loan amount of ₹1,00,000 has been successfully disbursed to your registered bank account ending in XXXX. The transfer was completed on 05 June 2026 at 03:45 PM.\nThe funds should be available in your account shortly, depending on your bank's processing time. You can use the amount for your financial needs immediately after it is credited.",
    loanDetails: [
      {label: 'Loan Amount', value: '₹1,00,000'},
      {label: 'Disbursed Amount', value: '₹1,00,000'},
      {label: 'Transaction ID', value: 'TXN784526987'},
      {label: 'Bank Account', value: 'XXXX XXXX 4582'},
      {label: 'Disbursement Date', value: '05 June 2026'},
      {label: 'Disbursement Time', value: '03:45 PM'},
    ],
    whatsNext:
      'Your EMI schedule is now active. Please ensure sufficient balance is maintained in your account on the due dates to avoid payment delays or additional charges. You can view your repayment schedule and loan agreement from the Loan Details section.',
    needAssistance:
      'If you have any questions regarding your loan or disbursement, please contact our customer support team through the Help Center.',
  },
];
