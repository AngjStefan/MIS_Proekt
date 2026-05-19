import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePosts } from '@/providers/posts-provider';
import { PostCard } from '@/components/feed/PostCard';
import { colors, spacing } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function FeedTab() {
  const { posts, upvotePost, downvotePost, toggleBookmark, isBookmarked, loadPosts } = usePosts();
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  if (posts.length === 0) {
    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandName}>SafeParking</Text>
          <View style={styles.brandAccent} />
        </View>
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
      <View style={styles.emptyState}>
        <MaterialIcons name="feed" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyTitle}>No posts yet</Text>
        <Text style={styles.emptyDescription}>
          Tap the + button to create your first report
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
        <Text style={styles.headerTitle}>Feed</Text>
      </View>
      <View style={styles.listWrapper}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push(`/(app)/post/${item.id}`)}
            >
              <PostCard
                post={item}
                onUpvote={() => upvotePost(item.id)}
                onDownvote={() => downvotePost(item.id)}
                onBookmark={() => toggleBookmark(item)}
                isBookmarked={isBookmarked(item.id)}
                showBookmark={true}
              />
            </TouchableOpacity>
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
