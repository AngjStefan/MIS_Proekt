import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { MapScreen } from '@/features/map/MapScreen';
import { usePosts } from '@/providers/posts-provider';
import { PostPreviewCard } from '@/components/map/PostPreviewCard';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface PendingLocation {
  latitude: number;
  longitude: number;
}

export default function ExploreTab() {
  const { posts, upvotePost, downvotePost } = usePosts();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [pendingLocation, setPendingLocation] = useState<PendingLocation | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setPendingLocation(null);
  }, [pathname]);

  const handleMarkerPress = useCallback((postId: string) => {
    setSelectedPost(postId);
    setPendingLocation(null);
  }, []);

  const handleMapPress = useCallback((lat: number, lng: number) => {
    setSelectedPost(null);
    setPendingLocation({ latitude: lat, longitude: lng });
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    if (pendingLocation) {
      const location = { ...pendingLocation };
      router.push({
        pathname: '/(app)/create',
        params: {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        },
      });
    }
  }, [pendingLocation, router]);

  const handleDismissModal = useCallback(() => {
    setPendingLocation(null);
  }, []);

  const selectedPostData = posts.find((p) => p.id === selectedPost);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandBar}>
          <Text style={styles.brandBarTitle}>SafeParking</Text>
          <View style={styles.brandBarAccent} />
        </View>
        <MapScreen
          posts={posts}
          onMarkerPress={handleMarkerPress}
          onMapPress={handleMapPress}
          selectedPostId={selectedPost}
        />

        {selectedPostData && (
          <View style={styles.previewContainer}>
            <PostPreviewCard
              post={selectedPostData}
              onClose={handleClosePreview}
              onUpvote={() => upvotePost(selectedPostData.id)}
              onDownvote={() => downvotePost(selectedPostData.id)}
            />
          </View>
        )}

        <Modal
          visible={pendingLocation !== null}
          transparent
          animationType="fade"
          onRequestClose={handleDismissModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={handleDismissModal}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <MaterialIcons name="add-location" size={40} color={colors.primary} />
              </View>
              <Text style={styles.modalTitle}>Add New Report?</Text>
              <Text style={styles.modalText}>
                Would you like to create a new report at this location?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleDismissModal}
                >
                  <Text style={styles.cancelButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton} 
                  onPress={handleCreatePost}
                >
                  <Text style={styles.confirmButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  brandBarTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandBarAccent: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
});
