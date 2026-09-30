export type DocVerificationType = 'selfie' | 'aadhaar' | 'pan';

export interface DocVerificationConfig {
  type: DocVerificationType;
  icon: string;
  useFrontCamera: boolean;
}

export const DOC_VERIFICATION_CONFIG: Record<
  DocVerificationType,
  DocVerificationConfig
> = {
  selfie: {
    type: 'selfie',
    icon: 'face-recognition',
    useFrontCamera: true,
  },
  aadhaar: {
    type: 'aadhaar',
    icon: 'card-account-details-outline',
    useFrontCamera: false,
  },
  pan: {
    type: 'pan',
    icon: 'card-account-details',
    useFrontCamera: false,
  },
};