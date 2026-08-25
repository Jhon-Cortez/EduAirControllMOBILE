import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import AccessibilityMenu from "../../components/AccessibilityMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REMEMBERED_EMAIL_KEY = "rememberedLoginEmail";

export default function LoginScreen({ navigation }) {
  const { currentColors, darkMode, fontScale } = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const rememberedEmail =
          await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (rememberedEmail) {
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.warn("Error loading remembered email:", error);
      }
    };

    loadRememberedEmail();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(t("auth.validationTitle"), t("auth.requiredLogin"));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert(t("auth.validationTitle"), t("auth.invalidEmail"));
      return;
    }
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(
          REMEMBERED_EMAIL_KEY,
          email.trim().toLowerCase(),
        );
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch (error) {
      console.warn("Error saving login preference:", error);
    }

    navigation.navigate("App");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.bgBody }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={currentColors.bgBody}
      />
      <AccessibilityMenu />
      <ScrollView contentContainerStyle={styles.scroll}>
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
            style={styles.landingBackButton}
            onPress={() => navigation.navigate("Landing")}
            accessibilityRole="button"
            accessibilityLabel={t("landing.home")}
          >
            <Ionicons
              name="arrow-back"
              size={18}
              color={currentColors.accent}
            />
            <Text
              style={{
                color: currentColors.accent,
                fontWeight: "700",
                fontSize: 14 * fontScale,
              }}
            >
              {t("landing.home")}
            </Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentColors.textPrimary }]}>
              {t("auth.loginTitle")}
            </Text>
            <Ionicons
              name="person-circle-outline"
              size={50}
              color={currentColors.accent}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: currentColors.textSecondary }]}
            >
              {t("auth.emailLabel")}
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
              placeholder={t("auth.emailPlaceholder")}
              placeholderTextColor={currentColors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: currentColors.textSecondary }]}
            >
              {t("auth.passwordLabel")}
            </Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                    backgroundColor: currentColors.bgInput,
                    borderColor: currentColors.borderColor,
                    color: currentColors.textPrimary,
                  },
                ]}
                placeholder={t("auth.passwordPlaceholder")}
                placeholderTextColor={currentColors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={currentColors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: rememberMe }}
          >
            <View
              style={[
                styles.checkbox,
                rememberMe && {
                  backgroundColor: currentColors.accent,
                  borderColor: currentColors.accent,
                },
              ]}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text
              style={[
                styles.rememberText,
                { color: currentColors.textSecondary },
              ]}
            >
              {t("auth.rememberMe")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.forgotBtn,
              { borderBottomColor: currentColors.borderColor },
            ]}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={{ color: currentColors.accent }}>
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: currentColors.accent }]}
            onPress={handleLogin}
          >
            <Text
              style={[styles.loginBtnText, { color: currentColors.bgBody }]}
            >
              {t("auth.loginBtn")}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View
              style={[
                styles.line,
                { backgroundColor: currentColors.borderColor },
              ]}
            />
            <Text
              style={[styles.dividerText, { color: currentColors.textMuted }]}
            >
              {t("auth.orContinueWith")}
            </Text>
            <View
              style={[
                styles.line,
                { backgroundColor: currentColors.borderColor },
              ]}
            />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: currentColors.bgInput,
                  borderColor: currentColors.borderColor,
                },
              ]}
              onPress={() => navigation.navigate("GoogleSignUp")}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text
                style={[
                  styles.socialBtnText,
                  { color: currentColors.textPrimary },
                ]}
              >
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: currentColors.bgInput,
                  borderColor: currentColors.borderColor,
                },
              ]}
              onPress={() => navigation.navigate("FacebookSignUp")}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text
                style={[
                  styles.socialBtnText,
                  { color: currentColors.textPrimary },
                ]}
              >
                Facebook
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text
              style={[
                styles.signupText,
                { color: currentColors.textSecondary },
              ]}
            >
              {t("auth.noAccount")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: currentColors.accent, fontWeight: "600" }}>
                {t("auth.signupLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
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
  landingBackButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    marginBottom: 14,
  },
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
  passwordRow: { flexDirection: "row", alignItems: "center" },
  eyeBtn: { position: "absolute", right: 12, padding: 4 },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: { fontSize: 13, fontWeight: "bold" },
  forgotBtn: { fontWeight: "bold", marginBottom: 20 },
  loginBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  loginBtnText: { fontSize: 16, fontWeight: "bold" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: "bold" },
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
  },
  socialBtnText: { fontSize: 14, fontWeight: "bold" },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  signupText: { alignSelf: "center", fontSize: 14, fontWeight: "bold" },
});
