export interface UserProfile {
  fullName: string;
  avatarUri?: string;
  profileCompletionPercent: number;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  email: string;
  maritalStatus: string;
}

export const CURRENT_USER: UserProfile = {
  fullName: 'Raj Varma',
  avatarUri: undefined,
  profileCompletionPercent: 100,
  dobDay: '25',
  dobMonth: 'Jan',
  dobYear: '2025',
  gender: 'Male',
  email: 'Raj',
  maritalStatus: 'Married',
};
