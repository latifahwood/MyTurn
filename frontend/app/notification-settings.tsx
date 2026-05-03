import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationSettings() {
  const router = useRouter();
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);
  const [payoutNotifications, setPayoutNotifications] = useState(true);
  const [groupActivity, setGroupActivity] = useState(false);
  const [promotions, setPromotions] = useState(false);

  const notificationSettings = [
    {
      id: 'payment-reminders',
      title: 'Payment Reminders',
      description: 'Get notified 2 days before payment is due',
      icon: 'calendar-outline',
      iconColor: '#3B82F6',
      iconBg: '#EFF6FF',
      value: paymentReminders,
      onChange: setPaymentReminders,
    },
    {
      id: 'overdue-alerts',
      title: 'Overdue Alerts',
      description: 'Urgent notifications for late payments',
      icon: 'alert-circle-outline',
      iconColor: '#DC2626',
      iconBg: '#FEE2E2',
      value: overdueAlerts,
      onChange: setOverdueAlerts,
    },
    {
      id: 'payout-notifications',
      title: 'Payout Notifications',
      description: 'Know when it\'s your turn to receive payout',
      icon: 'gift-outline',
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      value: payoutNotifications,
      onChange: setPayoutNotifications,
    },
    {
      id: 'group-activity',
      title: 'Group Activity',
      description: 'Updates when members make payments',
      icon: 'people-outline',
      iconColor: '#8B5CF6',
      iconBg: '#F3E8FF',
      value: groupActivity,
      onChange: setGroupActivity,
    },
    {
      id: 'promotions',
      title: 'Tips & Updates',
      description: 'Financial tips and app updates',
      icon: 'bulb-outline',
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
      value: promotions,
      onChange: setPromotions,
    },
  ];

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="notifications" size={20} color="#3B82F6" />
          <Text style={styles.infoBannerText}>
            Stay on top of your payments and never miss a due date
          </Text>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          {notificationSettings.map((setting, index) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: setting.iconBg }]}>
                <Ionicons name={setting.icon as any} size={22} color={setting.iconColor} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onChange}
                trackColor={{ false: '#E2E8F0', true: '#93C5FD' }}
                thumbColor={setting.value ? '#3B82F6' : '#FFF'}
                ios_backgroundColor="#E2E8F0"
              />
            </View>
          ))}
        </View>

        {/* Reminder Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Preview</Text>
          
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Ionicons name="notifications" size={18} color="#D97706" />
              <Text style={styles.previewTitle}>Payment Due Soon</Text>
            </View>
            <Text style={styles.previewBody}>
              Your $500 payment to Gold Savings Circle is due in 2 days
            </Text>
            <Text style={styles.previewTime}>Just now</Text>
          </View>

          <View style={[styles.previewCard, styles.previewCardUrgent]}>
            <View style={styles.previewHeader}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={[styles.previewTitle, { color: '#DC2626' }]}>Payment Overdue</Text>
            </View>
            <Text style={styles.previewBody}>
              You are 3 days late on your payment to Gold Savings Circle
            </Text>
            <Text style={styles.previewTime}>2 hours ago</Text>
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Settings</Text>
          
          <View style={styles.menuItemDisabled}>
            <View style={[styles.settingIcon, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="moon-outline" size={22} color="#94A3B8" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitleDisabled}>Quiet Hours</Text>
              <Text style={styles.settingDescription}>10:00 PM - 8:00 AM</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>

          <View style={styles.menuItemDisabled}>
            <View style={[styles.settingIcon, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="mail-outline" size={22} color="#94A3B8" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitleDisabled}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Weekly summary emails</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748B',
  },
  previewCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  previewCardUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  previewBody: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 6,
  },
  previewTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    opacity: 0.7,
  },
  settingTitleDisabled: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
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
  bottomSpacer: {
    height: 40,
  },
});
