import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '@/providers/posts-provider';
import { useAuth } from '@/providers/auth-provider';
import { SEVERITY_LABELS } from '@/types/post';
import { colors, spacing, borderRadius } from '@/theme/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AppTextInput } from '@/components/ui/AppTextInput';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'] as const;

export default function CreatePostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addPost } = usePosts();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [locationLabel, setLocationLabel] = useState('');
  const [latitude, setLatitude] = useState(() => params.latitude ? parseFloat(params.latitude as string) : 41.9981);
  const [longitude, setLongitude] = useState(() => params.longitude ? parseFloat(params.longitude as string) : 21.4254);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle('');
    setDescription('');
    setSeverity('medium');
    setLocationLabel('');
    setImageUri(null);
    setLatitude(params.latitude ? parseFloat(params.latitude as string) : 41.9981);
    setLongitude(params.longitude ? parseFloat(params.longitude as string) : 21.4254);
  }, [params.latitude, params.longitude]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !locationLabel.trim()) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await addPost({
        title: title.trim(),
        description: description.trim(),
        latitude,
        longitude,
        locationLabel: locationLabel.trim(),
        severity,
        imageUri: imageUri ?? undefined,
        authorId: user?.id || 'anonymous',
      });

      setTitle('');
      setDescription('');
      setSeverity('medium');
      setLocationLabel('');
      setImageUri(null);
    } catch (error) {
      console.warn('Failed to create post:', error);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <AppTextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Brief description of the issue"
        />

        <AppTextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Provide more details..."
          multiline
          numberOfLines={4}
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityRow}>
            {SEVERITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.severityButton,
                  severity === option && styles.severityButtonActive,
                ]}
                onPress={() => setSeverity(option)}
              >
                <Text
                  style={[
                    styles.severityButtonText,
                    severity === option && styles.severityButtonTextActive,
                  ]}
                >
                  {SEVERITY_LABELS[option]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <AppTextInput
          label="Location"
          value={locationLabel}
          onChangeText={setLocationLabel}
          placeholder="e.g. City Park, Main Street"
        />

        <View style={styles.coordinatesContainer}>
          <MaterialIcons name="my-location" size={16} color={colors.textMuted} />
          <Text style={styles.coordinatesText}>
            Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
          </Text>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-photo-alternate" size={32} color={colors.textSecondary} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <PrimaryButton
          title="Submit Report"
          onPress={handleSubmit}
          loading={loading}
        />
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
  closeButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  severityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  severityButtonActive: {
    backgroundColor: colors.primary,
  },
  severityButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  severityButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  imagePicker: {
    marginBottom: spacing.lg,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  coordinatesText: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
