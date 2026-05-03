import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';

export default function PaymentSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get payment details from params or use defaults
  const amountPaid = params.amount ? parseFloat(params.amount as string) : 525.00;
  const circleName = params.circleName as string || 'Gold Savings Circle';
  const hasLateFee = params.hasLateFee === 'true';
  const lateFeeAmount = params.lateFee ? parseFloat(params.lateFee as string) : 25.00;

  // Animation values
  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0);

  useEffect(() => {
    // Animate the success icon
    checkScale.value = withDelay(200, withSpring(1, { damping: 12 }));
    ringScale.value = withDelay(100, withSpring(1, { damping: 15 }));
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const handleBackToDashboard = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Animated.View style={[styles.successRing, ringAnimatedStyle]}>
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={styles.successRingGradient}
            />
          </Animated.View>
          <Animated.View style={[styles.successIcon, checkAnimatedStyle]}>
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </Animated.View>
        </View>

        {/* Success Title */}
        <Animated.View entering={FadeInUp.delay(400).duration(500)}>
          <Text style={styles.title}>Payment Successful</Text>
        </Animated.View>

        {/* Confirmation Text */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)}>
          <Text style={styles.subtitle}>
            Your contribution has been recorded
          </Text>
        </Animated.View>

        {/* Payment Details Card */}
        <Animated.View 
          style={styles.detailsCard}
          entering={FadeInUp.delay(600).duration(500)}
        >
          {/* Amount Paid */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.amountValue}>{amountPaid.toFixed(2)}</Text>
            </View>
            {hasLateFee && (
              <View style={styles.lateFeeNote}>
                <Ionicons name="information-circle" size={14} color="#64748B" />
                <Text style={styles.lateFeeNoteText}>
                  Includes ${lateFeeAmount.toFixed(2)} late fee
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Circle Info */}
          <View style={styles.circleSection}>
            <View style={styles.circleIconContainer}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.circleIcon}
              >
                <Ionicons name="people" size={18} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.circleInfo}>
              <Text style={styles.circleLabel}>Circle</Text>
              <Text style={styles.circleName}>{circleName}</Text>
            </View>
          </View>

          {/* Transaction ID */}
          <View style={styles.transactionSection}>
            <Text style={styles.transactionLabel}>Transaction ID</Text>
            <Text style={styles.transactionId}>TXN{Date.now().toString().slice(-8)}</Text>
          </View>
        </Animated.View>

        {/* Trust Indicators */}
        <Animated.View 
          style={styles.trustSection}
          entering={FadeIn.delay(800).duration(500)}
        >
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
            <Text style={styles.trustText}>Secured & Verified</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Action */}
      <Animated.View 
        style={styles.bottomAction}
        entering={FadeInUp.delay(900).duration(500)}
      >
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.dashboardBtnContainer}
          onPress={handleBackToDashboard}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dashboardBtn}
          >
            <Ionicons name="home" size={20} color="#FFF" />
            <Text style={styles.dashboardBtnText}>Back to Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.viewReceiptBtn} onPress={() => {}}>
          <Ionicons name="receipt-outline" size={18} color="#94A3B8" />
          <Text style={styles.viewReceiptTextDisabled}>View Receipt</Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.2,
  },
  successRingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  amountValue: {
    fontSize: 44,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  lateFeeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  lateFeeNoteText: {
    fontSize: 13,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  circleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  circleIconContainer: {
    marginRight: 12,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInfo: {
    flex: 1,
  },
  circleLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  circleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  transactionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  transactionLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  trustSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '500',
  },
  bottomAction: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    alignItems: 'center',
  },
  dashboardBtnContainer: {
    width: '100%',
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  dashboardBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  viewReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  viewReceiptText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '600',
  },
  viewReceiptTextDisabled: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '600',
  },
  comingSoonBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
});
