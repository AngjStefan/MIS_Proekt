import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../validation/auth';
import { colors, typography, spacing } from '../../theme/tokens';
import {
  AppTextInput,
  PrimaryButton,
  AuthScreenContainer,
  FormErrorText,
} from '../../components/ui';

export default function ForgotPasswordScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: 'riskintelligence://reset-password',
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSent(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <AuthScreenContainer>
        <View style={styles.centered}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{'\u2709\uFE0F'}</Text>
          </View>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a password reset link to your email address.
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.backLink}>Back to sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </AuthScreenContainer>
    );
  }

  return (
    <AuthScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we&apos;ll send you a reset link
        </Text>
      </View>

      {error ? <FormErrorText message={error} /> : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <PrimaryButton
        title="Send reset link"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        disabled={!isValid || submitting}
      />

      <View style={styles.footer}>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.backLink}>Back to sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  footer: {
    marginTop: spacing.xl2,
    alignItems: 'center',
  },
  backLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
