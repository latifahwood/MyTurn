import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const frequencyOptions = [
  { id: 'weekly', label: 'Weekly', icon: 'calendar-outline' },
  { id: 'biweekly', label: 'Bi-weekly', icon: 'calendar-outline' },
  { id: 'monthly', label: 'Monthly', icon: 'calendar-outline' },
];

const payoutOrderOptions = [
  { 
    id: 'auto', 
    label: 'Auto-assign', 
    description: 'System randomly assigns payout order',
    icon: 'shuffle'
  },
  { 
    id: 'manual', 
    label: 'Manual order', 
    description: 'You decide who gets paid when',
    icon: 'list'
  },
];

export default function CreateCircle() {
  const router = useRouter();
  const [circleName, setCircleName] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  const [selectedPayoutOrder, setSelectedPayoutOrder] = useState('auto');
  const [memberInput, setMemberInput] = useState('');
  const [addedMembers, setAddedMembers] = useState<string[]>([]);
  const [lateFeeEnabled, setLateFeeEnabled] = useState(false);
  const [gracePeriod, setGracePeriod] = useState('3');
  const [lateFeeAmount, setLateFeeAmount] = useState('25');

  const handleAddMember = () => {
    if (memberInput.trim() && !addedMembers.includes(memberInput.trim())) {
      setAddedMembers([...addedMembers, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleRemoveMember = (member: string) => {
    setAddedMembers(addedMembers.filter(m => m !== member));
  };

  const getAvatarColor = (text: string) => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];
    const index = text.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (text: string) => {
    if (text.includes('@')) {
      return text.substring(0, 2).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Circle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Circle Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Circle Details</Text>
            
            {/* Circle Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Circle Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="people-circle-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Family Savings Circle"
                  placeholderTextColor="#94A3B8"
                  value={circleName}
                  onChangeText={setCircleName}
                />
              </View>
            </View>

            {/* Contribution Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contribution Amount</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput
                  style={[styles.textInput, styles.amountInput]}
                  placeholder="500"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={contributionAmount}
                  onChangeText={setContributionAmount}
                />
                <View style={styles.perPeriodBadge}>
                  <Text style={styles.perPeriodText}>per period</Text>
                </View>
              </View>
            </View>

            {/* Number of Members */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Members</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="people-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="8"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={memberCount}
                  onChangeText={setMemberCount}
                />
                <Text style={styles.inputSuffix}>members</Text>
              </View>
            </View>

            {/* Frequency */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contribution Frequency</Text>
              <View style={styles.frequencyOptions}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.frequencyOption,
                      selectedFrequency === option.id && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setSelectedFrequency(option.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={16} 
                      color={selectedFrequency === option.id ? '#3B82F6' : '#64748B'} 
                    />
                    <Text style={[
                      styles.frequencyLabel,
                      selectedFrequency === option.id && styles.frequencyLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Add Members Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Members</Text>
            <Text style={styles.sectionSubtitle}>Invite members by email or phone number</Text>
            
            <View style={styles.addMemberContainer}>
              <View style={styles.addMemberInputContainer}>
                <Ionicons name="person-add-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.addMemberInput}
                  placeholder="Email or phone number"
                  placeholderTextColor="#94A3B8"
                  value={memberInput}
                  onChangeText={setMemberInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity 
                style={[
                  styles.addMemberBtn,
                  !memberInput.trim() && styles.addMemberBtnDisabled
                ]}
                onPress={handleAddMember}
                disabled={!memberInput.trim()}
              >
                <Ionicons name="add" size={22} color={memberInput.trim() ? '#FFF' : '#94A3B8'} />
              </TouchableOpacity>
            </View>

            {/* Added Members List */}
            {addedMembers.length > 0 && (
              <View style={styles.addedMembersList}>
                {addedMembers.map((member, index) => (
                  <View key={index} style={styles.addedMemberItem}>
                    <View style={[styles.memberAvatar, { backgroundColor: getAvatarColor(member) }]}>
                      <Text style={styles.memberAvatarText}>{getInitials(member)}</Text>
                    </View>
                    <Text style={styles.addedMemberText} numberOfLines={1}>{member}</Text>
                    <TouchableOpacity 
                      style={styles.removeMemberBtn}
                      onPress={() => handleRemoveMember(member)}
                    >
                      <Ionicons name="close-circle" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {addedMembers.length === 0 && (
              <View style={styles.emptyMembersState}>
                <Ionicons name="people-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyMembersText}>No members added yet</Text>
              </View>
            )}
          </View>

          {/* Payout Order Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payout Order</Text>
            <Text style={styles.sectionSubtitle}>Choose how payout order is determined</Text>
            
            <View style={styles.payoutOptions}>
              {payoutOrderOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.payoutOption,
                    selectedPayoutOrder === option.id && styles.payoutOptionSelected
                  ]}
                  onPress={() => setSelectedPayoutOrder(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.payoutOptionIcon,
                    selectedPayoutOrder === option.id && styles.payoutOptionIconSelected
                  ]}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={selectedPayoutOrder === option.id ? '#3B82F6' : '#64748B'} 
                    />
                  </View>
                  <View style={styles.payoutOptionContent}>
                    <Text style={[
                      styles.payoutOptionLabel,
                      selectedPayoutOrder === option.id && styles.payoutOptionLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.payoutOptionDescription}>{option.description}</Text>
                  </View>
                  <View style={[
                    styles.radioOuter,
                    selectedPayoutOrder === option.id && styles.radioOuterSelected
                  ]}>
                    {selectedPayoutOrder === option.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Late Fee Rules Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Late Fee Rules</Text>
                <Text style={styles.sectionSubtitle}>Set penalties for late payments</Text>
              </View>
              <TouchableOpacity 
                style={[styles.toggle, lateFeeEnabled && styles.toggleEnabled]}
                onPress={() => setLateFeeEnabled(!lateFeeEnabled)}
                activeOpacity={0.8}
              >
                <View style={[styles.toggleThumb, lateFeeEnabled && styles.toggleThumbEnabled]} />
              </TouchableOpacity>
            </View>

            {lateFeeEnabled && (
              <View style={styles.lateFeeContent}>
                {/* Grace Period */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Grace Period</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="time-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="3"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={gracePeriod}
                      onChangeText={setGracePeriod}
                    />
                    <View style={styles.inputSuffixBadge}>
                      <Text style={styles.inputSuffixBadgeText}>days</Text>
                    </View>
                  </View>
                </View>

                {/* Late Fee Amount */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Late Fee Amount</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencyPrefix}>$</Text>
                    <TextInput
                      style={[styles.textInput, styles.amountInput]}
                      placeholder="25"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={lateFeeAmount}
                      onChangeText={setLateFeeAmount}
                    />
                    <View style={styles.perPeriodBadge}>
                      <Text style={styles.perPeriodText}>per late payment</Text>
                    </View>
                  </View>
                </View>

                {/* Helper Text */}
                <View style={styles.helperTextContainer}>
                  <Ionicons name="information-circle" size={18} color="#64748B" />
                  <Text style={styles.helperText}>
                    If a member is unpaid after the {gracePeriod || '0'}-day grace period, a ${lateFeeAmount || '0'} late fee will be added automatically to their contribution.
                  </Text>
                </View>
              </View>
            )}

            {!lateFeeEnabled && (
              <View style={styles.disabledState}>
                <Ionicons name="timer-outline" size={28} color="#CBD5E1" />
                <Text style={styles.disabledStateText}>Enable to set grace period and late fees</Text>
              </View>
            )}
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustSection}>
            <View style={styles.trustIndicator}>
              <View style={[styles.trustIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustTitle}>Secure Payments</Text>
                <Text style={styles.trustDescription}>Bank-level encryption</Text>
              </View>
            </View>
            
            <View style={styles.trustIndicator}>
              <View style={[styles.trustIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="checkmark-circle" size={18} color="#3B82F6" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustTitle}>Verified Members</Text>
                <Text style={styles.trustDescription}>Identity verification</Text>
              </View>
            </View>
            
            <View style={styles.trustIndicator}>
              <View style={[styles.trustIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="eye" size={18} color="#8B5CF6" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustTitle}>Transparent Tracking</Text>
                <Text style={styles.trustDescription}>Real-time updates</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity activeOpacity={0.8} style={styles.createBtnContainer}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createBtn}
          >
            <Ionicons name="add-circle" size={22} color="#FFF" />
            <Text style={styles.createBtnText}>Create Circle</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Summary Preview */}
        {(circleName || contributionAmount || memberCount) && (
          <View style={styles.summaryPreview}>
            <Text style={styles.summaryText}>
              {circleName || 'Your Circle'} • ${contributionAmount || '0'}/{selectedFrequency === 'weekly' ? 'wk' : selectedFrequency === 'biweekly' ? '2wk' : 'mo'} • {memberCount || '0'} members
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  perPeriodBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  perPeriodText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  inputSuffix: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  frequencyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  frequencyOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  frequencyLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  frequencyLabelSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  addMemberContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  addMemberInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  addMemberInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  addMemberBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemberBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  addedMembersList: {
    marginTop: 14,
    gap: 8,
  },
  addedMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  memberAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  addedMemberText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  removeMemberBtn: {
    padding: 4,
  },
  emptyMembersState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyMembersText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  payoutOptions: {
    gap: 12,
  },
  payoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  payoutOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  payoutOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  payoutOptionIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  payoutOptionContent: {
    flex: 1,
  },
  payoutOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  payoutOptionLabelSelected: {
    color: '#3B82F6',
  },
  payoutOptionDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3B82F6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  trustSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trustIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trustContent: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 1,
  },
  trustDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  bottomSpacer: {
    height: 140,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  createBtnContainer: {
    width: '100%',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  createBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  summaryPreview: {
    marginTop: 10,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  toggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    padding: 3,
    justifyContent: 'center',
  },
  toggleEnabled: {
    backgroundColor: '#3B82F6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbEnabled: {
    alignSelf: 'flex-end',
  },
  lateFeeContent: {
    marginTop: 4,
  },
  inputSuffixBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inputSuffixBadgeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  helperTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  helperText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  disabledState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  disabledStateText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
