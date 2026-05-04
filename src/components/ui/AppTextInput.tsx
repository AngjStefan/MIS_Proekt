import { forwardRef } from 'react';
import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/tokens';

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  ({ label, error, style, ...rest }, ref) => (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorMuted,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
