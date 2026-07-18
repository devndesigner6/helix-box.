import { useTheme } from "@/contexts/ThemeContext";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { fonts } = useTheme();
  const { t } = useTranslation();
  const handleVersionPress = () => {
    Linking.openURL("https://github.com/lunel-dev");
  };

  const handleSupportPress = () => {
    Linking.openURL("");
  };

  const handleContactPress = () => {
    Linking.openURL("");
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={handleVersionPress}>
        <Text style={[styles.footerText, { fontFamily: fonts.sans.regular }]}>{t('footer.version')}</Text>
      </TouchableOpacity>
      <Text style={[styles.footerDivider, { fontFamily: fonts.sans.regular }]}> · </Text>
      <TouchableOpacity onPress={handleSupportPress}>
        <Text style={[styles.footerText, { fontFamily: fonts.sans.regular }]}>{t('footer.support')}</Text>
      </TouchableOpacity>
      <Text style={[styles.footerDivider, { fontFamily: fonts.sans.regular }]}> · </Text>
      <TouchableOpacity onPress={handleContactPress}>
        <Text style={[styles.footerText, { fontFamily: fonts.sans.regular }]}>{t('footer.contact')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#6b7280",
    fontSize: 12,
  },
  footerDivider: {
    color: "#6b7280",
    fontSize: 13,
  },
});
