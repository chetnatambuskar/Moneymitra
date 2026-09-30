import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import {AgreementFormData} from '../services/api';
import {toAbsoluteUrl} from '../services/config';
import {formatINR} from '../utils/loanFlow';

/**
 * The "Personal Loan Application Form" shown on Review & Sign Agreement.
 * Every value comes from the user's own loan data (AgreementFormData);
 * nothing is hardcoded.
 *
 * The page is laid out on a fixed 340 x 510 canvas and scaled to fit the
 * screen, so it looks the same on every phone.
 */
export const DOCUMENT_PAGE_COUNT = 2;

const DOC_W = 340;
const DOC_H = 510;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GREEN = colors.primaryGreen;
const dash = (v?: string | number | null) =>
  v === null || v === undefined || v === '' ? '—' : String(v);
const rupees = (v?: number | string | null) =>
  v === null || v === undefined ? '—' : `₹${formatINR(v)}`;

// ---------- small building blocks ----------

const Field: React.FC<{label: string; value?: string | number | null; flex?: number}> = ({
  label,
  value,
  flex = 1,
}) => (
  <View style={[s.field, {flex}]}>
    <Text style={s.label}>{label}</Text>
    <Text style={s.value}>{dash(value)}</Text>
  </View>
);

const SectionTitle: React.FC<{title: string}> = ({title}) => (
  <View style={s.sectionTitleWrap}>
    <Text style={s.sectionTitle}>{title}</Text>
    <View style={s.sectionLine} />
  </View>
);

const Header: React.FC<{title: string; data: AgreementFormData}> = ({title, data}) => (
  <View style={s.headerRow}>
    <View style={s.headerLeft}>
      <Text style={s.title}>{title}</Text>
      <View style={s.metaRow}>
        <Text style={s.metaLabel}>
          Application Number <Text style={s.metaValue}>{data.applicationNumber}</Text>
        </Text>
      </View>
      <Text style={s.metaLabel}>
        Application Date <Text style={s.metaValue}>{dash(data.applicationDate)}</Text>
      </Text>
    </View>
    {/* MoneyMitra's own logo */}
    <Image
      source={require('../assets/images/logo.png')}
      style={s.logo}
      resizeMode="contain"
    />
  </View>
);

const docStatus = (submitted: boolean) => (submitted ? 'SUBMITTED' : 'NOT SUBMITTED');

// ---------- page 1: application form ----------

const PageOne: React.FC<{data: AgreementFormData}> = ({data}) => {
  const a = data.applicant;
  const photo = toAbsoluteUrl(a.photoUrl);
  return (
    <View style={s.pageInner}>
      <Header title="PERSONAL LOAN APPLICATION FORM" data={data} />
      <Text style={s.intro}>
        I hereby request you to grant me a {data.loanTitle} based on the following
        information
      </Text>
      <View style={s.greenLine} />

      <SectionTitle title="Applicant Detail" />
      <View style={s.applicantBlock}>
        <View style={s.applicantFields}>
          <View style={s.row}>
            <Field label="Name" value={a.name} flex={1.3} />
            <Field label="Date of Birth (DD/MM/YEAR)" value={a.dob} />
          </View>
          <View style={s.row}>
            <Field label="Gender" value={a.gender} flex={1.3} />
            <Field label="Marital Status" value={a.maritalStatus} />
          </View>
        </View>
        <View style={s.photoBox}>
          {photo ? (
            <Image source={{uri: photo}} style={s.photo} resizeMode="cover" />
          ) : (
            <Ionicons name="person" size={30} color="#BDBDBD" />
          )}
        </View>
      </View>
      <View style={s.row}>
        <Field label="Email ID" value={a.email} flex={1.3} />
        <Field label="Phone No." value={a.phone ? `+91${a.phone.replace(/^\+?91/, '')}` : null} />
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <SectionTitle title="Proof of Identity" />
          <Text style={s.status}>PAN CARD · {docStatus(data.documents.identitySubmitted)}</Text>
        </View>
        <View style={s.half}>
          <SectionTitle title="Proof of Address" />
          <Text style={s.status}>AADHAAR · {docStatus(data.documents.addressSubmitted)}</Text>
        </View>
      </View>

      <View style={s.row}>
        <View style={s.half}>
          <SectionTitle title="Other Details" />
          <Field label="Source of Income" value={data.employment.type} />
          <Field label="Monthly Income" value={data.employment.monthlyIncome} />
          <Field label="Company Name" value={data.employment.companyName} />
          <Field label="Work Email ID" value={data.employment.workEmail} />
        </View>
        <View style={s.half}>
          <SectionTitle title="Loan amount & tenure" />
          <View style={s.row}>
            <Field label="Amount" value={data.loan ? `${formatINR(data.loan.loanAmount)}.00` : null} />
            <Field label="Tenure" value={data.loan ? `${data.loan.tenureMonths} Months` : null} />
          </View>
          <SectionTitle title="Bank Account Details" />
          <Field label="Bank Name" value={data.bank?.bankName} />
          <Field label="Account Number" value={data.bank?.accountNumber} />
          <Field label="IFSC Code" value={data.bank?.ifscCode} />
        </View>
      </View>

      <SignatureNote data={data} compact />
    </View>
  );
};

// ---------- page 2: terms summary + declaration ----------

const SummaryRow: React.FC<{label: string; value: string; bold?: boolean}> = ({
  label,
  value,
  bold,
}) => (
  <View style={s.summaryRow}>
    <Text style={[s.summaryLabel, bold && s.summaryBold]}>{label}</Text>
    <Text style={[s.summaryValue, bold && s.summaryBold]}>{value}</Text>
  </View>
);

const PageTwo: React.FC<{data: AgreementFormData}> = ({data}) => {
  const l = data.loan;
  return (
    <View style={s.pageInner}>
      <Header title="LOAN AGREEMENT SUMMARY" data={data} />
      <View style={s.greenLine} />

      <SectionTitle title="Loan Terms" />
      <SummaryRow label="Lending Partner" value="MoneyMitra" bold />
      <SummaryRow label="Loan Amount" value={l ? rupees(l.loanAmount) : '—'} />
      <SummaryRow label="Loan Tenure" value={l ? `${l.tenureMonths} Months` : '—'} />
      <SummaryRow label="Interest Rate" value={l ? `${l.interestRate}% p.a.` : '—'} />
      <SummaryRow label="Monthly EMI" value={l ? rupees(l.monthlyEmi) : '—'} />
      <SummaryRow label="1st EMI Date" value={dash(l?.firstEmiDate)} />
      <SummaryRow label="Total Repayable Amount" value={l ? rupees(l.totalRepayable) : '—'} />
      <SummaryRow label="Processing Fee" value={l ? rupees(l.processingFee) : '—'} />
      <SummaryRow label="Pre-EMI" value={l ? rupees(l.preEmi) : '—'} />
      <SummaryRow label="Insurance Charge" value={l ? rupees(l.insuranceCharge) : '—'} />
      <SummaryRow
        label="Amount Transferable"
        value={l ? rupees(l.finalTransferable) : '—'}
        bold
      />

      <SectionTitle title="Declaration" />
      <Text style={s.declaration}>
        I confirm that the details given in this application are true and complete.
        I authorise MoneyMitra to verify them, to obtain my credit information, and
        to collect the EMI from the bank account mentioned in this application as per
        the repayment schedule. I have read and understood the interest rate,
        charges and repayment terms shown above.
      </Text>

      <SignatureNote data={data} />
    </View>
  );
};

// ---------- signature ----------

const SignatureNote: React.FC<{data: AgreementFormData; compact?: boolean}> = ({
  data,
  compact,
}) => {
  const {signed, signedAt} = data.signature;
  return (
    <View style={[s.signature, compact && s.signatureCompact]}>
      {signed ? (
        <>
          <Text style={s.signBold}>Digitally signed by {dash(data.applicant.name)}</Text>
          <Text style={s.signText}>Method: e-Sign using OTP</Text>
          <Text style={s.signText}>Signed on: {dash(signedAt)}</Text>
        </>
      ) : (
        <Text style={s.signText}>
          Not signed yet. You will sign this application with an OTP on the next step.
        </Text>
      )}
      <Text style={s.footer}>MoneyMitra</Text>
    </View>
  );
};

// ---------- scaled page ----------

interface Props {
  data: AgreementFormData;
  /** 0-based page index */
  page: number;
}

const LoanApplicationFormDocument: React.FC<Props> = ({data, page}) => {
  const [width, setWidth] = useState(0);
  return (
    <View
      style={s.frame}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <View
          style={[
            s.canvas,
            // eslint-disable-next-line react-native/no-inline-styles
            {transform: [{scale: width / DOC_W}], transformOrigin: 'top left'},
          ]}>
          {page === 0 ? <PageOne data={data} /> : <PageTwo data={data} />}
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  frame: {
    width: '100%',
    aspectRatio: DOC_W / DOC_H,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  canvas: {width: DOC_W, height: DOC_H, backgroundColor: colors.white},
  pageInner: {flex: 1, padding: 16},

  headerRow: {flexDirection: 'row', alignItems: 'flex-start'},
  headerLeft: {flex: 1},
  title: {fontSize: 12, color: colors.textPrimary, letterSpacing: 0.3, marginBottom: 6},
  metaRow: {flexDirection: 'row'},
  metaLabel: {fontSize: 7.5, color: '#3B3B6B', marginBottom: 2},
  metaValue: {fontWeight: '700', color: colors.textPrimary},
  logo: {width: 52, height: 52},

  intro: {fontSize: 6.5, color: colors.textSecondary, marginTop: 4},
  greenLine: {height: 1.5, backgroundColor: '#8BD17C', marginTop: 4, marginBottom: 6},

  sectionTitleWrap: {marginTop: 4, marginBottom: 2},
  sectionTitle: {fontSize: 9, color: colors.textPrimary},
  sectionLine: {height: 1, backgroundColor: '#8BD17C', marginTop: 2, opacity: 0.8},

  row: {flexDirection: 'row'},
  half: {flex: 1, paddingRight: 8},
  field: {marginBottom: 3},
  label: {fontSize: 6.5, color: colors.textSecondary},
  value: {fontSize: 8, fontWeight: '700', color: colors.textPrimary, marginTop: 1},

  applicantBlock: {flexDirection: 'row'},
  applicantFields: {flex: 1},
  photoBox: {
    width: 50,
    height: 58,
    marginLeft: 8,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {width: '100%', height: '100%'},

  status: {fontSize: 7.5, fontWeight: '700', color: colors.textPrimary},

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DADADA',
  },
  summaryLabel: {fontSize: 8, color: colors.textSecondary},
  summaryValue: {fontSize: 8, color: colors.textPrimary},
  summaryBold: {fontWeight: '700', color: colors.textPrimary},

  declaration: {fontSize: 7.5, lineHeight: 11, color: colors.textPrimary},

  signature: {marginTop: 'auto', paddingTop: 6},
  signatureCompact: {marginTop: 'auto'},
  signBold: {fontSize: 6.5, fontWeight: '700', color: colors.textPrimary},
  signText: {fontSize: 6.5, color: colors.textSecondary, marginTop: 1},
  footer: {fontSize: 7, color: colors.textSecondary, textAlign: 'center', marginTop: 6},
});

export default LoanApplicationFormDocument;