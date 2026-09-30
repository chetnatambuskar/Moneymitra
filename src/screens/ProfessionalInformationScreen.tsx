import React, {useState} from 'react';
import {
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
import {ProfessionalInfoFormData} from '../data/loanForm';

interface ProfessionalInformationScreenProps {
  initialData?: ProfessionalInfoFormData;
  onBack?: () => void;
  onSubmit?: (data: ProfessionalInfoFormData) => void;
}

const ProfessionalInformationScreen: React.FC<
  ProfessionalInformationScreenProps
> = ({initialData, onBack, onSubmit}) => {
  const [companyName, setCompanyName] = useState(initialData?.companyName ?? '');
  const [designation, setDesignation] = useState(initialData?.designation ?? '');
  const [monthlyIncome, setMonthlyIncome] = useState(
    initialData?.monthlyIncome ?? '',
  );
  const [workExperience, setWorkExperience] = useState(
    initialData?.workExperience ?? '',
  );

  const handleSubmit = () => {
    onSubmit?.({companyName, designation, monthlyIncome, workExperience});
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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionHeading}>Professional Information</Text>

        <Text style={styles.label}>Company / Business Name</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Designation</Text>
        <TextInput
          style={styles.input}
          value={designation}
          onChangeText={setDesignation}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Monthly Income</Text>
        <View style={styles.amountRow}>
          <Text style={styles.rupee}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
            keyboardType="number-pad"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <Text style={styles.label}>Work Experience</Text>
        <TextInput
          style={styles.input}
          value={workExperience}
          onChangeText={setWorkExperience}
          placeholder="e.g. 10 Years"
          placeholderTextColor={colors.textSecondary}
        />
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={onBack}>
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          activeOpacity={0.85}
          onPress={handleSubmit}>
          <Text style={styles.footerButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginBottom: 24,
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 20,
  },
  rupee: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfessionalInformationScreen;