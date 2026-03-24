import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock data for the dashboard
const nextPayment = {
  amount: 500,
  groupName: 'Gold Savings Circle',
  dueDate: 'Apr 15, 2025',
  daysRemaining: 3,
};

const circles = [
  {
    id: '1',
    name: 'Gold Savings',
    members: 6,
    monthlyContribution: 500,
    turnPosition: 3,
    totalPot: 3000,
    color: '#F59E0B',
    verified: true,
    pending: 2,
  },
  {
    id: '2',
    name: 'Family Fund',
    members: 10,
    monthlyContribution: 300,
    turnPosition: 5,
    totalPot: 3000,
    color: '#3B82F6',
    verified: true,
    pending: 0,
  },
  {
    id: '3',
    name: 'Emergency Pool',
    members: 8,
    monthlyContribution: 200,
    turnPosition: 7,
    totalPot: 1600,
    color: '#8B5CF6',
    verified: true,
    pending: 0,
  },
];

const stats = {
  totalMembers: 24,
  totalValue: 7800,
  overdueMembers: 1,
};

export default function FintechDashboard() {
  const router = useRouter();

  const navigateToCircle = () => {
    router.push('/circle-details');
  };

  const navigateToCreateCircle = () => {
    router.push('/create-circle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>Sarah Johnson</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Due Date Warning Banner */}
        {nextPayment.daysRemaining <= 3 && (
          <LinearGradient
            colors={['#F97316', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.warningBanner}
          >
            <Ionicons name="warning" size={18} color="#FFF" />
            <Text style={styles.warningText}>Due in {nextPayment.daysRemaining} day{nextPayment.daysRemaining !== 1 ? 's' : ''}</Text>
          </LinearGradient>
        )}

        {/* Next Payment Card */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentLabel}>Next Payment Due</Text>
            <View style={styles.groupBadge}>
              <Text style={styles.groupBadgeText}>{nextPayment.groupName}</Text>
            </View>
          </View>
          
          <View style={styles.paymentAmountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.paymentAmount}>{nextPayment.amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.dueDateRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.dueDate}>Due: {nextPayment.dueDate}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payNowBtn}
            >
              <Ionicons name="flash" size={20} color="#FFF" />
              <Text style={styles.payNowText}>Pay Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <FontAwesome5 name="users" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.totalMembers}</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}>
              <FontAwesome5 name="dollar-sign" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>${stats.totalValue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Overdue Alert */}
        {stats.overdueMembers > 0 && (
          <View style={styles.overdueAlert}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.overdueText}>{stats.overdueMembers} member{stats.overdueMembers !== 1 ? 's' : ''} overdue</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* My Circles Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Circles</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Circle Cards */}
        {circles.map((circle) => (
          <TouchableOpacity key={circle.id} style={styles.circleCard} activeOpacity={0.7} onPress={navigateToCircle}>
            <View style={styles.circleHeader}>
              <View style={styles.circleInfo}>
                <View style={[styles.circleIcon, { backgroundColor: circle.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name="circle-multiple" 
                    size={20} 
                    color={circle.color} 
                  />
                </View>
                <View style={styles.circleDetails}>
                  <View style={styles.circleTitleRow}>
                    <Text style={styles.circleName}>{circle.name}</Text>
                    {circle.verified && (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#3B82F6" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.circleMembers}>{circle.members} members</Text>
                </View>
              </View>
              <View style={styles.circleAmount}>
                <Text style={styles.contributionAmount}>${circle.monthlyContribution}</Text>
                <Text style={styles.contributionPeriod}>/mo</Text>
              </View>
            </View>

            <View style={styles.circleStats}>
              <View style={styles.circleStat}>
                <Text style={styles.circleStatLabel}>Your Turn</Text>
                <Text style={styles.circleStatValue}>#{circle.turnPosition}</Text>
              </View>
              <View style={styles.circleStatDivider} />
              <View style={styles.circleStat}>
                <Text style={styles.circleStatLabel}>Total Pot</Text>
                <Text style={styles.circleStatValue}>${circle.totalPot.toLocaleString()}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(circle.turnPosition / circle.members) * 100}%`,
                      backgroundColor: circle.pending > 0 ? '#EF4444' : circle.color 
                    }
                  ]} 
                />
              </View>
              {circle.pending > 0 && (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>{circle.pending} Pending</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add Circle Button */}
        <TouchableOpacity style={styles.addCircleBtn} activeOpacity={0.7} onPress={navigateToCreateCircle}>
          <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
          <Text style={styles.addCircleText}>Join or Create a Circle</Text>
        </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  groupBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  groupBadgeText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  paymentAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  paymentAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dueDate: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  payNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  payNowText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  overdueText: {
    flex: 1,
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  viewAllText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  circleCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  circleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  circleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleDetails: {
    justifyContent: 'center',
  },
  circleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
  },
  circleMembers: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  circleAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  contributionAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  contributionPeriod: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  circleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  circleStat: {
    flex: 1,
    alignItems: 'center',
  },
  circleStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  circleStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  circleStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  pendingBadge: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingText: {
    fontSize: 11,
    color: '#EA580C',
    fontWeight: '600',
  },
  addCircleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    marginTop: 4,
  },
  addCircleText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
