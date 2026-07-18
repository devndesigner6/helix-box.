import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ThemeColors, radius } from '@/constants/themes';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedTabProps {
  id: string;
  title: string;
  isActive: boolean;
  isLast: boolean;
  showDivider: boolean;
  targetWidth: number;
  icon?: React.ReactNode;
  iconColor?: string;
  colors: ThemeColors;
  onPress: () => void;
  onClose: () => void;
  isNew?: boolean;
  isClosing?: boolean;
  renderIcon?: () => React.ReactNode;
}

const springConfig = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

export default function AnimatedTab({
  id,
  title,
  isActive,
  isLast,
  showDivider,
  targetWidth,
  icon,
  iconColor,
  colors,
  onPress,
  onClose,
  isNew = false,
  isClosing = false,
  renderIcon,
}: AnimatedTabProps) {
  const width = useSharedValue(isNew ? 0 : targetWidth);
  const opacity = useSharedValue(isNew ? 0 : 1);
  const scale = useSharedValue(1);

  // Animate width changes
  useEffect(() => {
    if (!isClosing) {
      width.value = withSpring(targetWidth, springConfig);
      opacity.value = withSpring(1, springConfig);
    }
  }, [targetWidth, isClosing]);

  // Handle closing animation
  useEffect(() => {
    if (isClosing) {
      width.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [isClosing]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    // Fade content based on width
    const contentOpacity = interpolate(
      width.value,
      [0, targetWidth * 0.5, targetWidth],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: contentOpacity,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[
        styles.tab,
        animatedContainerStyle,
        {
          backgroundColor: isActive ? colors.bg.raised : 'transparent',
          marginRight: isLast ? 0 : 2,
        },
      ]}
    >
      {/* Divider - using subtle bg contrast */}
      {showDivider && (
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.bg.raised },
          ]}
        />
      )}

      {/* Tab Content */}
      <Animated.View style={[styles.tabContent, animatedContentStyle]}>
        {/* Icon */}
        {renderIcon ? (
          renderIcon()
        ) : icon ? (
          <View style={styles.tabIcon}>{icon}</View>
        ) : null}

        {/* Title */}
        <Text
          numberOfLines={1}
          style={[
            styles.tabText,
            { color: isActive ? colors.fg.default : colors.fg.muted },
          ]}
        >
          {title}
        </Text>
      </Animated.View>

      {/* Close Button - only on active tab */}
      {isActive && (
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={14} color={colors.fg.default} />
        </TouchableOpacity>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  tab: {
    height: 44,
    borderRadius: radius.md,
    marginBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    right: -2,
    width: 1,
    height: 18,
    top: 13,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 12,
    flex: 1,
  },
  closeButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
