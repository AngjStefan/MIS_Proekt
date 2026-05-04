import { forwardRef, useState } from 'react';
import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/tokens';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ label, error, style, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.inputWrapper, error && styles.inputError]}>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!visible}
            autoCapitalize="none"
            textContentType="password"
            {...rest}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setVisible((v) => !v)}
            activeOpacity={0.6}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorMuted,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    height: '100%',
    justifyContent: 'center',
  },
  toggleText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
