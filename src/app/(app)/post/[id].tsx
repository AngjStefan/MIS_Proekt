import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePosts } from '@/providers/posts-provider';
import { Post, SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/post';
import { colors, spacing, typography, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { posts } = usePosts();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[post.severity] }]}>
          <Text style={styles.severityText}>{SEVERITY_LABELS[post.severity]}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>{post.locationLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>{formatDate(post.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="thumb-up" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>{post.voteCount} votes</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={18} color={colors.textSecondary} />
            <Text style={styles.infoText}>{post.createdBy}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: spacing.lg,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  severityText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  infoSection: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
