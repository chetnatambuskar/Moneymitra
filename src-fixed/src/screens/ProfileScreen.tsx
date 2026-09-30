import React, {useState} from 'react';
import {
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
import {CURRENT_USER} from '../data/profile';
import RadioSelectModal from '../components/RadioSelectModal';
import {
  DOB_DAY_OPTIONS,
  DOB_MONTH_OPTIONS,
  DOB_YEAR_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../data/loanForm';

type ActiveModal = 'dobDay' | 'dobMonth' | 'dobYear' | 'gender' | 'marital' | null;

interface ProfileScreenProps {
  onBack?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({onBack}) => {
  const [fullName, setFullName] = useState(CURRENT_USER.fullName.split(' ')[0]);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [dobDay, setDobDay] = useState(CURRENT_USER.dobDay);
  const [dobMonth, setDobMonth] = useState(CURRENT_USER.dobMonth);
  const [dobYear, setDobYear] = useState(CURRENT_USER.dobYear);
  const [gender, setGender] = useState(CURRENT_USER.gender);
  const [maritalStatus, setMaritalStatus] = useState(CURRENT_USER.maritalStatus);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

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
          {CURRENT_USER.avatarUri ? (
            <Image
              source={{uri: CURRENT_USER.avatarUri}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.userName}>{CURRENT_USER.fullName}</Text>
        </View>

        <Text style={styles.sectionHeading}>Personal Information</Text>

        <Text style={styles.label}>Enter Your Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Enter Your DOB</Text>
        <View style={styles.dobRow}>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobDay')}>
            <Text style={styles.dobText}>{dobDay}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobMonth')}>
            <Text style={styles.dobText}>{dobMonth}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dobField}
            activeOpacity={0.7}
            onPress={() => setActiveModal('dobYear')}>
            <Text style={styles.dobText}>{dobYear}</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Select Your Gender</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('gender')}>
          <Text style={styles.dropdownText}>{gender}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.label}>Enter Your Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Select Your Marital Status</Text>
        <TouchableOpacity
          style={styles.dropdownRow}
          activeOpacity={0.7}
          onPress={() => setActiveModal('marital')}>
          <Text style={styles.dropdownText}>{maritalStatus}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </ScrollView>

      <RadioSelectModal
        visible={activeModal === 'dobDay'}
        title="Select Day"
        options={DOB_DAY_OPTIONS}
        selectedValue={dobDay}
        onSelect={setDobDay}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'dobMonth'}
        title="Select Month"
        options={DOB_MONTH_OPTIONS}
        selectedValue={dobMonth}
        onSelect={setDobMonth}
        onClose={() => setActiveModal(null)}
      />
      <RadioSelectModal
        visible={activeModal === 'dobYear'}
        title="Select Year"
        options={DOB_YEAR_OPTIONS}
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
});

export default ProfileScreen;
