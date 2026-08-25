import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";

export default function ChangePasswordScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme();
  const { t } = useLanguage();
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.current) newErrors.current = t("auth.required");
    if (!form.new) newErrors.new = t("auth.required");
    if (form.new !== form.confirm) newErrors.confirm = t("auth.noMatch");
    setErrors(newErrors);
    if (!Object.keys(newErrors).length) {
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

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
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.textPrimary }]}>
            {t("auth.changePasswordTitle")}
          </Text>
          <Ionicons
            name="lock-closed-outline"
            size={50}
            color={currentColors.accent}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: currentColors.textSecondary }]}>
            {t("auth.currentPasswordLabel")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentColors.bgInput,
                borderColor: currentColors.borderColor,
                color: currentColors.textPrimary,
              },
            ]}
            placeholder={t("auth.passwordPlaceholder")}
            placeholderTextColor={currentColors.textMuted}
            value={form.current}
            onChangeText={(v) => setForm({ ...form, current: v })}
            secureTextEntry
          />
          {errors.current && <Text style={styles.error}>{errors.current}</Text>}
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: currentColors.textSecondary }]}>
            {t("auth.newPasswordLabel")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentColors.bgInput,
                borderColor: currentColors.borderColor,
                color: currentColors.textPrimary,
              },
            ]}
            placeholder={t("auth.passwordPlaceholder")}
            placeholderTextColor={currentColors.textMuted}
            value={form.new}
            onChangeText={(v) => setForm({ ...form, new: v })}
            secureTextEntry
          />
          {errors.new && <Text style={styles.error}>{errors.new}</Text>}
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: currentColors.textSecondary }]}>
            {t("auth.confirmNewPasswordLabel")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: currentColors.bgInput,
                borderColor: currentColors.borderColor,
                color: currentColors.textPrimary,
              },
            ]}
            placeholder={t("auth.passwordPlaceholder")}
            placeholderTextColor={currentColors.textMuted}
            value={form.confirm}
            onChangeText={(v) => setForm({ ...form, confirm: v })}
            secureTextEntry
          />
          {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}
        </View>
        {success && (
          <View
            style={[
              styles.successBox,
              { backgroundColor: currentColors.accentDim },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={currentColors.accent}
            />
            <Text
              style={[styles.successText, { color: currentColors.textPrimary }]}
            >
              {t("auth.passwordSuccess")}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: currentColors.accent }]}
          onPress={validate}
        >
          <Text style={[styles.submitBtnText, { color: currentColors.bgBody }]}>
            {t("auth.saveChangesBtn")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: "bold" },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successText: { flex: 1, fontSize: 14, fontWeight: "500" },
  submitBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitBtnText: { fontSize: 16, fontWeight: "bold" },
});
