import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { loginSchema, type LoginFormData } from '../../validation/auth';
import { colors, typography, spacing } from '../../theme/tokens';
import {
  AppTextInput,
  PasswordInput,
  PrimaryButton,
  AuthScreenContainer,
  FormErrorText,
} from '../../components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      router.replace('/app');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
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

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
          />
        )}
      />

      <View style={styles.forgotContainer}>
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.forgotLink}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <PrimaryButton
        title="Sign in"
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
        disabled={!isValid || submitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLink}>Create account</Text>
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
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
