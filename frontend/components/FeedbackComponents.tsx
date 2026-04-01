import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

// Success Modal Component
interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export function SuccessModal({ visible, title, message, buttonText = 'Done', onClose }: SuccessModalProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12 });
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, animatedStyle]}>
          <View style={styles.successIconContainer}>
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              style={styles.successIconBg}
            >
              <Ionicons name="checkmark" size={40} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.modalButtonGradient}
            >
              <Text style={styles.modalButtonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Error Modal Component
interface ErrorModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onRetry?: () => void;
  onClose: () => void;
}

export function ErrorModal({ visible, title, message, buttonText = 'Try Again', onRetry, onClose }: ErrorModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={styles.modalContent}
          entering={FadeInUp.duration(300)}
        >
          <View style={styles.errorIconContainer}>
            <View style={styles.errorIconBg}>
              <Ionicons name="alert-circle" size={40} color="#DC2626" />
            </View>
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.errorButtonRow}>
            <TouchableOpacity style={styles.errorSecondaryButton} onPress={onClose}>
              <Text style={styles.errorSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            {onRetry && (
              <TouchableOpacity style={styles.errorPrimaryButton} onPress={onRetry}>
                <Text style={styles.errorPrimaryButtonText}>{buttonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Loading Overlay Component
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Animated.View 
      style={styles.loadingOverlay}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.loadingContent}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </Animated.View>
  );
}

// Inline Loading State
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={styles.inlineLoading}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.inlineLoadingText}>{message}</Text>
    </View>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionText, onAction }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon} size={48} color="#CBD5E1" />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionText && onAction && (
        <TouchableOpacity style={styles.emptyActionButton} onPress={onAction}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.emptyActionButtonGradient}
          >
            <Text style={styles.emptyActionButtonText}>{actionText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Toast Notification
interface ToastProps {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export function Toast({ visible, type, message }: ToastProps) {
  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { bg: '#DCFCE7', border: '#86EFAC', icon: 'checkmark-circle', iconColor: '#16A34A' };
      case 'error':
        return { bg: '#FEE2E2', border: '#FECACA', icon: 'alert-circle', iconColor: '#DC2626' };
      case 'warning':
        return { bg: '#FEF3C7', border: '#FDE68A', icon: 'warning', iconColor: '#D97706' };
      case 'info':
        return { bg: '#EFF6FF', border: '#BFDBFE', icon: 'information-circle', iconColor: '#3B82F6' };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View 
      style={[
        styles.toast, 
        { backgroundColor: toastStyle.bg, borderColor: toastStyle.border }
      ]}
      entering={FadeInUp.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Ionicons name={toastStyle.icon as any} size={20} color={toastStyle.iconColor} />
      <Text style={[styles.toastText, { color: toastStyle.iconColor }]}>{message}</Text>
    </Animated.View>
  );
}

// Skeleton Loader for Cards
export function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonTextGroup}>
          <View style={[styles.skeletonText, { width: '60%' }]} />
          <View style={[styles.skeletonText, { width: '40%', marginTop: 6 }]} />
        </View>
      </View>
      <View style={[styles.skeletonText, { width: '100%', height: 12, marginTop: 12 }]} />
      <View style={[styles.skeletonText, { width: '80%', height: 12, marginTop: 8 }]} />
    </View>
  );
}

// Role Badge Component
interface RoleBadgeProps {
  role: 'admin' | 'member';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isAdmin = role === 'admin';
  return (
    <View style={[
      styles.roleBadge, 
      { backgroundColor: isAdmin ? '#FEF3C7' : '#EFF6FF' }
    ]}>
      <Ionicons 
        name={isAdmin ? 'shield-checkmark' : 'person'} 
        size={12} 
        color={isAdmin ? '#D97706' : '#3B82F6'} 
      />
      <Text style={[
        styles.roleBadgeText, 
        { color: isAdmin ? '#D97706' : '#3B82F6' }
      ]}>
        {isAdmin ? 'Admin' : 'Member'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  errorButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  errorSecondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  errorSecondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  errorPrimaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  errorPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },

  // Loading Styles
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  inlineLoading: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  inlineLoadingText: {
    fontSize: 14,
    color: '#64748B',
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyActionButton: {
    width: '100%',
  },
  emptyActionButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyActionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },

  // Toast Styles
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    zIndex: 1000,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },

  // Skeleton Styles
  skeletonCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  skeletonTextGroup: {
    flex: 1,
  },
  skeletonText: {
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },

  // Role Badge Styles
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
