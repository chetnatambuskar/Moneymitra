export const GENDER_OPTIONS = ['Male', 'Female', 'Others'];
export const MARITAL_STATUS_OPTIONS = ['Married', 'Single'];
export const EMPLOYMENT_TYPE_OPTIONS = [
  'Business',
  'Self Employed',
  'Salaried',
  'Student',
];

export const DOB_DAY_OPTIONS = Array.from({length: 31}, (_, i) =>
  String(i + 1).padStart(2, '0'),
);
export const DOB_MONTH_OPTIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const CURRENT_YEAR = new Date().getFullYear();
export const DOB_YEAR_OPTIONS = Array.from({length: 80}, (_, i) =>
  String(CURRENT_YEAR - i),
);

export interface PersonalInfoFormData {
  nameAsPerPan: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  email: string;
  maritalStatus: string;
  loanAmount: string;
  employmentType: string;
  panNumber: string;
}

export interface ProfessionalInfoFormData {
  companyName: string;
  designation: string;
  monthlyIncome: string;
  workExperience: string;
}

export interface LoanApplicationFormState {
  loanTitle?: string;
  personal?: PersonalInfoFormData;
  otp?: string;
  professional?: ProfessionalInfoFormData;
}
