import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import RadioSelectModal from '../components/RadioSelectModal';
import {GENDER_OPTIONS, MARITAL_STATUS_OPTIONS} from '../data/loanForm';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
// Users must be 18+, so years run from (this year - 18) back 62 years.
const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({length: 63}, (_, i) => String(THIS_YEAR - 18 - i));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ActiveModal = 'day' | 'month' | 'year' | 'gender' | 'marital' | null;
export interface ProfileData {
  fullName?: string;
  email?: string;
  dobDay?: string;
  dobMonth?: string;
  dobYear?: string;
  gender?: string;
  maritalStatus?: string;
  avatarUri?: string | null;
}

interface ProfileScreenProps {
  initialProfile?: ProfileData;
  onSave?: (data: {
    fullName: string;
    email: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    gender: string;
    maritalStatus: string;
  }) => void;
  onBack?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  initialProfile,
  onSave,
  onBack,
}) => {
  const profile: ProfileData = initialProfile || {};
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [email, setEmail] = useState(profile.email || '');
  const [dobDay, setDobDay] = useState(profile.dobDay || '');
  const [dobMonth, setDobMonth] = useState(profile.dobMonth || '');
  const [dobYear, setDobYear] = useState(profile.dobYear || '');
  const [gender, setGender] = useState(profile.gender || '');
  const [maritalStatus, setMaritalStatus] = useState(profile.maritalStatus || '');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // The profile is fetched from the server after this screen opens, so
  // refill the fields whenever fresh data arrives.
  useEffect(() => {
    setFullName(initialProfile?.fullName || '');
    setEmail(initialProfile?.email || '');
    setDobDay(initialProfile?.dobDay || '');
    setDobMonth(initialProfile?.dobMonth || '');
    setDobYear(initialProfile?.dobYear || '');
    setGender(initialProfile?.gender || '');
    setMaritalStatus(initialProfile?.maritalStatus || '');
  }, [initialProfile]);

  const handleSave = () => {
    if (!fullName.trim()) {
      return Alert.alert('Profile', 'Please enter your full name.');
    }
    const anyDob = dobDay || dobMonth || dobYear;
    if (anyDob) {
      if (!dobDay || !dobMonth || !dobYear) {
        return Alert.alert('Profile', 'Please select day, month and year of your birth date.');
      }
      const d = Number(dobDay);
      const m = MONTHS.indexOf(dobMonth);
      const y = Number(dobYear);
      const dt = new Date(y, m, d);
      if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) {
        return Alert.alert('Profile', 'Please select a valid date of birth.');
      }
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      return Alert.alert('Profile', 'Please enter a valid email address.');
    }
    onSave?.({
      fullName: fullName.trim(),
      email: email.trim(),
      dobDay,
      dobMonth,
      dobYear,
      gender,
      maritalStatus,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Ionicons name="arrow-back" size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          {profile.avatarUri ? (
            <Image
              source={{uri: profile.avatarUri}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.userName}>{profile.fullName || ''}</Text>
        </View>

        <Text style={styles.sectionHeading}>Personal Information</Text>

        <Text style={styles.label}>Enter Your Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Enter Your DOB</Text>
        <View style={styles.dobRow}>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('day')}>
            <Text style={[styles.dobText, !dobDay && styles.placeholderText]}>
              {dobDay || 'DD'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('month')}>
            <Text style={[styles.dobText, !dobMonth && styles.placeholderText]}>
              {dobMonth || 'Month'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('year')}>
            <Text style={[styles.dobText, !dobYear && styles.placeholderText]}>
              {dobYear || 'YYYY'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Your Gender</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('gender')}>
          <Text style={[styles.dropdownText, !gender && styles.placeholderText]}>
            {gender || 'Select gender'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>Enter Your Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Select Your Marital Status</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('marital')}>
          <Text style={[styles.dropdownText, !maritalStatus && styles.placeholderText]}>
            {maritalStatus || 'Select marital status'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <RadioSelectModal
        visible={activeModal === 'day'}
        title="Select Day"
        options={DAYS}
        selectedValue={dobDay}
        onSelect={setDobDay}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'month'}
        title="Select Month"
        options={MONTHS}
        selectedValue={dobMonth}
        onSelect={setDobMonth}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'year'}
        title="Select Year"
        options={YEARS}
        selectedValue={dobYear}
        onSelect={setDobYear}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'gender'}
        title="Select Your Gender"
        options={GENDER_OPTIONS}
        selectedValue={gender}
        onSelect={setGender}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'marital'}
        title="Select Your Marital Status"
        options={MARITAL_STATUS_OPTIONS}
        selectedValue={maritalStatus}
        onSelect={setMaritalStatus}
        onClose={() => setActiveModal(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  placeholderText: {
    color: colors.textSecondary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryGreen,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dobField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dobText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 4,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;