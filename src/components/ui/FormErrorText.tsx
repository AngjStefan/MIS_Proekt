import { Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme/tokens';

interface FormErrorTextProps {
  message: string;
}

export function FormErrorText({ message }: FormErrorTextProps) {
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    ...typography.bodySmall,
    color: colors.error,
    backgroundColor: colors.errorMuted,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
