import { View, ActivityIndicator } from "react-native";
import { colors } from "@/theme/tokens";

export const MapLoading = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    }}
  >
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);
