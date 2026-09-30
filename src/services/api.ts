import {getApiBaseUrl} from './config';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface User {
  id: number;
  mobile_number: string;
  full_name?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  marital_status?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface ProcessStep {
  step_number: number;
  title: string;
  completed: boolean;
  completed_at: string | null;
}

export interface LoanApplicationRecord {
  id: number;
  user_id: number;
  loan_title: string;
  amount: number | string | null;
  tenure_months: number | null;
  interest_rate: number | string;
  processing_fee: number | string;
  insurance_charge: number | string;
  status: 'draft' | 'in_progress' | 'pending' | 'approved' | 'closed';
  created_at: string;
  employment_type?: 'salaried' | 'self_employed' | null;
  steps?: ProcessStep[];
}

export interface LoanSummaryCalculation {
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
  monthlyEmi: number;
  totalRepayable: number;
  processingFee: number;
  preEmi: number;
  finalTransferable: number;
  insuranceCharge: number;
}

export interface LoanReviewData {
  lendingPartner: string;
  loanAmount: number;
  processingFee: number;
  preEmi: number;
  amountTransferable: number;
  loanTenure: number;
  monthlyEmi: number;
  firstEmiDate: string;
  interestRate: number;
}

export interface AgreementFormData {
  loanId: number;
  applicationNumber: string;
  applicationDate: string | null;
  loanTitle: string;
  applicant: {
    name: string | null;
    dob: string | null;
    gender: string | null;
    maritalStatus: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    purpose: string | null;
    photoUrl: string | null;
  };
  documents: {
    identitySubmitted: boolean;
    addressSubmitted: boolean;
    selfieSubmitted: boolean;
  };
  employment: {
    type: string | null;
    companyName: string | null;
    workEmail: string | null;
    monthlyIncome: number | null;
  };
  loan:
    | (LoanSummaryCalculation & {
        firstEmiDate: string | null;
      })
    | null;
  bank: {
    bankName: string;
    accountNumber: string | null;
    ifscCode: string;
  } | null;
  signature: {signed: boolean; signedAt: string | null};
}

export interface KycDocRecord {
  doc_type: 'selfie' | 'aadhaar' | 'pan';
  file_url: string;
  verified: boolean;
  uploaded_at: string;
}

export interface NotificationRecord {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  data?: {
    intro?: string;
    loanDetails?: {label: string; value: string}[];
    whatsNext?: string;
    needAssistance?: string;
  } | null;
}

export interface BankDetailsRecord {
  id: number;
  loan_application_id: number;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  statement_file_url?: string | null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${getApiBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  // If body is NOT FormData, default to application/json
  if (
    options.body &&
    !(typeof FormData !== 'undefined' && options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      const errorMsg =
        json.message ||
        `Request failed with status ${res.status}: ${res.statusText}`;
      const err = new Error(errorMsg);
      (err as any).response = json;
      (err as any).status = res.status;
      throw err;
    }

    return json;
  } catch (error: any) {
    console.warn(`[API] ${options.method || 'GET'} ${path} error:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// Auth API
// -------------------------------------------------------------
export const authApi = {
  sendOtp: async (mobileNumber: string) => {
    const res = await request<{mobileNumber: string; otp?: string}>(
      '/auth/send-otp',
      {
        method: 'POST',
        body: JSON.stringify({mobileNumber}),
      },
    );
    return res.data;
  },

  verifyOtp: async (mobileNumber: string, otp: string) => {
    const res = await request<{token: string; user: User}>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({mobileNumber, otp}),
    });
    setAuthToken(res.data.token);
    return res.data;
  },
};

// -------------------------------------------------------------
// Profile API
// -------------------------------------------------------------
export const profileApi = {
  getProfile: async () => {
    const res = await request<User>('/profile');
    return res.data;
  },

  updateProfile: async (data: {
    fullName?: string;
    email?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
  }) => {
    const res = await request<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  uploadAvatar: async (fileUri: string, mimeType?: string) => {
    const formData = new FormData();
    const ext = (fileUri.split('.').pop() || 'jpg').toLowerCase();
    formData.append('file', {
      uri: fileUri,
      name: `avatar_${Date.now()}.${ext}`,
      type: mimeType || (ext === 'png' ? 'image/png' : 'image/jpeg'),
    } as any);

    const res = await request<User>('/profile/avatar', {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },
};

// -------------------------------------------------------------
// Loan API
// -------------------------------------------------------------
export const loanApi = {
  createLoan: async (loanTitle: string) => {
    const res = await request<LoanApplicationRecord>('/loans', {
      method: 'POST',
      body: JSON.stringify({loanTitle}),
    });
    return res.data;
  },

  listLoans: async () => {
    const res = await request<LoanApplicationRecord[]>('/loans');
    return res.data;
  },

  getLoan: async (id: number) => {
    const res = await request<LoanApplicationRecord>(`/loans/${id}`);
    return res.data;
  },

  savePersonalInfo: async (
    id: number,
    data: {
      fullName: string;
      dob?: string;
      gender?: string;
      email?: string;
      maritalStatus?: string;
      address?: string;
      purpose?: string;
    },
  ) => {
    const res = await request<{loanId: number; saved: boolean}>(
      `/loans/${id}/personal-info`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
    return res.data;
  },

  saveProfessionalInfo: async (
    id: number,
    data: {
      employmentType: 'salaried' | 'self_employed';
      companyName?: string;
      workEmail?: string;
      monthlyIncome?: number;
      sourceOfIncome?: string;
    },
  ) => {
    const res = await request<{loanId: number; saved: boolean}>(
      `/loans/${id}/professional-info`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
    return res.data;
  },

  setLoanAmount: async (
    id: number,
    amount: number,
    tenureMonths: number,
  ) => {
    const res = await request<LoanApplicationRecord>(`/loans/${id}/amount`, {
      method: 'PUT',
      body: JSON.stringify({amount, tenureMonths}),
    });
    return res.data;
  },

  getBankDetails: async (id: number) => {
    const res = await request<BankDetailsRecord | null>(
      `/loans/${id}/bank-details`,
    );
    return res.data;
  },

  saveBankDetails: async (
    id: number,
    details: {
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      fileUri?: string | null;
      fileName?: string;
      fileType?: string;
    },
  ) => {
    const formData = new FormData();
    formData.append('bankName', details.bankName);
    formData.append('accountHolderName', details.accountHolderName);
    formData.append('accountNumber', details.accountNumber);
    formData.append('ifscCode', details.ifscCode);

    if (details.fileUri) {
      formData.append('file', {
        uri: details.fileUri,
        name: details.fileName || 'statement.pdf',
        type: details.fileType || 'application/pdf',
      } as any);
    }

    const res = await request<BankDetailsRecord>(`/loans/${id}/bank-details`, {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },

  getInsuranceSummary: async (id: number) => {
    const res = await request<LoanSummaryCalculation>(
      `/loans/${id}/insurance-summary`,
    );
    return res.data;
  },

  payInsurance: async (id: number) => {
    const res = await request<{loanId: number; status: string}>(
      `/loans/${id}/insurance-payment`,
      {
        method: 'POST',
      },
    );
    return res.data;
  },

  getReview: async (id: number) => {
    const res = await request<LoanReviewData>(`/loans/${id}/review`);
    return res.data;
  },

  getAgreement: async (id: number) => {
    const res = await request<AgreementFormData>(`/loans/${id}/agreement`);
    return res.data;
  },

  /** Short-lived link that opens the signed agreement PDF in the browser. */
  getAgreementDownloadLink: async (id: number) => {
    const res = await request<{url: string}>(
      `/loans/${id}/agreement/download-link`,
      {method: 'POST'},
    );
    return res.data.url;
  },

  sendAgreementOtp: async (id: number) => {
    const res = await request<{loanId: number; otp?: string}>(
      `/loans/${id}/agreement/send-otp`,
      {
        method: 'POST',
      },
    );
    return res.data;
  },

  verifyAgreementOtp: async (id: number, otp: string) => {
    const res = await request<{loanId: number; signed: boolean}>(
      `/loans/${id}/agreement/verify-otp`,
      {
        method: 'POST',
        body: JSON.stringify({otp}),
      },
    );
    return res.data;
  },

  disburse: async (id: number) => {
    const res = await request<{
      loanId: number;
      amount: number | string;
      agreementUrl: string | null;
    }>(`/loans/${id}/disburse`, {
      method: 'POST',
    });
    return res.data;
  },
};

// -------------------------------------------------------------
// Document API
// -------------------------------------------------------------
export const documentApi = {
  listDocuments: async () => {
    const res = await request<KycDocRecord[]>('/documents');
    return res.data;
  },

  uploadDocument: async (
    docType: 'selfie' | 'aadhaar' | 'pan',
    fileUri: string,
    loanApplicationId?: number,
  ) => {
    const formData = new FormData();
    const ext = fileUri.split('.').pop() || 'jpg';
    formData.append('file', {
      uri: fileUri,
      name: `${docType}_${Date.now()}.${ext}`,
      type: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
    } as any);

    if (loanApplicationId) {
      formData.append('loanApplicationId', String(loanApplicationId));
    }

    const res = await request<{docType: string; fileUrl: string}>(
      `/documents/${docType}`,
      {
        method: 'POST',
        body: formData,
      },
    );
    return res.data;
  },
};

// -------------------------------------------------------------
// Notification API
// -------------------------------------------------------------
export const notificationApi = {
  unreadCount: async () => {
    const res = await request<{count: number}>('/notifications/unread-count');
    return res.data.count;
  },

  listNotifications: async () => {
    const res = await request<NotificationRecord[]>('/notifications');
    return res.data;
  },

  getNotification: async (id: number) => {
    const res = await request<NotificationRecord>(`/notifications/${id}`);
    return res.data;
  },

  markRead: async (id: number) => {
    const res = await request<{id: number; isRead: boolean}>(
      `/notifications/${id}/read`,
      {
        method: 'PUT',
      },
    );
    return res.data;
  },
};

// Add to the bottom of src/services/api.ts
export const cibilApi = {
  sendOtp: async () => {
    const res = await request<{mobileNumber: string; otp?: string}>(
      '/cibil/send-otp',
      {method: 'POST'},
    );
    return res.data;
  },

  verifyOtp: async (otp: string) => {
    const res = await request<{verified: boolean}>('/cibil/verify-otp', {
      method: 'POST',
      body: JSON.stringify({otp}),
    });
    return res.data;
  },
};