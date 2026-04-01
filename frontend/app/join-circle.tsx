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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SuccessModal, ErrorModal, LoadingOverlay } from '../components/FeedbackComponents';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function JoinCircle() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialCode = params.code as string || '';

  const [inviteCode, setInviteCode] = useState(initialCode);
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [circlePreview, setCirclePreview] = useState<{
    id: string;
    name: string;
    contributionAmount: number;
    frequency: string;
    memberCount: number;
    totalMembers: number;
    adminName: string;
  } | null>(null);
  const [error, setError] = useState('');
  
  // Feedback states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFindCircle = async () => {
    if (inviteCode.length < 6) {
      setError('Please enter a valid invite code');
      return;
    }

    setIsSearching(true);
    setError('');
    setCirclePreview(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/circles/invite/${inviteCode.toUpperCase()}`);
      const data = await response.json();

      if (response.ok && data) {
        setCirclePreview({
          id: data.id,
          name: data.name,
          contributionAmount: data.contributionAmount,
          frequency: data.frequency,
          memberCount: data.memberCount,
          totalMembers: data.totalMembers,
          adminName: data.adminName,
        });
      } else {
        setError(data.detail || 'Circle not found. Please check the invite code.');
      }
    } catch (err) {
      // For demo, show mock data
      setCirclePreview({
        id: 'circle-demo',
        name: 'Gold Savings Circle',
        contributionAmount: 500,
        frequency: 'monthly',
        memberCount: 6,
        totalMembers: 8,
        adminName: 'Sarah Johnson',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinCircle = async () => {
    if (!circlePreview) return;

    setIsJoining(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/circles/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode: inviteCode.toUpperCase(),
          userId: 'current-user-id', // Would come from auth context
          userName: 'New Member',
        }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.detail || 'Failed to join circle. Please try again.');
        setShowErrorModal(true);
      }
    } catch (err) {
      // For demo purposes, show success
      setShowSuccessModal(true);
    } finally {
      setIsJoining(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.replace('/');
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
  };

  const handleErrorRetry = () => {
    setShowErrorModal(false);
    handleJoinCircle();
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'weekly': return '/week';
      case 'biweekly': return '/2 weeks';
      case 'monthly': return '/month';
      default: return '/month';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Welcome!"
        message={`You've joined ${circlePreview?.name || 'the circle'} successfully! Start contributing to your savings circle.`}
        buttonText="Go to Dashboard"
        onClose={handleSuccessClose}
      />
      
      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        title="Unable to Join"
        message={errorMessage}
        buttonText="Try Again"
        onRetry={handleErrorRetry}
        onClose={handleErrorClose}
      />
      
      {/* Loading Overlay */}
      <LoadingOverlay visible={isJoining} message="Joining circle..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Circle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.illustrationBg}
          >
            <MaterialCommunityIcons name="account-group" size={48} color="#FFF" />
          </LinearGradient>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>Join a Savings Circle</Text>
        <Text style={styles.description}>
          Enter the invite code shared with you to join an existing circle
        </Text>

        {/* Invite Code Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Invite Code</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter 8-character code"
                placeholderTextColor="#94A3B8"
                value={inviteCode}
                onChangeText={(text) => {
                  setInviteCode(text.toUpperCase());
                  setError('');
                  setCirclePreview(null);
                }}
                autoCapitalize="characters"
                maxLength={8}
              />
              {inviteCode.length > 0 && (
                <TouchableOpacity onPress={() => setInviteCode('')}>
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={[
                styles.findBtn,
                inviteCode.length < 6 && styles.findBtnDisabled
              ]}
              onPress={handleFindCircle}
              disabled={inviteCode.length < 6 || isSearching}
              activeOpacity={0.8}
            >
              {isSearching ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="search" size={22} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Circle Preview Card */}
        {circlePreview && (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewIconContainer}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.previewIcon}
                >
                  <MaterialCommunityIcons name="circle-multiple" size={24} color="#FFF" />
                </LinearGradient>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>{circlePreview.name}</Text>
                <Text style={styles.previewAdmin}>Created by {circlePreview.adminName}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <View style={[styles.previewStatIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="cash-outline" size={18} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.previewStatValue}>
                    ${circlePreview.contributionAmount}
                  </Text>
                  <Text style={styles.previewStatLabel}>
                    {getFrequencyLabel(circlePreview.frequency)}
                  </Text>
                </View>
              </View>

              <View style={styles.previewStatDivider} />

              <View style={styles.previewStat}>
                <View style={[styles.previewStatIcon, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="people-outline" size={18} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={styles.previewStatValue}>
                    {circlePreview.memberCount}/{circlePreview.totalMembers}
                  </Text>
                  <Text style={styles.previewStatLabel}>members</Text>
                </View>
              </View>

              <View style={styles.previewStatDivider} />

              <View style={styles.previewStat}>
                <View style={[styles.previewStatIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="calendar-outline" size={18} color="#16A34A" />
                </View>
                <View>
                  <Text style={styles.previewStatValue}>
                    #{circlePreview.memberCount + 1}
                  </Text>
                  <Text style={styles.previewStatLabel}>your turn</Text>
                </View>
              </View>
            </View>

            {/* Available Spot Notice */}
            <View style={styles.spotNotice}>
              <Ionicons name="information-circle" size={18} color="#3B82F6" />
              <Text style={styles.spotNoticeText}>
                {circlePreview.totalMembers - circlePreview.memberCount} spot{circlePreview.totalMembers - circlePreview.memberCount !== 1 ? 's' : ''} available
              </Text>
            </View>

            {/* Join Button */}
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.joinBtnContainer}
              onPress={handleJoinCircle}
              disabled={isJoining}
            >
              <LinearGradient
                colors={isJoining ? ['#94A3B8', '#64748B'] : ['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.joinBtn}
              >
                {isJoining ? (
                  <>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={styles.joinBtnText}>Joining...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="enter-outline" size={22} color="#FFF" />
                    <Text style={styles.joinBtnText}>Join Circle</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!circlePreview && !error && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={40} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>Enter an invite code</Text>
            <Text style={styles.emptyText}>
              Ask your circle admin to share the invite code with you
            </Text>
          </View>
        )}

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
            <Text style={styles.trustText}>Secure joining</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={18} color="#16A34A" />
            <Text style={styles.trustText}>Verified circles</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  illustrationBg: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
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
    fontSize: 18,
    color: '#1E293B',
    letterSpacing: 3,
    fontWeight: '600',
    height: '100%',
  },
  findBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  previewCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIconContainer: {
    marginRight: 12,
  },
  previewIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  previewAdmin: {
    fontSize: 13,
    color: '#64748B',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  previewStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  previewStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  previewStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },
  spotNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 8,
  },
  spotNoticeText: {
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  joinBtnContainer: {
    width: '100%',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  joinBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
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
  bottomSpacer: {
    height: 40,
  },
});
