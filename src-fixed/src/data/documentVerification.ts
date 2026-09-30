export interface DocumentVerificationItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  verified: boolean;
}

export const DOCUMENT_VERIFICATION_ITEMS: DocumentVerificationItem[] = [
  {
    id: 'selfie',
    icon: 'face-recognition',
    title: 'Click Your Own Selfie',
    subtitle: 'Document Verification',
    verified: true,
  },
  {
    id: 'aadhaar',
    icon: 'card-account-details-outline',
    title: 'Verify Aadhaar Card',
    subtitle: 'Document Verification',
    verified: true,
  },
  {
    id: 'pan',
    icon: 'card-account-details',
    title: 'Verify Pan Card',
    subtitle: 'Document Verification',
    verified: true,
  },
];
