import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { TabIconNames, TabIconSizes } from '@/constants/icons';
import { useAuth } from '@/providers/auth-provider';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TABS = [
  { name: 'explore', route: '/(app)/explore', iconName: TabIconNames.explore },
  { name: 'feed', route: '/(app)/feed', iconName: TabIconNames.feed },
  { name: 'create', route: '/(app)/create', iconName: TabIconNames.create },
  { name: 'bookmark', route: '/(app)/bookmark', iconName: TabIconNames.bookmark },
  { name: 'profile', route: '/(app)/profile', iconName: TabIconNames.profile },
];

export default function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (route: string) => pathname.includes(route.replace('/(app)/', ''));

  const handleTabPress = (tab: typeof TABS[0]) => {
    if (tab.name === 'create') {
      router.push('/(app)/create' as any);
      return;
    }
    router.push(tab.route as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = isActive(tab.route);
          const isCenter = tab.name === 'create';

          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.centerButtonWrapper}
                onPress={() => handleTabPress(tab)}
                activeOpacity={0.8}
              >
                <View style={styles.centerButton}>
                  <MaterialIcons
                    name={tab.iconName}
                    size={TabIconSizes.create}
                    color={colors.textPrimary}
                  />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handleTabPress(tab)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.iconName}
                size={active ? TabIconSizes.active : TabIconSizes.default}
                color={active ? colors.accent : colors.textSecondary}
              />
              <View
                style={[
                  styles.activeIndicator,
                  active && { backgroundColor: colors.accent },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(253, 190, 52, 0.2)',
  },
  tab: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centerButtonWrapper: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
