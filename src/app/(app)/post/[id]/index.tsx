import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePosts } from '@/providers/posts-provider';
import { useAuth } from '@/providers/auth-provider';
import { SEVERITY_COLORS, SEVERITY_LABELS } from '@/types/post';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, upvotePost, downvotePost, toggleBookmark, isBookmarked, deletePost } = usePosts();
  const { user } = useAuth();
  const router = useRouter();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>This post no longer exists</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwner = user && post.authorId === user.id;
  const bookmarked = isBookmarked(post.id);

  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePost(post.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={styles.headerActions}>
          {isOwner && (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <MaterialIcons name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => toggleBookmark(post)} style={styles.headerButton}>
            <MaterialIcons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={bookmarked ? colors.primary : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {post.imageUri && (
          <Image source={{ uri: post.imageUri }} style={styles.image} />
        )}

        <View style={styles.details}>
          <View style={styles.row}>
            <View style={[styles.severityBadge, { backgroundColor: SEVERITY_COLORS[post.severity] }]}>
              <Text style={styles.severityText}>{SEVERITY_LABELS[post.severity]}</Text>
            </View>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>

          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={20} color={colors.primary} />
            <Text style={styles.locationLabel}>{post.locationLabel}</Text>
          </View>

          <View style={styles.coordinatesContainer}>
            <MaterialIcons name="my-location" size={16} color={colors.textMuted} />
            <Text style={styles.coordinates}>
              Lat: {post.latitude.toFixed(6)}, Lng: {post.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.votingContainer}>
            <TouchableOpacity style={styles.voteButton} onPress={() => downvotePost(post.id)}>
              <MaterialIcons name="keyboard-arrow-down" size={28} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.voteCountContainer}>
              <Text style={styles.voteCount}>{post.voteCount}</Text>
              <Text style={styles.voteLabel}>Votes</Text>
            </View>
            <TouchableOpacity style={styles.voteButton} onPress={() => upvotePost(post.id)}>
              <MaterialIcons name="keyboard-arrow-up" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: spacing.sm,
  },
  bookmarkButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  image: {
    width: '100%',
    height: 250,
  },
  details: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  severityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  severityText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  locationLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: spacing.sm,
    flex: 1,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  coordinates: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  votingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  voteButton: {
    padding: spacing.sm,
  },
  voteCountContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  voteCount: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  voteLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.md,
  },
});