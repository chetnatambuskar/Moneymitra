export const GENDER_OPTIONS = ['Male', 'Female', 'Others'];
export const MARITAL_STATUS_OPTIONS = ['Married', 'Single'];
export const EMPLOYMENT_TYPE_OPTIONS = [
  'Business',
  'Self Employed',
  'Salaried',
  'Student',
];

export interface PersonalInfoFormData {
  purpose: string | undefined;
  address: string | undefined;
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
