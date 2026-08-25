import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const COLOR_MODES = [
  { key: "", label: "Normal", color: "#27e4cf" },
  { key: "theme-protanopia", label: "Protanopia", color: "#0072B2" },
  { key: "theme-deuteranopia", label: "Deuteranopia", color: "#E69F00" },
  { key: "theme-tritanopia", label: "Tritanopia", color: "#D55E00" },
];

const TEXT_SIZES = [
  { value: 1, label: "Base", preview: "Aa" },
  { value: 1.15, label: "LG", preview: "Aa" },
  { value: 1.3, label: "XL", preview: "Aa" },
];

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const {
    darkMode,
    toggleDarkMode,
    accessibilityTheme,
    changeAccessibilityTheme,
    fontScale,
    changeFontScale,
    resetAccessibility,
    currentColors,
  } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: currentColors.bgCard,
            borderColor: currentColors.accent,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("settings.accessibilityMenu")}
        onPress={() => setOpen(true)}
      >
        <Ionicons
          name="accessibility-outline"
          size={27}
          color={currentColors.accent}
        />
      </TouchableOpacity>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor: currentColors.bgBody,
                borderColor: currentColors.accent,
              },
            ]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: currentColors.accent }]}>
                {t("settings.accessibilityMenu").toUpperCase()}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t("common.cancel")}
                onPress={() => setOpen(false)}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={currentColors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentColors.textMuted, fontSize: 14 * fontScale },
                ]}
              >
                {t("settings.textSize")}
              </Text>
              <View style={styles.textSizeRow}>
                {TEXT_SIZES.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: fontScale === item.value }}
                    style={[
                      styles.textSizeOption,
                      {
                        backgroundColor:
                          fontScale === item.value
                            ? currentColors.accentDim
                            : currentColors.bgCard,
                        borderColor:
                          fontScale === item.value
                            ? currentColors.accent
                            : currentColors.borderColor,
                      },
                    ]}
                    onPress={() => changeFontScale(item.value)}
                  >
                    <Text
                      style={[
                        styles.preview,
                        {
                          color:
                            fontScale === item.value
                              ? currentColors.accent
                              : currentColors.textSecondary,
                          fontSize: 20 * item.value,
                        },
                      ]}
                    >
                      {item.preview}
                    </Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color:
                            fontScale === item.value
                              ? currentColors.accent
                              : currentColors.textSecondary,
                          fontSize: 12 * fontScale,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentColors.textMuted, fontSize: 14 * fontScale },
                ]}
              >
                {t("settings.colorMode")}
              </Text>
              <View style={styles.modeRow}>
                <ModeButton
                  label={t("settings.light")}
                  active={!darkMode}
                  currentColors={currentColors}
                  fontScale={fontScale}
                  onPress={() => toggleDarkMode(false)}
                />
                <ModeButton
                  label={t("settings.dark")}
                  active={darkMode}
                  currentColors={currentColors}
                  fontScale={fontScale}
                  onPress={() => toggleDarkMode(true)}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentColors.textMuted, fontSize: 14 * fontScale },
                ]}
              >
                {t("settings.colorVision")}
              </Text>
              {COLOR_MODES.map((mode) => {
                const active = accessibilityTheme === mode.key;
                return (
                  <TouchableOpacity
                    key={mode.key}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: active
                          ? currentColors.accentDim
                          : currentColors.bgCard,
                        borderColor: active
                          ? currentColors.accent
                          : currentColors.borderColor,
                      },
                    ]}
                    onPress={() => changeAccessibilityTheme(mode.key)}
                  >
                    <View
                      style={[styles.colorDot, { backgroundColor: mode.color }]}
                    />
                    <Text
                      style={[
                        styles.colorLabel,
                        {
                          color: active
                            ? currentColors.textPrimary
                            : currentColors.textSecondary,
                          fontSize: 16 * fontScale,
                        },
                      ]}
                    >
                      {mode.label}
                    </Text>
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={22}
                        color={currentColors.accent}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.reset,
                { borderTopColor: currentColors.borderColor },
              ]}
              onPress={resetAccessibility}
              accessibilityRole="button"
            >
              <Ionicons
                name="refresh"
                size={18}
                color={currentColors.textMuted}
              />
              <Text
                style={[
                  styles.resetText,
                  { color: currentColors.textMuted, fontSize: 15 * fontScale },
                ]}
              >
                {t("settings.resetAccessibility")}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ModeButton({ label, active, currentColors, fontScale, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.modeButton,
        {
          backgroundColor: active
            ? currentColors.accentDim
            : currentColors.bgCard,
          borderColor: active
            ? currentColors.accent
            : currentColors.borderColor,
        },
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[
          styles.modeLabel,
          {
            color: active ? currentColors.accent : currentColors.textSecondary,
            fontSize: 16 * fontScale,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 18,
    bottom: 108,
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.58)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  menu: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 12,
  },
  header: {
    height: 64,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.16)",
  },
  title: { fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  section: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.12)",
  },
  sectionTitle: { fontSize: 14, fontWeight: "800", marginBottom: 12 },
  textSizeRow: { flexDirection: "row", gap: 10 },
  textSizeOption: {
    flex: 1,
    minHeight: 70,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: { fontWeight: "800", lineHeight: 25 },
  optionLabel: { fontSize: 12, fontWeight: "800", marginTop: 2 },
  modeRow: { flexDirection: "row", gap: 10 },
  modeButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modeLabel: { fontSize: 16, fontWeight: "800" },
  colorOption: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: { width: 17, height: 17, borderRadius: 9, marginRight: 12 },
  colorLabel: { flex: 1, fontSize: 16, fontWeight: "800" },
  reset: {
    height: 54,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  resetText: { fontSize: 15, fontWeight: "800" },
});
