import { LoaderCircle } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface LoadingProps {
  size?: "small" | "large";
  color?: string;
}

export default function Loading({
  size = "large",
  color = "rgba(255,255,255,0.5)",
}: LoadingProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const iconSize = size === "small" ? 20 : 20;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <LoaderCircle size={iconSize} color={color} strokeWidth={2} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
