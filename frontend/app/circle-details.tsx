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

// Mock data for the circle details
const circleData = {
  name: 'Gold Savings Circle',
  memberCount: 8,
  monthlyContribution: 500,
  totalPot: 4000,
  targetPot: 4000,
  currentTurn: 3,
  totalTurns: 8,
  nextPayoutDate: 'Apr 20, 2025',
  nextPayoutMember: 'Marcus Johnson',
};

const members = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    status: 'paid',
    paidDate: 'Mar 12, 2025',
    isCurrentUser: true,
    turnNumber: 3,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'MJ',
    status: 'paid',
    paidDate: 'Mar 10, 2025',
    isCurrentUser: false,
    turnNumber: 1,
    isNextPayout: true,
  },
  {
    id: '3',
    name: 'Emily Chen',
    avatar: 'EC',
    status: 'paid',
    paidDate: 'Mar 11, 2025',
    isCurrentUser: false,
    turnNumber: 2,
  },
  {
    id: '4',
    name: 'David Williams',
    avatar: 'DW',
    status: 'pending',
    dueDate: 'Mar 15, 2025',
    isCurrentUser: false,
    turnNumber: 4,
  },
  {
    id: '5',
    name: 'Jessica Taylor',
    avatar: 'JT',
    status: 'pending',
    dueDate: 'Mar 15, 2025',
    isCurrentUser: false,
    turnNumber: 5,
  },
  {
    id: '6',
    name: 'Michael Brown',
    avatar: 'MB',
    status: 'late',
    overdueDays: 3,
    isCurrentUser: false,
    turnNumber: 6,
  },
  {
    id: '7',
    name: 'Amanda Davis',
    avatar: 'AD',
    status: 'paid',
    paidDate: 'Mar 9, 2025',
    isCurrentUser: false,
    turnNumber: 7,
  },
  {
    id: '8',
    name: 'Robert Wilson',
    avatar: 'RW',
    status: 'paid',
    paidDate: 'Mar 8, 2025',
    isCurrentUser: false,
    turnNumber: 8,
  },
];

const statusCounts = {
  paid: members.filter(m => m.status === 'paid').length,
  pending: members.filter(m => m.status === 'pending').length,
  late: members.filter(m => m.status === 'late').length,
};

const unpaidMembers = members.filter(m => m.status === 'pending' || m.status === 'late');

export default function CircleDetails() {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          bg: '#DCFCE7',
          text: '#16A34A',
          label: 'Paid',
          icon: 'checkmark-circle',
        };
      case 'pending':
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          label: 'Pending',
          icon: 'time',
        };
      case 'late':
        return {
          bg: '#FEE2E2',
          text: '#DC2626',
          label: 'Late',
          icon: 'alert-circle',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#64748B',
          label: 'Unknown',
          icon: 'help-circle',
        };
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
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
        <View style={styles.headerContent}>
          <Text style={styles.circleName}>{circleData.name}</Text>
          <Text style={styles.circleSummary}>
            {circleData.memberCount} members • ${circleData.monthlyContribution}/mo
          </Text>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Cards Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <FontAwesome5 name="users" size={16} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{circleData.memberCount}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
              <FontAwesome5 name="dollar-sign" size={16} color="#16A34A" />
            </View>
            <Text style={styles.statValue}>${circleData.totalPot.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Pot</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="calendar" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.statValue}>#{circleData.currentTurn}</Text>
            <Text style={styles.statLabel}>Your Turn</Text>
          </View>
        </View>

        {/* Total Pot Card with Progress */}
        <View style={styles.potCard}>
          <View style={styles.potHeader}>
            <View>
              <Text style={styles.potLabel}>Total Pot</Text>
              <View style={styles.potAmountRow}>
                <Text style={styles.potCurrency}>$</Text>
                <Text style={styles.potAmount}>{circleData.totalPot.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.targetBadge}>
              <Text style={styles.targetText}>of ${circleData.targetPot.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(circleData.totalPot / circleData.targetPot) * 100}%` }
                ]} 
              />
              <View 
                style={[
                  styles.progressIndicator,
                  { left: `${(circleData.totalPot / circleData.targetPot) * 100 - 2}%` }
                ]}
              >
                <Ionicons name="location" size={14} color="#3B82F6" />
              </View>
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressPercent}>
                {Math.round((circleData.totalPot / circleData.targetPot) * 100)}% collected
              </Text>
            </View>
          </View>

          {/* Next Payout Info */}
          <View style={styles.payoutInfo}>
            <Ionicons name="gift-outline" size={18} color="#8B5CF6" />
            <View style={styles.payoutTextContainer}>
              <Text style={styles.payoutLabel}>Next Payout:</Text>
              <Text style={styles.payoutValue}>{circleData.nextPayoutMember}</Text>
              <Text style={styles.payoutDate}> • {circleData.nextPayoutDate}</Text>
            </View>
          </View>
        </View>

        {/* Turn Tracker */}
        <View style={styles.turnTracker}>
          <Text style={styles.turnTitle}>Payout Order</Text>
          <View style={styles.turnDisplay}>
            <Text style={styles.turnNumber}>Turn {circleData.currentTurn}</Text>
            <Text style={styles.turnTotal}> of {circleData.totalTurns}</Text>
          </View>
          <View style={styles.turnDots}>
            {Array.from({ length: circleData.totalTurns }, (_, i) => (
              <View 
                key={i}
                style={[
                  styles.turnDot,
                  i < circleData.currentTurn - 1 && styles.turnDotCompleted,
                  i === circleData.currentTurn - 1 && styles.turnDotCurrent,
                ]}
              >
                {i === circleData.currentTurn - 1 && (
                  <Text style={styles.turnDotText}>You</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Payment Status Summary */}
        <View style={styles.statusSummary}>
          <View style={[styles.statusItem, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={[styles.statusCount, { color: '#16A34A' }]}>{statusCounts.paid}</Text>
            <Text style={styles.statusLabel}>Paid</Text>
          </View>
          <View style={[styles.statusItem, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={16} color="#D97706" />
            <Text style={[styles.statusCount, { color: '#D97706' }]}>{statusCounts.pending}</Text>
            <Text style={styles.statusLabel}>Pending</Text>
          </View>
          <View style={[styles.statusItem, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={[styles.statusCount, { color: '#DC2626' }]}>{statusCounts.late}</Text>
            <Text style={styles.statusLabel}>Late</Text>
          </View>
        </View>

        {/* Unpaid Members Banner */}
        {unpaidMembers.length > 0 && (
          <View style={styles.reminderBanner}>
            <View style={styles.reminderIcon}>
              <Ionicons name="notifications" size={20} color="#F59E0B" />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>
                {unpaidMembers.length} member{unpaidMembers.length !== 1 ? 's' : ''} haven't paid
              </Text>
              <Text style={styles.reminderNames}>
                {unpaidMembers.map(m => m.name.split(' ')[0]).join(', ')}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        )}

        {/* Members Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members</Text>
          <Text style={styles.memberCount}>{members.length} people</Text>
        </View>

        {/* Members List */}
        {members.map((member) => {
          const statusBadge = getStatusBadge(member.status);
          return (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberLeft}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(member.name) }]}>
                  <Text style={styles.avatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.isCurrentUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    )}
                    {member.isNextPayout && (
                      <View style={styles.payoutBadge}>
                        <Ionicons name="gift" size={10} color="#8B5CF6" />
                        <Text style={styles.payoutBadgeText}>Next</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberDetail}>
                    {member.status === 'paid' && `Paid on ${member.paidDate}`}
                    {member.status === 'pending' && `Due by ${member.dueDate}`}
                    {member.status === 'late' && `${member.overdueDays} days overdue`}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                <Ionicons name={statusBadge.icon as any} size={14} color={statusBadge.text} />
                <Text style={[styles.statusBadgeText, { color: statusBadge.text }]}>
                  {statusBadge.label}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
          <Text style={styles.secondaryBtnText}>Remind Group</Text>
        </TouchableOpacity>
        
        <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtnContainer} onPress={() => router.push('/payment')}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            <Ionicons name="flash" size={20} color="#FFF" />
            <Text style={styles.primaryBtnText}>Pay Now</Text>
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
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  circleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  circleSummary: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  potCard: {
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
  potHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  potLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  potAmountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  potCurrency: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  potAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -1,
  },
  targetBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  targetText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 5,
  },
  progressIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  progressPercent: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  payoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
  },
  payoutTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  payoutLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  payoutValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    marginLeft: 4,
  },
  payoutDate: {
    fontSize: 13,
    color: '#94A3B8',
  },
  turnTracker: {
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
  turnTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  turnDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  turnNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  turnTotal: {
    fontSize: 18,
    color: '#94A3B8',
    fontWeight: '500',
  },
  turnDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  turnDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnDotCompleted: {
    backgroundColor: '#22C55E',
  },
  turnDotCurrent: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  turnDotText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '700',
  },
  statusSummary: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statusItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  reminderNames: {
    fontSize: 13,
    color: '#B45309',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  memberCount: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  youBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
  },
  payoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  payoutBadgeText: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  memberDetail: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  primaryBtnContainer: {
    flex: 1,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
