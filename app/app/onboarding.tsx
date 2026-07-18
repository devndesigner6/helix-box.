import { useTheme } from "@/contexts/ThemeContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Activity,
  Code2,
  Cpu,
  FolderGit2,
  FolderSearch,
  GitBranch,
  Globe,
  Network,
  QrCode,
  EyeOff,
  Smartphone,
  SquareTerminal,
  Terminal,
  Type,
  Shield,
  Sparkles,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type LucideIcon = React.ComponentType<{
  size: number;
  color: string;
  strokeWidth?: number;
}>;

type Page = {
  id: string;
  Icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  color: string;
};

const PAGES: Page[] = [
  {
    id: "1",
    Icon: Smartphone as LucideIcon,
    label: "Your Mobile IDE",
    title: "Welcome to Lunel",
    description: "Ship from anywhere.",
    color: "#6366f1",
  },
  {
    id: "3",
    Icon: Sparkles as LucideIcon,
    label: "Everything You Need",
    title: "Packed with Tools",
    description: "",
    color: "#8b5cf6",
  },
  {
    id: "4",
    Icon: Smartphone as LucideIcon,
    label: "",
    title: "",
    description: "",
    color: "#6366f1",
  },
  {
    id: "5",
    Icon: Shield as LucideIcon,
    label: "Privacy First",
    title: "End-to-End Encrypted",
    description: "",
    color: "#6366f1",
  },
];

const midW = Math.round(SCREEN_WIDTH * 0.52);
const midH = Math.round(midW * 16 / 9);
const sideW = Math.round(SCREEN_WIDTH * 0.42);
const sideH = Math.round(sideW * 16 / 9);
const sideOffset = Math.round(SCREEN_WIDTH * 0.20);

function WelcomePage() {
  const { colors, fonts, isDark } = useTheme();
  const { t } = useTranslation();
  const anim = useRef(new Animated.Value(0)).current;
  const giftShake = useRef(new Animated.Value(0)).current;

  // Entrance animations
  const openSourceEntrance = useRef(new Animated.Value(0)).current;
  const imageEntrance = useRef(new Animated.Value(0)).current;
  const textEntrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.stagger(120, [
      Animated.timing(openSourceEntrance, { toValue: 1, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(imageEntrance, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(textEntrance, { toValue: 1, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();

    // Phone slide loop (starts after entrance)
    Animated.loop(
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(anim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(anim, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Gift shake
    Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(giftShake, { toValue: 1,  duration: 70, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(giftShake, { toValue: -1, duration: 70, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(giftShake, { toValue: 0,  duration: 70, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const giftRotate = giftShake.interpolate({ inputRange: [-1, 1], outputRange: ["-18deg", "18deg"] });

  const leftRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["-8deg", "0deg"] });
  const rightRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["8deg", "0deg"] });
  const leftX = anim.interpolate({ inputRange: [0, 1], outputRange: [-sideOffset, 0] });
  const rightX = anim.interpolate({ inputRange: [0, 1], outputRange: [sideOffset, 0] });

  const openSourceY = openSourceEntrance.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });
  const imageScale = imageEntrance.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ opacity: openSourceEntrance, transform: [{ translateY: openSourceY }] }}>
        <Pressable
          onPress={() => Linking.openURL("https://github.com/lunel-dev/lunel")}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.bg.raised, marginBottom: 32, opacity: pressed ? 0.6 : 1, borderWidth: 0.5, borderColor: colors.border.main })}
        >
          <FontAwesome name="github" size={14} color={colors.fg.default} />
          <Text style={{ fontSize: 12, fontFamily: fonts.sans.medium, color: colors.fg.default }}>{t('onboarding.openSource')}</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={{ width: SCREEN_WIDTH, height: midH, alignItems: "center", justifyContent: "center", overflow: "visible", opacity: imageEntrance, transform: [{ scale: imageScale }] }}>
        <Animated.Image
          source={isDark ? require("@/assets/images/onboarding/1/right-dark.png") : require("@/assets/images/onboarding/1/right.png")}
          style={{ position: "absolute", width: sideW, height: sideH, transform: [{ translateX: leftX }, { translateY: 16 }, { rotate: leftRotate }] }}
          resizeMode="contain"
        />
        <Animated.Image
          source={isDark ? require("@/assets/images/onboarding/1/left-dark.png") : require("@/assets/images/onboarding/1/left.png")}
          style={{ position: "absolute", width: sideW, height: sideH, transform: [{ translateX: rightX }, { translateY: 16 }, { rotate: rightRotate }] }}
          resizeMode="contain"
        />
        <Image
          source={isDark ? require("@/assets/images/onboarding/1/middle-dark.png") : require("@/assets/images/onboarding/1/middle.png")}
          style={{ position: "absolute", width: midW, height: midH }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={{ alignItems: "center", paddingHorizontal: 32, gap: 10, marginTop: 24, opacity: textEntrance }}>
        <Text style={{ fontSize: 25, fontFamily: fonts.sans.semibold, color: colors.fg.default, textAlign: "center", lineHeight: 32 }}>
          {t('onboarding.welcome')}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: fonts.sans.regular, color: colors.fg.muted, textAlign: "center", lineHeight: 22, maxWidth: 280, marginTop: -3 }}>
          {t('onboarding.description')}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.bg.raised }}>
            <MaterialCommunityIcons name="shield-lock" size={14} color={colors.fg.default} />
            <Text style={{ fontSize: 12, fontFamily: fonts.sans.medium, color: colors.fg.default }}>{t('onboarding.endToEndEncryption')}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.bg.raised, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
            <Animated.View style={{ transform: [{ rotate: giftRotate }] }}>
              <Ionicons name="gift" size={14} color={colors.fg.default} />
            </Animated.View>
            <Text style={{ fontSize: 12, fontFamily: fonts.sans.semibold, color: colors.fg.default }}>{t('onboarding.free')}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

type Feature = {
  nameKey: string;
  descKey: string;
  Icon: LucideIcon;
  color: string;
};

const FEATURES: Feature[] = [
  { nameKey: "onboarding.featureAiAgents", descKey: "onboarding.featureAiAgentsDesc", Icon: Sparkles, color: "#8b5cf6" },
  { nameKey: "onboarding.featureBrowser", descKey: "onboarding.featureBrowserDesc", Icon: Globe, color: "#06b6d4" },
  { nameKey: "onboarding.featureCodeEditor", descKey: "onboarding.featureCodeEditorDesc", Icon: Code2, color: "#6366f1" },
  { nameKey: "onboarding.featureFileExplorer", descKey: "onboarding.featureFileExplorerDesc", Icon: FolderSearch, color: "#f59e0b" },
  { nameKey: "onboarding.featureTerminal", descKey: "onboarding.featureTerminalDesc", Icon: SquareTerminal, color: "#10b981" },
  { nameKey: "onboarding.featureGit", descKey: "onboarding.featureGitDesc", Icon: GitBranch, color: "#ef4444" },
  { nameKey: "onboarding.featureProcessManager", descKey: "onboarding.featureProcessManagerDesc", Icon: Cpu, color: "#f97316" },
  { nameKey: "onboarding.featurePortManager", descKey: "onboarding.featurePortManagerDesc", Icon: Network, color: "#3b82f6" },
  { nameKey: "onboarding.featureApiTesting", descKey: "onboarding.featureApiTestingDesc", Icon: Shield, color: "#a855f7" },
  { nameKey: "onboarding.featureTextTools", descKey: "onboarding.featureTextToolsDesc", Icon: Type, color: "#14b8a6" },
  { nameKey: "onboarding.featureResourceMonitor", descKey: "onboarding.featureResourceMonitorDesc", Icon: Activity, color: "#ec4899" },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: colors.bg.raised, borderRadius: 14, padding: 12 }}>
      {/* Icon + name row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: feature.color + "18",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <feature.Icon size={18} color={feature.color} strokeWidth={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontFamily: fonts.sans.semibold, color: colors.fg.default, lineHeight: 19 }}>
            {t(feature.nameKey)}
          </Text>
          <Text style={{ fontSize: 11.5, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 15, marginTop: 1 }}>
            {t(feature.descKey)}
          </Text>
        </View>
      </View>

    </View>
  );
}

function FeaturesPage() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 35, paddingHorizontal: 24, marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: fonts.sans.semibold, color: colors.fg.default, lineHeight: 30, marginBottom: 6 }}>
            {t('onboarding.whatInside')}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 22, marginBottom: 16 }}>
            {t('onboarding.completeDev')}
          </Text>
        </View>

        {/* Feature cards */}
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.name} feature={f} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom fade mask */}
      <LinearGradient
        colors={[colors.bg.base + "00", colors.bg.base]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, pointerEvents: "none" }}
      />
    </View>
  );
}

function CopyableCommand({ command, fonts, colors }: { command: string; fonts: ReturnType<typeof useTheme>["fonts"]; colors: ReturnType<typeof useTheme>["colors"] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const Clipboard = await import("expo-clipboard");
    await Clipboard.setStringAsync(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <View style={{ backgroundColor: colors.bg.raised, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Terminal size={14} color={colors.fg.muted} strokeWidth={2} />
      <Text style={{ fontFamily: fonts.mono.regular, fontSize: 12, color: colors.fg.default, flex: 1 }}>
        {command}
      </Text>
      <Pressable onPress={handleCopy} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
        {copied
          ? <Ionicons name="checkmark" size={14} color={colors.fg.muted} />
          : <Ionicons name="copy-outline" size={14} color={colors.fg.muted} />
        }
      </Pressable>
    </View>
  );
}

const ENCRYPTION_POINTS = [
  { icon: Shield, labelKey: "onboarding.endToEndSessions", subKey: "onboarding.encryptedBetween", color: "#5b6df8" },
  { icon: QrCode, labelKey: "onboarding.localPairing", subKey: "onboarding.oneTimeQr", color: "#06b6d4" },
  { icon: EyeOff, labelKey: "onboarding.noTracking", subKey: "onboarding.noAnalytics", color: "#10b981" },
  { icon: GitBranch, labelKey: "onboarding.openSourceImpl", subKey: "onboarding.checkCode", color: "#f59e0b" },
];

function EncryptionPage() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 90 }}>
        <View style={{ paddingTop: 36, marginBottom: 22 }}>
          <View style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.bg.raised, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 }}>
            <Shield size={13} color={colors.fg.default} strokeWidth={2.1} />
            <Text style={{ fontSize: 11.5, fontFamily: fonts.sans.semibold, color: colors.fg.default, letterSpacing: 0.2 }}>
              {t('onboarding.privacyFirst')}
            </Text>
          </View>

          <Text style={{ fontSize: 27, fontFamily: fonts.sans.semibold, color: colors.fg.default, lineHeight: 34, marginTop: 14, marginBottom: 7 }}>
            {t('onboarding.securityInvisible')}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 22, maxWidth: 300 }}>
            {t('onboarding.keepPrivate')}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.bg.raised, borderRadius: 16, overflow: "hidden" }}>
          {ENCRYPTION_POINTS.map((point, index) => (
            <View
              key={point.label}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 13,
                borderBottomWidth: index === ENCRYPTION_POINTS.length - 1 ? 0 : 1,
                borderBottomColor: colors.bg.base,
              }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: point.color + "18", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <point.icon size={16} color={point.color} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, paddingTop: 1 }}>
                <Text style={{ fontSize: 13.8, fontFamily: fonts.sans.semibold, color: colors.fg.default, marginBottom: 3 }}>
                  {t(point.labelKey)}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 18 }}>
                  {t(point.subKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => Linking.openURL("https://github.com/lunel-dev/lunel")}
          style={({ pressed }) => ({
            marginTop: 16,
            backgroundColor: colors.bg.raised,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
            <FontAwesome name="github" size={15} color={colors.fg.default} />
            <Text style={{ fontSize: 12.8, fontFamily: fonts.sans.medium, color: colors.fg.default }}>
              {t('onboarding.reviewGithub')}
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={14} color={colors.fg.muted} />
        </Pressable>
      </ScrollView>

      <LinearGradient
        colors={[colors.bg.base + "00", colors.bg.base]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, pointerEvents: "none" }}
      />
    </View>
  );
}

const GLAZE_POINTS = [
  { icon: "github" as const, labelKey: "onboarding.openSourceLabel", subKey: "onboarding.builtInPublic" },
  { icon: "shield-lock" as const, labelKey: "onboarding.endToEndEncryptedLabel", subKey: "onboarding.codeNeverTouches" },
  { icon: "gift" as const, labelKey: "onboarding.foreverFree", subKey: "onboarding.lunelConnect" },
  { icon: "earth" as const, labelKey: "onboarding.worksAnyStack", subKey: "onboarding.nextJsNode" },
];

const REVIEWS = [
  { name: "nafderlin", titleKey: "onboarding.review1Title", textKey: "onboarding.review1Text", stars: 5 },
  { name: "kenny", titleKey: "onboarding.review2Title", textKey: "onboarding.review2Text", stars: 5 },
  { name: "max", titleKey: "onboarding.review3Title", textKey: "onboarding.review3Text", stars: 5 },
];

function StarRow({ count, colors }: { count: number; colors: ReturnType<typeof useTheme>["colors"] }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Ionicons key={i} name="star" size={14} color="#f59e0b" />
      ))}
    </View>
  );
}

function GlazePage() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 90 }}>
        <View style={{ paddingTop: 35, marginBottom: 28 }}>
          <Text style={{ fontSize: 24, fontFamily: fonts.sans.semibold, color: colors.fg.default, lineHeight: 30, marginBottom: 6 }}>
            {t('onboarding.builtDifferent')}
          </Text>
          <Text style={{ fontSize: 14, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 22 }}>
            {t('onboarding.thingsWorth')}
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 28 }}>
          {GLAZE_POINTS.map((point) => (
            <View key={point.label} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bg.raised, alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {point.icon === "github"
                  ? <FontAwesome name="github" size={16} color={colors.fg.default} />
                  : point.icon === "shield-lock"
                  ? <MaterialCommunityIcons name="shield-lock" size={16} color={colors.fg.default} />
                  : point.icon === "gift"
                  ? <Ionicons name="gift" size={16} color={colors.fg.default} />
                  : <Ionicons name="earth" size={16} color={colors.fg.default} />
                }
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.sans.semibold, color: colors.fg.default, marginBottom: 1 }}>
                  {t(point.labelKey)}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 18 }}>
                  {t(point.subKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <Text style={{ fontSize: 14, fontFamily: fonts.sans.medium, color: colors.fg.default, marginBottom: 14 }}>
          {t('onboarding.whatPeopleSay')}
        </Text>
        <View style={{ gap: 8 }}>
          {REVIEWS.map((r) => (
            <View key={r.name} style={{ backgroundColor: colors.bg.raised, borderRadius: 14, padding: 14, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <StarRow count={r.stars} colors={colors} />
                <Text style={{ fontSize: 11, fontFamily: fonts.sans.regular, color: colors.fg.muted }}>{r.name}</Text>
              </View>
              <Text style={{ fontSize: 13, fontFamily: fonts.sans.semibold, color: colors.fg.default, lineHeight: 18 }}>
                {t(r.titleKey)}
              </Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 18 }}>
                {t(r.textKey)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 13, fontFamily: fonts.sans.regular, color: colors.fg.muted, lineHeight: 20 }}>
            {t('onboarding.leaveReviewPrompt')}
          </Text>
        </View>
      </ScrollView>

      <LinearGradient
        colors={[colors.bg.base + "00", colors.bg.base]}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, pointerEvents: "none" }}
      />
    </View>
  );
}

function OnboardingPage({ page }: { page: Page }) {
  const { colors, fonts } = useTheme();
  const { Icon } = page;

  if (page.id === "1") {
    return <WelcomePage />;
  }

  if (page.id === "3") {
    return <FeaturesPage />;
  }

  if (page.id === "4") {
    return <GlazePage />;
  }

  if (page.id === "5") {
    return <EncryptionPage />;
  }

  return (
    <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View
          style={{
            width: 176,
            height: 176,
            borderRadius: 88,
            backgroundColor: page.color + "14",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 52,
          }}
        >
          <View
            style={{
              width: 116,
              height: 116,
              borderRadius: 58,
              backgroundColor: page.color + "22",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={50} color={page.color} strokeWidth={1.5} />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 36, paddingBottom: 28, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: fonts.sans.semibold,
            color: page.color,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          {page.label}
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontFamily: fonts.sans.semibold,
            color: colors.fg.default,
            textAlign: "center",
            marginBottom: 16,
            lineHeight: 36,
          }}
        >
          {page.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontFamily: fonts.sans.regular,
            color: colors.fg.muted,
            textAlign: "center",
            lineHeight: 24,
            maxWidth: 296,
          }}
        >
          {page.description}
        </Text>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { colors, fonts } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dotAnims = useRef(PAGES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;
  const skipAnim = useRef(new Animated.Value(0)).current;
  const bottomEntrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bottomEntrance, {
      toValue: 1,
      duration: 450,
      delay: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const isLastPage = currentIndex === PAGES.length - 1;
  const isReviewPage = currentIndex === 2;
  const showReviewButton = isReviewPage && Platform.OS === "ios";

  useEffect(() => {
    PAGES.forEach((_, i) => {
      Animated.spring(dotAnims[i], {
        toValue: i === currentIndex ? 1 : 0,
        useNativeDriver: false,
        speed: 20,
        bounciness: 4,
      }).start();
    });
  }, [currentIndex]);

  useEffect(() => {
    Animated.timing(skipAnim, {
      toValue: showReviewButton ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [showReviewButton]);
  const IOS_REVIEW_URL = "https://apps.apple.com/app/apple-store/id6759504065?action=write-review";

  const handleComplete = async () => {
    await AsyncStorage.setItem("@lunel_onboarding_done", "true");
    router.replace("/auth");
  };

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  };

  const handleNext = () => {
    if (!isLastPage) {
      goNext();
    } else {
      handleComplete();
    }
  };

  const handleReview = () => {
    Linking.openURL(IOS_REVIEW_URL);
    goNext();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base, paddingTop: insets.top }}>

      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={({ item }) => <OnboardingPage page={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
      />

      <Animated.View
        style={{
          paddingHorizontal: 24,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 8,
          marginBottom: 24,
          gap: 16,
          opacity: bottomEntrance,
          transform: [{ translateY: bottomEntrance.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
        }}
      >
        {/* Dot indicators */}
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, height: 8, marginBottom: 8 }}>
          {PAGES.map((_, i) => {
            const width = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [6, 22] });
            const bg = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [colors.fg.default + "1a", colors.accent.default] });
            return (
              <Animated.View
                key={i}
                style={{ width, height: 6, borderRadius: 3, backgroundColor: bg }}
              />
            );
          })}
        </View>

        <Pressable
          onPress={showReviewButton ? handleReview : handleNext}
          style={({ pressed }) => ({
            backgroundColor: colors.accent.default,
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            opacity: pressed ? 0.82 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontFamily: fonts.sans.semibold, color: "#ffffff", letterSpacing: 0.3 }}>
            {showReviewButton ? t('onboarding.leaveReview') : isLastPage ? t('onboarding.getStarted') : t('onboarding.continueBtn')}
          </Text>
        </Pressable>

        <Animated.View style={{
          maxHeight: skipAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 36] }),
          opacity: skipAnim,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Text style={{ fontSize: 13, fontFamily: fonts.sans.medium, color: colors.fg.muted }}>{t('onboarding.skip')}</Text>
          </Pressable>
        </Animated.View>

      </Animated.View>

    </View>
  );
}
