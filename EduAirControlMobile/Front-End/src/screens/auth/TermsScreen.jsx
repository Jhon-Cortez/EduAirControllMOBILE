import { useState } from "react";
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
import AccessibilityMenu from "../../components/AccessibilityMenu";

export default function TermsScreen({ navigation }) {
  const { currentColors, darkMode, fontScale } = useTheme();
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState(1);
  const sections = Array.from({ length: 8 }, (_, index) => index + 1);

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
      <AccessibilityMenu />
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
        <View style={styles.sectionsList}>
          {sections.map((section) => {
            const expanded = expandedSection === section;
            return (
              <View
                key={section}
                style={[
                  styles.sectionItem,
                  { borderColor: currentColors.borderColor },
                ]}
              >
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setExpandedSection(expanded ? null : section)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                >
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: expanded
                          ? currentColors.accent
                          : currentColors.textPrimary,
                        fontSize: 15 * fontScale,
                      },
                    ]}
                  >
                    {t(`auth.termsSection${section}`)}
                  </Text>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={19}
                    color={
                      expanded ? currentColors.accent : currentColors.textMuted
                    }
                  />
                </TouchableOpacity>
                {expanded && (
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        color: currentColors.textSecondary,
                        fontSize: 14 * fontScale,
                      },
                    ]}
                  >
                    {t(`auth.termsText${section}`)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
        <Text
          style={[
            styles.updated,
            { color: currentColors.textMuted, fontSize: 12 * fontScale },
          ]}
        >
          {t("auth.termsUpdated")}
        </Text>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: currentColors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.acceptBtnText,
              { color: currentColors.bgBody, fontSize: 16 * fontScale },
            ]}
          >
            {t("auth.acceptBtn")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, paddingTop: 50, paddingBottom: 20 },
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
    flex: 1,
  },
  sectionText: { fontSize: 14, lineHeight: 22, flexWrap: "wrap" },
  sectionsList: { gap: 10 },
  sectionItem: { borderWidth: 1, borderRadius: 12, padding: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  updated: { marginTop: 22, lineHeight: 18 },
  acceptBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 30,
  },
  acceptBtnText: { fontSize: 16, fontWeight: "bold" },
});
