import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Post, SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/post';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface PostPreviewCardProps {
  post: Post;
  onClose: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

export function PostPreviewCard({ post, onClose, onUpvote, onDownvote }: PostPreviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {post.imageUri && (
        <Image source={{ uri: post.imageUri }} style={styles.image} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[post.severity] }]}>
            <Text style={styles.severityText}>{SEVERITY_LABELS[post.severity]}</Text>
          </View>
          <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>
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
            <TouchableOpacity onPress={onDownvote} style={styles.voteButton}>
              <MaterialIcons name="keyboard-arrow-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={styles.voteText}>{post.voteCount}</Text>
            <TouchableOpacity onPress={onUpvote} style={styles.voteButton}>
              <MaterialIcons name="keyboard-arrow-up" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: spacing.md,
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
    fontSize: 11,
    fontWeight: '600',
  },
  date: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
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
    flex: 1,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  voteButton: {
    padding: 2,
  },
  voteText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: spacing.xs,
    minWidth: 24,
    textAlign: 'center',
  },
});