import { useTheme } from "@/contexts/ThemeContext";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: "success" | "error";
  duration?: number;
}

export default function Toast({
  message,
  visible,
  onHide,
  type = "error",
  duration = 3500,
}: ToastProps) {
  const { fonts } = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) runOnJS(onHide)();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const isSuccess = type === "success";
  const iconColor = isSuccess ? "#4ade80" : "#f87171";

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {isSuccess
        ? <CheckCircle2 size={15} color={iconColor} strokeWidth={2} />
        : <AlertCircle size={15} color={iconColor} strokeWidth={2} />
      }
      <Text style={[styles.message, { fontFamily: fonts.sans.regular }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "10%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(20,20,20,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    zIndex: 999,
    maxWidth: "80%",
  },
  message: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
    flexShrink: 1,
  },
});
