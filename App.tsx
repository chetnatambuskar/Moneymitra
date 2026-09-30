/**
 * MoneyMitra
 * @format
 */
import React, {useCallback, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import NotificationDetailScreen from './src/screens/NotificationDetailScreen';
import ApplicationScreen from './src/screens/ApplicationScreen';
import CompleteProcessScreen from './src/screens/CompleteProcessScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen, {ProfileData} from './src/screens/ProfileScreen';
import DocumentVerifiedScreen from './src/screens/DocumentVerifiedScreen';
import UploadDocumentForVerificationScreen from './src/screens/UploadDocumentForVerificationScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen';
import PersonalInformationFormScreen from './src/screens/PersonalInformationFormScreen';
import CibilReportScreen from './src/screens/CibilReportScreen';
import ProfessionalInformationScreen from './src/screens/ProfessionalInformationScreen';
import FinalLoanDetailsScreen from './src/screens/FinalLoanDetailsScreen';
import SelectLoanAmountScreen from './src/screens/SelectLoanAmountScreen';
import DocVerificationIntroScreen from './src/screens/DocVerificationIntroScreen';
import DocLiveCameraScreen from './src/screens/DocLiveCameraScreen';
import DocVerificationReviewScreen from './src/screens/DocVerificationReviewScreen';
import PaymentForInsuranceScreen from './src/screens/PaymentForInsuranceScreen';
import ReviewLoanDetailsScreen from './src/screens/ReviewLoanDetailsScreen';
import AgreementPreviewScreen from './src/screens/AgreementPreviewScreen';
import AgreementOtpScreen from './src/screens/AgreementOtpScreen';
import AmountDisbursedScreen from './src/screens/AmountDisbursedScreen';
import BankDetailsScreen, {
  BankDetailsFormData,
} from './src/screens/BankDetailsScreen';
import {DocVerificationType} from './src/data/docVerificationConfig';
import {NotificationItem} from './src/data/notifications';
import {TabKey} from './src/components/BottomTabBar';
import {
  LoanApplicationFormState,
  PersonalInfoFormData,
  ProfessionalInfoFormData,
} from './src/data/loanForm';
import {ReviewRow} from './src/data/loanAgreement';
import {toAbsoluteUrl} from './src/services/config';
import {
  authApi,
  loanApi,
  documentApi,
  profileApi,
  User,
  BankDetailsRecord,
  LoanReviewData,
  setAuthToken,
} from './src/services/api';
import {formatINR} from './src/utils/loanFlow';

type AppRoute =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'home'
  | 'notifications'
  | 'notificationDetail'
  | 'application'
  | 'completeProcess'
  | 'settings'
  | 'profile'
  | 'documentVerified'
  | 'privacyPolicy'
  | 'termsConditions'
  | 'personalInfoForm'
  | 'cibilReport'
  | 'professionalInfo'
  | 'finalLoanDetails'
  | 'selectLoanAmount'
  | 'docVerifyIntro'
  | 'docLiveCamera'
  | 'docVerifyReview'
  | 'uploadDocuments'
  | 'bankDetails'
  | 'insurancePayment'
  | 'reviewLoan'
  | 'agreementPreview'
  | 'agreementOtp'
  | 'amountDisbursed';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Backend stores gender as male | female | other; the form shows Male | Female | Others
const genderToLabel = (g?: string | null): string => {
  if (!g) return '';
  const v = g.toLowerCase();
  if (v === 'male') return 'Male';
  if (v === 'female') return 'Female';
  return 'Others';
};
const genderToBackend = (g: string): string => {
  const v = g.toLowerCase();
  return v === 'male' || v === 'female' ? v : 'other';
};

// Saved bank record from the server -> the shape BankDetailsScreen edits.
const bankRecordToForm = (b: BankDetailsRecord): BankDetailsFormData => ({
  bankName: b.bank_name,
  accountHolderName: b.account_holder_name,
  accountNumber: b.account_number,
  ifscCode: b.ifsc_code,
  statement: b.statement_file_url
    ? {
        name: 'Bank statement',
        sizeBytes: 0,
        uri: toAbsoluteUrl(b.statement_file_url) || b.statement_file_url,
      }
    : null,
});

// Helper: map backend review to UI topRows and bottomRows
const mapBackendReview = (review: LoanReviewData) => {
  return {
    topRows: [
      {label: 'Lending Partner', value: review.lendingPartner, bold: true},
      {
        label: 'Loan Amount',
        value: `₹${formatINR(review.loanAmount)}`,
        caption: `Processing Fee ₹${review.processingFee} & Pre EMI ₹${review.preEmi}`,
      },
      {
        label: 'Amount Transferable',
        value: `₹${formatINR(review.amountTransferable)}`,
        bold: true,
      },
    ],
    bottomRows: [
      {label: 'Loan Tenure', value: `${review.loanTenure} Months`},
      {label: 'Monthly EMI', value: `₹${formatINR(review.monthlyEmi)}`},
      {label: '1st EMI Date', value: review.firstEmiDate},
      {label: 'Interest Rate', value: `${review.interestRate}%`},
    ],
  };
};

function App() {
  const [route, setRoute] = useState<AppRoute>('splash');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLoanId, setCurrentLoanId] = useState<number | null>(null);

  // Notifications are loaded by NotificationsScreen itself from the server.
  // Only the one the user opened is kept here so the detail screen can show it.
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | undefined>(undefined);

  // Forms & Details
  const [loanForm, setLoanForm] = useState<LoanApplicationFormState>({});
  const [activeDocType, setActiveDocType] = useState<DocVerificationType>('selfie');
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [docVerifyOrigin, setDocVerifyOrigin] = useState<'settings' | 'checklist'>('settings');
  const [uploadedDocIds, setUploadedDocIds] = useState<string[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetailsFormData | undefined>();
  const [reviewData, setReviewData] = useState<{topRows: ReviewRow[]; bottomRows: ReviewRow[]} | undefined>();
  const [disbursedInfo, setDisbursedInfo] = useState<{amount: string; agreementUrl?: string | null}>({
    amount: '',
  });

  // Called by SplashScreen when its progress bar reaches 100%.
  // useCallback keeps the same function identity so the animation isn't restarted.
  const handleSplashFinish = useCallback(() => setRoute('onboarding'), []);

  // Load user profile (name comes from the backend, never hardcoded)
  const loadUserProfile = useCallback(async () => {
    try {
      const prof = await profileApi.getProfile();
      setCurrentUser(prof);

      // dob arrives as "YYYY-MM-DD"
      let dobDay = '';
      let dobMonth = '';
      let dobYear = '';
      if (prof.dob) {
        const [y, m, d] = String(prof.dob).slice(0, 10).split('-');
        dobYear = y || '';
        dobMonth = MONTH_NAMES[Number(m) - 1] || '';
        dobDay = d || '';
      }
      setProfileData({
        fullName: prof.full_name || '',
        email: prof.email || '',
        gender: genderToLabel(prof.gender),
        maritalStatus: prof.marital_status || '',
        dobDay,
        dobMonth,
        dobYear,
        avatarUri: toAbsoluteUrl(prof.avatar_url),
      });
    } catch (err: any) {
      console.warn('loadUserProfile error:', err.message);
    }
  }, []);

  // Single place that opens a checklist step. It first loads whatever data that
  // step's screen needs from the server, so resuming from the Application tab
  // (or after restarting the app) shows the user's real saved data.
  const openStepRoute = useCallback(async (loanId: number, target: string) => {
    try {
      if (target === 'bankDetails') {
        const bank = await loanApi.getBankDetails(loanId);
        setBankDetails(bank ? bankRecordToForm(bank) : undefined);
      } else if (target === 'uploadDocuments') {
        const docs = await documentApi.listDocuments();
        setUploadedDocIds(docs.map(d => d.doc_type));
      } else if (target === 'reviewLoan') {
        setReviewData(undefined);
        setReviewData(mapBackendReview(await loanApi.getReview(loanId)));
      }
    } catch (err: any) {
      console.warn(`openStepRoute(${target}) error:`, err.message);
    }
    setRoute(target as AppRoute);
  }, []);

  // Shared entry point for every loan category card and the "Get Instant Loan" hero button
  const startLoanApplication = async (loanTitle: string) => {
    try {
      const created = await loanApi.createLoan(loanTitle);
      setCurrentLoanId(created.id);
    } catch (err: any) {
      console.warn('startLoanApplication error:', err.message);
    }
    setLoanForm({loanTitle});
    setRoute('personalInfoForm');
  };

  // Settings -> tap the profile circle: choose Camera or Gallery, then upload
  const uploadAvatarFromAsset = useCallback(
    async (asset?: {uri?: string; type?: string}) => {
      if (!asset?.uri) return;
      try {
        const updated = await profileApi.uploadAvatar(asset.uri, asset.type);
        setCurrentUser(updated);
        await loadUserProfile();
        Alert.alert('Profile Photo', 'Profile photo updated!');
      } catch (err: any) {
        Alert.alert('Profile Photo', err.message || 'Could not upload photo');
      }
    },
    [loadUserProfile],
  );

  const pickerOptions = {
    mediaType: 'photo' as const,
    quality: 0.7 as const,
    maxWidth: 800,
    maxHeight: 800,
    selectionLimit: 1,
  };

  const handleChangeAvatar = () => {
    Alert.alert('Profile Photo', 'Choose a profile photo', [
      {
        text: 'Take Photo',
        onPress: async () => {
          if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('Permission needed', 'Camera permission is required to take a photo.');
              return;
            }
          }
          const res = await launchCamera({...pickerOptions, saveToPhotos: false});
          if (res.errorCode) {
            Alert.alert('Camera', res.errorMessage || 'Could not open camera');
            return;
          }
          if (!res.didCancel) uploadAvatarFromAsset(res.assets?.[0]);
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const res = await launchImageLibrary(pickerOptions);
          if (res.errorCode) {
            Alert.alert('Gallery', res.errorMessage || 'Could not open gallery');
            return;
          }
          if (!res.didCancel) uploadAvatarFromAsset(res.assets?.[0]);
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  // Shared handler for the bottom tab bar on Home / Application / Settings
  const handleTabPress = (tab: TabKey) => {
    if (tab === 'home') {
      setRoute('home');
    } else if (tab === 'application') {
      setRoute('application'); // ApplicationScreen loads its own loans
    } else if (tab === 'settings') {
      loadUserProfile();
      setRoute('settings');
    }
  };

  // Settings -> Document Verified: show which documents are really uploaded.
  const openDocumentVerified = async () => {
    try {
      const docs = await documentApi.listDocuments();
      setUploadedDocIds(docs.map(d => d.doc_type));
    } catch (err: any) {
      console.warn('listDocuments error:', err.message);
    }
    setRoute('documentVerified');
  };

  return (
    <SafeAreaProvider>
      {route === 'splash' && (
        <SplashScreen onFinish={handleSplashFinish} duration={2500} />
      )}

      {route === 'onboarding' && (
        <OnboardingScreen onDone={() => setRoute('login')} />
      )}

      {route === 'login' && (
        <LoginScreen
          onContinue={async number => {
            setMobileNumber(number);
            try {
              const res = await authApi.sendOtp(number);
              if (res.otp) {
                Alert.alert(
                  'MoneyMitra OTP',
                  `Your OTP is: ${res.otp}`,
                  [{text: 'OK'}],
                );
              }
              setRoute('otp');
            } catch (err: any) {
              Alert.alert('Login', err.message || 'Could not send OTP');
            }
          }}
          onOpenPrivacyPolicy={() => setRoute('privacyPolicy')}
          onOpenTerms={() => setRoute('termsConditions')}
        />
      )}

      {route === 'otp' && (
        <OtpVerificationScreen
          mobileNumber={mobileNumber}
          onChangeNumber={() => setRoute('login')}
          onResendOtp={async () => {
            try {
              const res = await authApi.sendOtp(mobileNumber);
              if (res.otp) {
                Alert.alert('MoneyMitra OTP', `New OTP is: ${res.otp}`);
              }
            } catch (err: any) {
              Alert.alert('Resend OTP', err.message || 'Could not resend OTP');
            }
          }}
          onVerify={async otp => {
            try {
              const res = await authApi.verifyOtp(mobileNumber, otp);
              setProfileData(undefined); // clear any previous user's data
              setCurrentUser(res.user);
              loadUserProfile();
              setRoute('home');
            } catch (err: any) {
              Alert.alert('Verification', err.message || 'Incorrect OTP');
            }
          }}
        />
      )}

      {route === 'home' && (
        <HomeScreen
          userName={currentUser?.full_name || undefined}
          avatarUri={profileData?.avatarUri || undefined}
          onPressProfile={() => {
            loadUserProfile();
            setRoute('settings');
          }}
          onPressNotifications={() => setRoute('notifications')}
          onTabPress={handleTabPress}
          onGetInstantLoan={() => startLoanApplication('Instant Loan')}
          onSelectCategory={title => startLoanApplication(title)}
        />
      )}

      {/* No `items` prop: the screen loads real notifications from the server,
          so it is empty until something actually happens (and marks them read). */}
      {route === 'notifications' && (
        <NotificationsScreen
          onBack={() => setRoute('home')}
          onSelectNotification={notification => {
            setSelectedNotification(notification);
            setRoute('notificationDetail');
          }}
        />
      )}

      {route === 'notificationDetail' && selectedNotification && (
        <NotificationDetailScreen
          notification={selectedNotification}
          onBack={() => setRoute('notifications')}
        />
      )}

      {/* Application tab: the button resumes at the first unfinished step. */}
      {route === 'application' && (
        <ApplicationScreen
          onBack={() => setRoute('home')}
          onTabPress={handleTabPress}
          onPressCta={(loan, target) => {
            if (!target) return;
            setCurrentLoanId(loan.id);
            if (target === 'personalInfoForm') {
              setLoanForm({loanTitle: loan.loan_title});
            }
            openStepRoute(loan.id, target);
          }}
        />
      )}

      {route === 'completeProcess' && currentLoanId != null && (
        <CompleteProcessScreen
          loanId={currentLoanId}
          onBack={() => setRoute('application')}
          onSelectStep={(_stepNumber, target, loan) => {
            if (target === 'personalInfoForm') {
              setLoanForm({loanTitle: loan.loan_title});
            }
            openStepRoute(loan.id, target);
          }}
        />
      )}

      {route === 'selectLoanAmount' && (
        <SelectLoanAmountScreen
          onBack={() => setRoute('completeProcess')}
          onConfirm={async (amount, tenureMonths) => {
            if (!currentLoanId) return;
            try {
              await loanApi.setLoanAmount(currentLoanId, amount, tenureMonths);
              setRoute('completeProcess');
            } catch (err: any) {
              Alert.alert('Loan Amount', err.message || 'Could not save the loan amount');
            }
          }}
        />
      )}

      {route === 'bankDetails' && (
        <BankDetailsScreen
          initialData={bankDetails}
          onBack={() => setRoute('completeProcess')}
          onContinue={async data => {
            if (!currentLoanId) return;
            try {
              // A statement that is already on the server has an http(s) uri;
              // only upload it again if the user picked a new local file.
              const isNewFile =
                !!data.statement?.uri && !/^https?:/i.test(data.statement.uri);
              await loanApi.saveBankDetails(currentLoanId, {
                bankName: data.bankName,
                accountHolderName: data.accountHolderName,
                accountNumber: data.accountNumber,
                ifscCode: data.ifscCode,
                fileUri: isNewFile ? data.statement!.uri : undefined,
                fileName: isNewFile ? data.statement!.name : undefined,
                fileType: isNewFile ? data.statement!.type : undefined,
              });
              setBankDetails(data);
              setRoute('insurancePayment'); // next step
            } catch (err: any) {
              Alert.alert('Bank Details', err.message || 'Could not save bank details');
            }
          }}
          onOpenPrivacyPolicy={() => setRoute('privacyPolicy')}
          onOpenTerms={() => setRoute('termsConditions')}
        />
      )}

      {/* Everything on this screen is loaded from the user's loan. */}
      {route === 'insurancePayment' && currentLoanId != null && (
        <PaymentForInsuranceScreen
          loanId={currentLoanId}
          onBack={() => setRoute('completeProcess')}
          onEditBank={bank => {
            setBankDetails(bank ? bankRecordToForm(bank) : undefined);
            setRoute('bankDetails');
          }}
          onPaid={() => openStepRoute(currentLoanId, 'reviewLoan')}
        />
      )}

      {route === 'reviewLoan' && (
        <ReviewLoanDetailsScreen
          topRows={reviewData?.topRows}
          bottomRows={reviewData?.bottomRows}
          onBack={() => setRoute('completeProcess')}
          onContinue={() => setRoute('agreementPreview')}
        />
      )}

      {route === 'agreementPreview' && currentLoanId != null && (
        <AgreementPreviewScreen
          loanId={currentLoanId}
          onBack={() => setRoute('reviewLoan')}
          onGetOtp={async () => {
            if (!currentLoanId) return;
            try {
              const res = await loanApi.sendAgreementOtp(currentLoanId);
              if (res.otp) {
                Alert.alert(
                  'Agreement OTP',
                  `Your e-sign OTP is: ${res.otp}`,
                  [{text: 'OK'}],
                );
              }
              setRoute('agreementOtp');
            } catch (err: any) {
              Alert.alert('Agreement', err.message || 'Could not send OTP');
            }
          }}
        />
      )}

      {route === 'agreementOtp' && (
        <AgreementOtpScreen
          onBack={() => setRoute('agreementPreview')}
          onVerify={async otp => {
            if (!currentLoanId) return;
            try {
              await loanApi.verifyAgreementOtp(currentLoanId, otp);
              const disburseRes = await loanApi.disburse(currentLoanId);
              setDisbursedInfo({
                amount: disburseRes.amount
                  ? `₹${formatINR(disburseRes.amount)}`
                  : '',
                agreementUrl: disburseRes.agreementUrl,
              });
            } catch (err: any) {
              Alert.alert('E-Sign Failed', err.message || 'Incorrect OTP');
              return;
            }
            setRoute('amountDisbursed');
          }}
        />
      )}

      {/* loanId lets "Download Agreement" fetch a fresh PDF link from the server. */}
      {route === 'amountDisbursed' && (
        <AmountDisbursedScreen
          amount={disbursedInfo.amount}
          loanId={currentLoanId ?? undefined}
          agreementUrl={disbursedInfo.agreementUrl || undefined}
          onBackToHome={() => setRoute('home')}
        />
      )}

      {route === 'finalLoanDetails' && (
        <FinalLoanDetailsScreen onBack={() => setRoute('application')} />
      )}

      {route === 'settings' && (
        <SettingsScreen
          profile={profileData}
          onChangeAvatar={handleChangeAvatar}
          onOpenProfile={() => {
            loadUserProfile();
            setRoute('profile');
          }}
          onOpenDocumentVerified={openDocumentVerified}
          onOpenPrivacyPolicy={() => setRoute('privacyPolicy')}
          onOpenTermsConditions={() => setRoute('termsConditions')}
          onLogout={() => {
            setAuthToken(null);
            setCurrentUser(null);
            setProfileData(undefined);
            setCurrentLoanId(null);
            setBankDetails(undefined);
            setReviewData(undefined);
            setSelectedNotification(null);
            setUploadedDocIds([]);
            setRoute('login');
          }}
          onTabPress={handleTabPress}
        />
      )}

      {route === 'profile' && (
        <ProfileScreen
          initialProfile={profileData}
          onSave={async data => {
            try {
              const monthNum = MONTH_NAMES.indexOf(data.dobMonth) + 1;
              const dob =
                data.dobYear && monthNum > 0 && data.dobDay
                  ? `${data.dobYear}-${String(monthNum).padStart(2, '0')}-${data.dobDay.padStart(2, '0')}`
                  : undefined;

              const updated = await profileApi.updateProfile({
                fullName: data.fullName,
                email: data.email || undefined,
                dob,
                gender: data.gender ? genderToBackend(data.gender) : undefined,
                maritalStatus: data.maritalStatus || undefined,
              });
              setCurrentUser(updated);
              await loadUserProfile(); // refresh Settings header + Profile fields
              Alert.alert('Profile', 'Profile updated successfully!');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update profile');
            }
          }}
          onBack={() => setRoute('settings')}
        />
      )}

      {route === 'documentVerified' && (
        <DocumentVerifiedScreen
          uploadedIds={uploadedDocIds}
          onBack={() => setRoute('settings')}
          onSelectItem={item => {
            setActiveDocType(item.id as DocVerificationType);
            setDocVerifyOrigin('settings');
            setRoute('docVerifyIntro');
          }}
        />
      )}

      {route === 'uploadDocuments' && (
        <UploadDocumentForVerificationScreen
          uploadedIds={uploadedDocIds}
          onBack={() => setRoute('completeProcess')}
          onUploadItem={item => {
            setActiveDocType(item.id as DocVerificationType);
            setDocVerifyOrigin('checklist');
            setRoute('docVerifyIntro');
          }}
          onContinue={() => setRoute('completeProcess')}
        />
      )}

      {route === 'docVerifyIntro' && (
        <DocVerificationIntroScreen
          docType={activeDocType}
          onBack={() =>
            setRoute(
              docVerifyOrigin === 'checklist'
                ? 'uploadDocuments'
                : 'documentVerified',
            )
          }
          onStartVerification={() => setRoute('docLiveCamera')}
        />
      )}

      {route === 'docLiveCamera' && (
        <DocLiveCameraScreen
          docType={activeDocType}
          onCancel={() => setRoute('docVerifyIntro')}
          onCaptured={uri => {
            setCapturedPhotoUri(uri);
            setRoute('docVerifyReview');
          }}
        />
      )}

      {route === 'docVerifyReview' && capturedPhotoUri && (
        <DocVerificationReviewScreen
          photoUri={capturedPhotoUri}
          onRetake={() => setRoute('docLiveCamera')}
          onConfirm={async () => {
            const photo = capturedPhotoUri;
            setCapturedPhotoUri(null);

            try {
              await documentApi.uploadDocument(
                activeDocType,
                photo,
                docVerifyOrigin === 'checklist' && currentLoanId
                  ? currentLoanId
                  : undefined,
              );
              setUploadedDocIds(prev =>
                prev.includes(activeDocType) ? prev : [...prev, activeDocType],
              );
            } catch (err: any) {
              Alert.alert('Upload failed', err.message || 'Could not upload the document');
            }

            setRoute(
              docVerifyOrigin === 'checklist'
                ? 'uploadDocuments'
                : 'documentVerified',
            );
          }}
        />
      )}

      {route === 'privacyPolicy' && (
        <PrivacyPolicyScreen onBack={() => setRoute('settings')} />
      )}

      {route === 'termsConditions' && (
        <TermsConditionsScreen onBack={() => setRoute('settings')} />
      )}

      {route === 'personalInfoForm' && (
        <PersonalInformationFormScreen
          initialData={
            loanForm.personal ?? {
              nameAsPerPan: profileData?.fullName || '',
              dobDay: profileData?.dobDay || '',
              dobMonth: profileData?.dobMonth || '',
              dobYear: profileData?.dobYear || '',
              gender: profileData?.gender || '',
              email: profileData?.email || '',
              maritalStatus: profileData?.maritalStatus || '',
              loanAmount: '',
              employmentType: '',
              panNumber: '',
            }
          }
          onBack={() => setRoute('home')}
          onNext={async (data: PersonalInfoFormData) => {
            setLoanForm(prev => ({...prev, personal: data}));
            if (currentLoanId) {
              try {
                const monthNum = String(MONTH_NAMES.indexOf(data.dobMonth) + 1).padStart(2, '0');
                const dob = `${data.dobYear}-${monthNum}-${data.dobDay.padStart(2, '0')}`;
                await loanApi.savePersonalInfo(currentLoanId, {
                  fullName: data.nameAsPerPan,
                  dob,
                  gender: genderToBackend(data.gender),
                  email: data.email,
                  maritalStatus: data.maritalStatus,
                });
                loadUserProfile(); // name now saved on the user account
              } catch (err: any) {
                console.warn('savePersonalInfo error:', err.message);
              }
            }
            setRoute('cibilReport');
          }}
        />
      )}

      {route === 'cibilReport' && (
        <CibilReportScreen
          initialOtp={loanForm.otp}
          onBack={() => setRoute('personalInfoForm')}
          onNext={otp => {
            setLoanForm(prev => ({...prev, otp}));
            setRoute('professionalInfo');
          }}
        />
      )}

      {route === 'professionalInfo' && (
        <ProfessionalInformationScreen
          initialData={loanForm.professional}
          onBack={() => setRoute('cibilReport')}
          onSubmit={async (data: ProfessionalInfoFormData) => {
            setLoanForm(prev => ({...prev, professional: data}));
            if (currentLoanId) {
              try {
                const empType =
                  loanForm.personal?.employmentType?.toLowerCase().includes('salar')
                    ? 'salaried'
                    : 'self_employed';
                const incomeNum =
                  Number(data.monthlyIncome.replace(/[^0-9]/g, '')) || 50000;

                await loanApi.saveProfessionalInfo(currentLoanId, {
                  employmentType: empType,
                  companyName: data.companyName,
                  monthlyIncome: incomeNum,
                  sourceOfIncome: data.designation || 'Salary',
                });
              } catch (err: any) {
                console.warn('saveProfessionalInfo error:', err.message);
              }
            }
            setRoute('completeProcess');
          }}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;