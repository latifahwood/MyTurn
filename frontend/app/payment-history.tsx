import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// Default mock data (used when API not available)
const defaultPaymentHistory = [
  {
    id: '1',
    date: 'Mar 12, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 0,
    paidDate: '2025-03-12T10:30:00Z',
  },
  {
    id: '2',
    date: 'Feb 15, 2025',
    amount: 525,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 25,
    paidDate: '2025-02-18T14:20:00Z',
  },
  {
    id: '3',
    date: 'Mar 10, 2025',
    amount: 300,
    circleName: 'Family Fund',
    status: 'paid',
    lateFee: 0,
    paidDate: '2025-03-10T09:15:00Z',
  },
  {
    id: '4',
    date: 'Mar 15, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'pending',
    lateFee: 0,
    paidDate: null,
  },
  {
    id: '5',
    date: 'Mar 1, 2025',
    amount: 200,
    circleName: 'Emergency Pool',
    status: 'late',
    lateFee: 15,
    daysOverdue: 5,
    paidDate: null,
  },
  {
    id: '6',
    date: 'Jan 15, 2025',
    amount: 500,
    circleName: 'Gold Savings Circle',
    status: 'paid',
    lateFee: 0,
    paidDate: '2025-01-15T11:00:00Z',
  },
];

const circles = ['All Circles', 'Gold Savings Circle', 'Family Fund', 'Emergency Pool'];
const statuses = ['All', 'Paid', 'Pending', 'Late'];

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  circleName: string;
  status: string;
  lateFee: number;
  paidDate?: string | null;
  daysOverdue?: number;
}

export default function PaymentHistory() {
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(defaultPaymentHistory);
  const [selectedCircle, setSelectedCircle] = useState('All Circles');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/payments/history/current-user-id`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPaymentHistory(data);
        }
      }
    } catch (error) {
      // Use default data if API fails
      console.log('Using default payment history');
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchPaymentHistory();
    setIsRefreshing(false);
  };

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPayments = paymentHistory.filter(payment => {
    const circleMatch = selectedCircle === 'All Circles' || payment.circleName === selectedCircle;
    const statusMatch = selectedStatus === 'All' || payment.status === selectedStatus.toLowerCase();
    return circleMatch && statusMatch;
  });

  const totalPaid = paymentHistory
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = paymentHistory.filter(p => p.status === 'pending').length;
  const lateCount = paymentHistory.filter(p => p.status === 'late').length;

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
          <View style={[styles.summaryIcon, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
          </View>
          <View>
            <Text style={styles.summaryValue}>${totalPaid.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Paid</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={18} color="#D97706" />
          </View>
          <View>
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
          </View>
          <View>
            <Text style={styles.summaryValue}>{lateCount}</Text>
            <Text style={styles.summaryLabel}>Late</Text>
          </View>
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading payments...</Text>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && filteredPayments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="receipt-outline" size={48} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No payments yet</Text>
            <Text style={styles.emptyText}>
              Your payment activity will appear here once you make your first contribution
            </Text>
            <TouchableOpacity 
              style={styles.emptyActionBtn}
              onPress={() => router.push('/')}
            >
              <Text style={styles.emptyActionBtnText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Payment List */
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {filteredPayments.map((payment, index) => {
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
                      {payment.paidDate && payment.status === 'paid' && (
                        <Text style={styles.paidDateText}>
                          Paid {formatDate(payment.paidDate)}
                        </Text>
                      )}
                      {payment.daysOverdue && payment.status === 'late' && (
                        <Text style={styles.overdueText}>
                          {payment.daysOverdue} days overdue
                        </Text>
                      )}
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
            })}
          </>
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
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 18,
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
  paidDateText: {
    fontSize: 11,
    color: '#16A34A',
    marginTop: 2,
  },
  overdueText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 2,
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
  loadingState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyActionBtn: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  listHeader: {
    marginBottom: 12,
  },
  listHeaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
