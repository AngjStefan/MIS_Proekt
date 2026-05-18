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
      backgroundColor: "rgba(24, 24, 27, 0.85)",
      zIndex: 10,
    }}
  >
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 16,
        right: 16,
        height: 2,
        backgroundColor: colors.accent,
        borderRadius: 1,
      }}
    />
    <Text
      style={{
        color: colors.accent,
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.5,
      }}
    >
      SafeParking
    </Text>
  </View>
);
