import { View, Text } from "react-native";
import { colors } from "@/theme/tokens";

export const MapOverlay = () => (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: 48,
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: "rgba(24, 24, 27, 0.75)",
      zIndex: 10,
    }}
  >
    <Text
      style={{
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
      }}
    >
      RiskIntelligence
    </Text>
  </View>
);
