import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/theme/tokens';
import { PrimaryButton } from './PrimaryButton';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  postTitle?: string;
  postDescription?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  postTitle,
  postDescription,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {(postTitle || postDescription) && (
            <View style={styles.postPreview}>
              {postTitle && <Text style={styles.postTitle}>{postTitle}</Text>}
              {postDescription && (
                <Text style={styles.postDescription} numberOfLines={3}>
                  {postDescription}
                </Text>
              )}
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            
            <View style={styles.confirmButtonWrapper}>
              <PrimaryButton 
                title={confirmText} 
                onPress={onConfirm} 
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  postPreview: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  postTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  postDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  confirmButtonWrapper: {
    minWidth: 120,
  },
});
