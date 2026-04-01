import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock payment history data
const paymentHistory = [
  {
    id: '1',
    date: 'Mar 12, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 0,
  },
  {
    id: '2',
    date: 'Feb 15, 2025',
    amount: 525,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 25,
  },
  {
    id: '3',
    date: 'Mar 10, 2025',
    amount: 300,
    circleName: 'Family Fund',
    status: 'paid',
    lateFee: 0,
  },
  {
    id: '4',
    date: 'Mar 15, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'pending',
    lateFee: 0,
  },
  {
    id: '5',
    date: 'Mar 1, 2025',
    amount: 200,
    circleName: 'Emergency Pool',
    status: 'late',
    lateFee: 15,
  },
  {
    id: '6',
    date: 'Jan 15, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 0,
  },
];

const circles = ['All Circles', 'Gold Savings Circle', 'Family Fund', 'Emergency Pool'];
const statuses = ['All', 'Paid', 'Pending', 'Late'];

export default function PaymentHistory() {
  const router = useRouter();
  const [selectedCircle, setSelectedCircle] = useState('All Circles');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#DCFCE7', text: '#16A34A', label: 'Paid', icon: 'checkmark-circle' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Pending', icon: 'time' };
      case 'late':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Late', icon: 'alert-circle' };
      default:
        return { bg: '#F1F5F9', text: '#64748B', label: 'Unknown', icon: 'help-circle' };
    }
  };

  const filteredPayments = paymentHistory.filter(payment => {
    const circleMatch = selectedCircle === 'All Circles' || payment.circleName === selectedCircle;
    const statusMatch = selectedStatus === 'All' || payment.status === selectedStatus.toLowerCase();
    return circleMatch && statusMatch;
  });

  const totalPaid = paymentHistory
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

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
        <Text style={styles.headerTitle}>Payment History</Text>
        <TouchableOpacity 
          style={styles.filterBtn}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name={showFilters ? "options" : "options-outline"} 
            size={22} 
            color={showFilters ? "#3B82F6" : "#64748B"} 
          />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>${totalPaid.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Transactions</Text>
          <Text style={styles.summaryValue}>{paymentHistory.length}</Text>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Circle</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {circles.map((circle) => (
              <TouchableOpacity
                key={circle}
                style={[
                  styles.filterChip,
                  selectedCircle === circle && styles.filterChipSelected
                ]}
                onPress={() => setSelectedCircle(circle)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCircle === circle && styles.filterChipTextSelected
                ]}>
                  {circle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.filterLabel, { marginTop: 12 }]}>Status</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  selectedStatus === status && styles.filterChipSelected
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextSelected
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Empty State */}
        {filteredPayments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No payments yet</Text>
            <Text style={styles.emptyText}>
              Your payment activity will appear here once you make your first contribution
            </Text>
          </View>
        ) : (
          /* Payment List */
          filteredPayments.map((payment, index) => {
            const statusStyle = getStatusStyle(payment.status);
            return (
              <TouchableOpacity key={payment.id} style={styles.paymentCard} activeOpacity={0.7}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIcon, { backgroundColor: statusStyle.bg }]}>
                    <Ionicons name={statusStyle.icon as any} size={20} color={statusStyle.text} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentCircle}>{payment.circleName}</Text>
                    <Text style={styles.paymentDate}>{payment.date}</Text>
                  </View>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>
                    ${payment.amount.toLocaleString()}
                  </Text>
                  {payment.lateFee > 0 && (
                    <Text style={styles.lateFeeText}>+${payment.lateFee} fee</Text>
                  )}
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

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
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentCard: {
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
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCircle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 13,
    color: '#94A3B8',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  lateFeeText: {
    fontSize: 11,
    color: '#DC2626',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
