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
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

// Generate a random invite code
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const inviteCode = generateInviteCode();
const inviteLink = `https://savingscircle.app/join/${inviteCode}`;

export default function InviteMembers() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my savings circle on SavingsCircle! Use this link to join: ${inviteLink}`,
        title: 'Join My Savings Circle',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Join my savings circle! 💰\n\nUse this link to join: ${inviteLink}`);
    // This would open WhatsApp with the message
    Alert.alert('Share via WhatsApp', 'WhatsApp share would open here in a real device');
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
        <Text style={styles.headerTitle}>Invite Members</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Illustration / Icon */}
        <View style={styles.illustrationContainer}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.illustrationBg}
          >
            <Ionicons name="people" size={48} color="#FFF" />
          </LinearGradient>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>Grow Your Circle</Text>
        <Text style={styles.description}>
          Share this link to invite members to your circle. They'll be able to join instantly.
        </Text>

        {/* Invite Link Card */}
        <View style={styles.linkCard}>
          <View style={styles.linkHeader}>
            <Ionicons name="link" size={20} color="#3B82F6" />
            <Text style={styles.linkLabel}>Your Invite Link</Text>
          </View>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>
              {inviteLink}
            </Text>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Invite Code:</Text>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>

          {/* Copy Button */}
          <TouchableOpacity 
            style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
            onPress={handleCopyLink}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={copied ? "checkmark-circle" : "copy-outline"} 
              size={20} 
              color={copied ? "#16A34A" : "#3B82F6"} 
            />
            <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
              {copied ? 'Link Copied!' : 'Copy Link'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Share Options */}
        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Share via</Text>
          
          <View style={styles.shareButtons}>
            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.shareBtnGradient}
              >
                <Ionicons name="share-social" size={24} color="#FFF" />
              </LinearGradient>
              <Text style={styles.shareBtnLabel}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={handleShareWhatsApp}
              activeOpacity={0.8}
            >
              <View style={[styles.shareBtnIcon, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
              </View>
              <Text style={styles.shareBtnLabel}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <View style={[styles.shareBtnIcon, { backgroundColor: '#1DA1F2' }]}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
              </View>
              <Text style={styles.shareBtnLabel}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <View style={[styles.shareBtnIcon, { backgroundColor: '#64748B' }]}>
                <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
              </View>
              <Text style={styles.shareBtnLabel}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or join a circle</Text>
          <View style={styles.divider} />
        </View>

        {/* Join Circle Section */}
        <View style={styles.joinSection}>
          <Text style={styles.joinTitle}>Have an invite code?</Text>
          <Text style={styles.joinDescription}>
            Enter the code shared with you to join an existing circle
          </Text>

          <TouchableOpacity 
            style={styles.joinCircleLink}
            onPress={() => router.push('/join-circle')}
            activeOpacity={0.7}
          >
            <Ionicons name="enter-outline" size={20} color="#3B82F6" />
            <Text style={styles.joinCircleLinkText}>Go to Join Circle</Text>
            <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={18} color="#16A34A" />
            <Text style={styles.trustText}>Verified invites only</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={18} color="#16A34A" />
            <Text style={styles.trustText}>Secure joining process</Text>
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
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  linkCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  linkContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  codeLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  copyBtnSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  copyBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  copyBtnTextSuccess: {
    color: '#16A34A',
  },
  shareSection: {
    marginBottom: 28,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 14,
    textAlign: 'center',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  shareBtn: {
    alignItems: 'center',
    gap: 8,
  },
  shareBtnGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#94A3B8',
  },
  joinSection: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  joinTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  joinDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  joinCircleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  joinCircleLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    flex: 1,
    textAlign: 'center',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
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
