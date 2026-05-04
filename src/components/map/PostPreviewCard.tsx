import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Post, SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/post';
import { colors, spacing, typography, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface PostPreviewCardProps {
  post: Post;
  onClose: () => void;
}

export function PostPreviewCard({ post, onClose }: PostPreviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[post.severity] }]}>
          <Text style={styles.severityText}>{SEVERITY_LABELS[post.severity]}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{post.title}</Text>

      {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      )}

      <Text style={styles.description} numberOfLines={2}>
        {post.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {post.locationLabel}
          </Text>
        </View>
        <View style={styles.voteRow}>
          <MaterialIcons name="thumb-up" size={14} color={colors.primary} />
          <Text style={styles.voteText}>{post.voteCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    flex:1,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
