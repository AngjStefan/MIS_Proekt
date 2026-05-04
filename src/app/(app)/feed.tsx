import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '@/providers/posts-provider';
import { PostCard } from '@/components/feed/PostCard';
import { colors, spacing, typography } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function FeedTab() {
  const { posts } = usePosts();
  const router = useRouter();

  const handlePostPress = (postId: string) => {
    router.push(`/(app)/post/${postId}` as any);
  };

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <MaterialIcons name="feed" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyDescription}>
            Tap the + button to create your first report
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePostPress(item.id)}>
            <PostCard post={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex:1,
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
