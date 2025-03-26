import { ActivityIndicator, View } from "react-native";
import { useTheme } from '@/context/ThemeProvider'; 

export function Loader() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <ActivityIndicator size="large" color={theme.secondary} />
    </View>
  );
}
