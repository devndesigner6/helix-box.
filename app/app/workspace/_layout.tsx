import { useTheme } from "@/contexts/ThemeContext";
import DrawerContent from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WorkspaceLayout() {
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: {
            backgroundColor: colors.bg.base,
            width: "80%",
          },
          overlayColor: "rgba(0, 0, 0, 0.5)",
          swipeEnabled: true,
          swipeEdgeWidth: 30,
        }}
      />
    </GestureHandlerRootView>
  );
}
