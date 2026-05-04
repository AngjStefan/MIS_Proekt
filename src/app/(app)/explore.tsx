import React, { useRef, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapScreen } from '@/features/map/MapScreen';
import { usePosts } from '@/providers/posts-provider';
import { PostPreviewCard } from '@/components/map/PostPreviewCard';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExploreTab() {
  const { posts } = usePosts();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const router = useRouter();

  const handleMarkerPress = useCallback((postId: string) => {
    setSelectedPost(postId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const selectedPostData = posts.find((p) => p.id === selectedPost);

  return (
    <View style={styles.container}>
      <MapScreen
        posts={posts}
        onMarkerPress={handleMarkerPress}
        selectedPostId={selectedPost}
      />

      {selectedPostData && (
        <View style={styles.previewContainer}>
          <PostPreviewCard
            post={selectedPostData}
            onClose={handleClosePreview}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
  },
});
