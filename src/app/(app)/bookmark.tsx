import React from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { usePosts } from '@/providers/posts-provider';
import { PostCard } from '@/components/feed/PostCard';
import { colors, spacing } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookmarkTab() {
  const { bookmarkedPosts, upvotePost, downvotePost } = usePosts();

  if (bookmarkedPosts.length === 0) {
    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandName}>SafeParking</Text>
          <View style={styles.brandAccent} />
        </View>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>
      <View style={styles.emptyState}>
        <MaterialIcons name="bookmark-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No bookmarks yet</Text>
        <Text style={styles.emptyDescription}>
          Save posts to review them later
        </Text>
      </View>
    </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandName}>SafeParking</Text>
          <View style={styles.brandAccent} />
        </View>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          data={bookmarkedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onUpvote={() => upvotePost(item.id)}
              onDownvote={() => downvotePost(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  brandName: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandAccent: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});