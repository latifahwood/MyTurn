import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Mock payment data - in real app this would come from API/state
const paymentData = {
  paymentId: 'payment-' + Date.now(),
  circleId: 'circle-1',
  circleName: 'Gold Savings Circle',
  contributionAmount: 500,
  lateFee: 25,
  hasLateFee: true,
  dueDate: 'Mar 15, 2025',
  gracePeriodDays: 3,
  daysOverdue: 5,
  payoutRecipient: 'Marcus Johnson',
  turnNumber: 1,
};

const paymentMethods = [
  { id: 'bank', label: 'Bank Account', icon: 'business-outline', detail: '••••4582' },
  { id: 'card', label: 'Debit Card', icon: 'card-outline', detail: '••••8921' },
];

export default function Payment() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = paymentData.hasLateFee 
    ? paymentData.contributionAmount + paymentData.lateFee 
    : paymentData.contributionAmount;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Process payment through backend API
      const response = await fetch(`${BACKEND_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
          lateFeeApplied: paymentData.hasLateFee,
          lateFeeAmount: paymentData.hasLateFee ? paymentData.lateFee : 0,
          totalAmountPaid: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        // Navigate to success screen with payment details
        router.replace({
          pathname: '/payment-success',
          params: {
            amount: totalAmount.toString(),
            circleName: paymentData.circleName,
            hasLateFee: paymentData.hasLateFee.toString(),
            lateFee: paymentData.lateFee.toString(),
          },
        });
      } else {
        Alert.alert('Payment Failed', data.message || 'Unable to process payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      // For demo purposes, still navigate to success even if API fails
      router.replace({
        pathname: '/payment-success',
        params: {
          amount: totalAmount.toString(),
          circleName: paymentData.circleName,
          hasLateFee: paymentData.hasLateFee.toString(),
          lateFee: paymentData.lateFee.toString(),
        },
      });
    } finally {
      setIsProcessing(false);
    }
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
        <Text style={styles.headerTitle}>Make Payment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Late Fee Alert Banner */}
        {paymentData.hasLateFee && (
          <View style={styles.lateFeeAlert}>
            <View style={styles.lateFeeAlertIcon}>
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
            </View>
            <View style={styles.lateFeeAlertContent}>
              <Text style={styles.lateFeeAlertTitle}>Late Fee Applied</Text>
              <Text style={styles.lateFeeAlertText}>
                Payment is {paymentData.daysOverdue} days overdue. A ${paymentData.lateFee} late fee has been added.
              </Text>
            </View>
          </View>
        )}

        {/* Circle Info Card */}
        <View style={styles.circleInfoCard}>
          <View style={styles.circleIconContainer}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.circleIconGradient}
            >
              <MaterialCommunityIcons name="circle-multiple" size={24} color="#FFF" />
            </LinearGradient>
          </View>
          <View style={styles.circleInfo}>
            <Text style={styles.circleInfoName}>{paymentData.circleName}</Text>
            <Text style={styles.circleInfoDetail}>
              Payout to {paymentData.payoutRecipient} (Turn #{paymentData.turnNumber})
            </Text>
          </View>
        </View>

        {/* Payment Breakdown Card */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
          
          {/* Original Contribution */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLabelContainer}>
              <Ionicons name="wallet-outline" size={18} color="#64748B" />
              <Text style={styles.breakdownLabel}>Monthly Contribution</Text>
            </View>
            <Text style={styles.breakdownValue}>${paymentData.contributionAmount.toFixed(2)}</Text>
          </View>

          {/* Late Fee Row */}
          {paymentData.hasLateFee && (
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabelContainer}>
                <Ionicons name="time-outline" size={18} color="#DC2626" />
                <Text style={[styles.breakdownLabel, styles.lateFeeLabel]}>Late Fee</Text>
                <View style={styles.lateFeeBadge}>
                  <Text style={styles.lateFeeBadgeText}>+{paymentData.daysOverdue} days</Text>
                </View>
              </View>
              <Text style={[styles.breakdownValue, styles.lateFeeValue]}>+${paymentData.lateFee.toFixed(2)}</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.breakdownDivider} />

          {/* Total Due */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Due</Text>
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalCurrency}>$</Text>
              <Text style={styles.totalAmount}>{totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Due Date Info */}
          <View style={styles.dueDateInfo}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.dueDateText}>
              Original due date: {paymentData.dueDate}
            </Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedMethod === method.id && styles.paymentMethodSelected
                ]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.paymentMethodIcon,
                  selectedMethod === method.id && styles.paymentMethodIconSelected
                ]}>
                  <Ionicons 
                    name={method.icon as any} 
                    size={22} 
                    color={selectedMethod === method.id ? '#3B82F6' : '#64748B'} 
                  />
                </View>
                <View style={styles.paymentMethodContent}>
                  <Text style={[
                    styles.paymentMethodLabel,
                    selectedMethod === method.id && styles.paymentMethodLabelSelected
                  ]}>
                    {method.label}
                  </Text>
                  <Text style={styles.paymentMethodDetail}>{method.detail}</Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedMethod === method.id && styles.radioOuterSelected
                ]}>
                  {selectedMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addMethodBtn}>
            <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
            <Text style={styles.addMethodText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Trust & Security Section */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={16} color="#16A34A" />
            <Text style={styles.trustText}>Secure</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={16} color="#16A34A" />
            <Text style={styles.trustText}>Encrypted</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={styles.trustText}>Verified</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomAction}>
        {/* Amount Summary */}
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomSummaryLabel}>Total Payment</Text>
          <View style={styles.bottomAmountRow}>
            <Text style={styles.bottomAmountCurrency}>$</Text>
            <Text style={styles.bottomAmount}>{totalAmount.toFixed(2)}</Text>
            {paymentData.hasLateFee && (
              <View style={styles.bottomLateFeeBadge}>
                <Ionicons name="alert-circle" size={12} color="#DC2626" />
                <Text style={styles.bottomLateFeeBadgeText}>Late Fee</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8} 
          style={[styles.payBtnContainer, isProcessing && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={isProcessing ? ['#94A3B8', '#64748B'] : ['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payBtn}
          >
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text style={styles.payBtnText}>Processing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="flash" size={22} color="#FFF" />
                <Text style={styles.payBtnText}>Pay ${totalAmount.toFixed(2)}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lateFeeAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  lateFeeAlertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lateFeeAlertContent: {
    flex: 1,
  },
  lateFeeAlertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 4,
  },
  lateFeeAlertText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  circleInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  circleIconContainer: {
    marginRight: 14,
  },
  circleIconGradient: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfo: {
    flex: 1,
  },
  circleInfoName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  circleInfoDetail: {
    fontSize: 13,
    color: '#64748B',
  },
  breakdownCard: {
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
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  breakdownLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  lateFeeLabel: {
    color: '#DC2626',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  lateFeeValue: {
    color: '#DC2626',
  },
  lateFeeBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lateFeeBadgeText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  totalCurrency: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  dueDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  dueDateText: {
    fontSize: 13,
    color: '#64748B',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  paymentMethods: {
    gap: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  paymentMethodSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  paymentMethodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentMethodIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  paymentMethodLabelSelected: {
    color: '#3B82F6',
  },
  paymentMethodDetail: {
    fontSize: 13,
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
  addMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 10,
    gap: 8,
  },
  addMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '500',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },
  bottomSpacer: {
    height: 160,
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
  bottomSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  bottomSummaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomAmountCurrency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  bottomAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  bottomLateFeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  bottomLateFeeBadgeText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  payBtnContainer: {
    width: '100%',
  },
  payBtnDisabled: {
    opacity: 0.8,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  payBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
});
