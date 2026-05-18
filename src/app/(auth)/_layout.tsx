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
              <Text style={styles.logoText}>SP</Text>
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.appName}>SafeParking</Text>
              <View style={styles.accentBar} />
            </View>
            <Text style={styles.tagline}>Find safe parking, stay informed</Text>
          </View>
          <ActivityIndicator color={colors.accent} size="large" style={styles.loader} />
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
    borderWidth: 2,
    borderColor: colors.accent,
  },
  logoText: {
    ...typography.heading,
    color: colors.accent,
    fontSize: 24,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
