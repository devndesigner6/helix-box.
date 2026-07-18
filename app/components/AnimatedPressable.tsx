import React, { useCallback } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPress = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 400,
  mass: 0.6,
};

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  haptic?: boolean | Haptics.ImpactFeedbackStyle;
  children: React.ReactNode;
}

export default function AnimatedPressable({
  style,
  scaleValue = 0.97,
  haptic = false,
  onPress,
  children,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, SPRING_CONFIG);
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const handlePress = useCallback((e: any) => {
    if (haptic) {
      const style = typeof haptic === 'boolean'
        ? Haptics.ImpactFeedbackStyle.Light
        : haptic;
      Haptics.impactAsync(style);
    }
    onPress?.(e);
  }, [haptic, onPress]);

  return (
    <AnimatedPress
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPress>
  );
}
