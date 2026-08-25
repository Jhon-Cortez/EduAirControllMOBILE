import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export default function TermsScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: currentColors.bgBody },
      ]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={currentColors.bgBody}
      />
      <View
        style={[
          styles.card,
          {
            backgroundColor: currentColors.bgCard,
            borderColor: currentColors.accent,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={currentColors.accent} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.textPrimary }]}>
            {t("auth.termsTitle")}
          </Text>
        </View>
        <Text
          style={[styles.sectionTitle, { color: currentColors.textPrimary }]}
        >
          {t("auth.termsSection1")}
        </Text>
        <Text
          style={[styles.sectionText, { color: currentColors.textSecondary }]}
        >
          {t("auth.termsText1")}
        </Text>
        <Text
          style={[styles.sectionTitle, { color: currentColors.textPrimary }]}
        >
          {t("auth.termsSection2")}
        </Text>
        <Text
          style={[styles.sectionText, { color: currentColors.textSecondary }]}
        >
          {t("auth.termsText2")}
        </Text>
        <Text
          style={[styles.sectionTitle, { color: currentColors.textPrimary }]}
        >
          {t("auth.termsSection3")}
        </Text>
        <Text
          style={[styles.sectionText, { color: currentColors.textSecondary }]}
        >
          {t("auth.termsText3")}
        </Text>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: currentColors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.acceptBtnText, { color: currentColors.bgBody }]}>
            {t("auth.acceptBtn")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 20, paddingBottom: 20 },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backBtn: { alignSelf: "flex-start", marginBottom: 10, padding: 4 },
  header: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  sectionText: { fontSize: 14, lineHeight: 22, flexWrap: "wrap" },
  acceptBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  acceptBtnText: { fontSize: 16, fontWeight: "bold" },
});
