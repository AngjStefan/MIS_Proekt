import { View, Text, TouchableOpacity } from "react-native";
import { colors, typography, spacing } from "@/theme/tokens";

type MapErrorProps = {
  onRetry: () => void;
};

export const MapError = ({ onRetry }: MapErrorProps) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      backgroundColor: colors.background,
    }}
  >
    <Text
      style={{
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: spacing.md,
        textAlign: "center",
      }}
    >
      Failed to load map
    </Text>
    <Text
      style={{
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: spacing.xl,
        textAlign: "center",
      }}
    >
      Please check your connection and try again.
    </Text>
    <TouchableOpacity
      style={{
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 8,
        backgroundColor: colors.primary,
      }}
      onPress={onRetry}
    >
      <Text style={{ color: colors.white, fontWeight: "500" }}>Retry</Text>
    </TouchableOpacity>
  </View>
);
