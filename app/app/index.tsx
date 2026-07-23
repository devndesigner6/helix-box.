import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [target, setTarget] = useState<"/onboarding" | "/auth" | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("@helixbox_onboarding_done"),
      AsyncStorage.getItem("@lunel_onboarding_done"),
    ]).then(([hb, lunel]) => {
      setTarget((hb === "true" || lunel === "true") ? "/auth" : "/onboarding");
    });
  }, []);

  if (!target) return <View style={{ flex: 1 }} />;
  return <Redirect href={target} />;
}
