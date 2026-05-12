import { Stack, useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../providers/auth-provider';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme/tokens';

function SplashGate() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.replace('/(app)/explore');
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <Text style={styles.logoText}>RI</Text>
            </View>
            <Text style={styles.appName}>RiskIntelligence</Text>
            <Text style={styles.tagline}>City safety, made visible</Text>
          </View>
          <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

export default function AuthLayout() {
  return (
    <>
      <SplashGate />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl3,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    ...typography.heading,
    color: colors.black,
    fontSize: 24,
  },
  appName: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
