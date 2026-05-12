import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { registerSchema, type RegisterFormData } from '../../validation/auth';
import { colors, typography, spacing } from '../../theme/tokens';
import {
  AppTextInput,
  PasswordInput,
  PrimaryButton,
  AuthScreenContainer,
  FormErrorText,
} from '../../components/ui';

const PASSWORD_REQUIREMENTS = [
  'At least 8 characters',
  'One uppercase letter',
  'One number',
];

export default function RegisterScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists.');
        } else if (signUpError.message.includes('password')) {
          setError(signUpError.message);
        } else {
          setError(signUpError.message);
        }
        return;
      }

      router.replace('/(app)/explore');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join your community in making it safer</Text>
      </View>

      {error ? <FormErrorText message={error} /> : null}

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            label="Full name"
            placeholder="Your full name"
            autoComplete="name"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.fullName?.message}
          />
        )}
      />

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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      <View style={styles.requirements}>
        {PASSWORD_REQUIREMENTS.map((req) => (
          <Text key={req} style={styles.requirementText}>
            {`\u2022 ${req}`}
          </Text>
        ))}
      </View>

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label="Confirm password"
            placeholder="Repeat your password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <PrimaryButton
        title="Create account"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        disabled={!isValid || submitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>Sign in</Text>
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
  requirements: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  requirementText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl2,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});
