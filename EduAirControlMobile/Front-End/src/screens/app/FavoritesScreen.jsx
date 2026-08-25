import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useEnvironments } from "../../context/EnvironmentsContext";
import { useLanguage } from "../../context/LanguageContext";
import NotificationButton from "../../components/NotificationButton";
import { calcEnvironmentScore } from "../../utils/environmentMetrics";

function ScoreRing({ score, color }) {
  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreText, { color }]}>{score}</Text>
    </View>
  );
}

function EnvironmentCard({
  environment,
  rank,
  onPress,
  onRemoveFavorite,
  currentColors,
  t,
}) {
  const statusColor =
    environment.statusKey === "normal"
      ? currentColors.success
      : environment.statusKey === "warning"
        ? currentColors.warning
        : currentColors.error;
  const statusLabel = t(`status.${environment.statusKey}`);
  const score = calcEnvironmentScore(environment);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.rank, { color: currentColors.textMuted }]}>
        #{rank}
      </Text>
      <View
        style={[styles.statusIcon, { backgroundColor: `${statusColor}18` }]}
      >
        <Ionicons name="business-outline" size={18} color={statusColor} />
      </View>
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardName, { color: currentColors.textPrimary }]}
          numberOfLines={1}
        >
          {environment.name}
        </Text>
        <View style={styles.cardMeta}>
          <Ionicons
            name="location-outline"
            size={12}
            color={currentColors.textMuted}
          />
          <Text
            style={[styles.cardMetaTxt, { color: currentColors.textMuted }]}
            numberOfLines={1}
          >
            {environment.location}
          </Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <ScoreRing score={score} color={statusColor} />
      <TouchableOpacity
        onPress={() => onRemoveFavorite(environment)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.heartBtn}
      >
        <Ionicons name="heart" size={44} color={currentColors.favorite} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function FavoritesScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme();
  const { t } = useLanguage();

  const { environments, toggleFavorite } = useEnvironments();
  const [confirmEnv, setConfirmEnv] = useState(null);

  const favorites = environments.filter((e) => e.isFavorite);

  const confirmRemove = () => {
    if (!confirmEnv) return;
    toggleFavorite(confirmEnv.id, false);
    setConfirmEnv(null);
  };

  if (!loaded) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: currentColors.bgBody }]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={currentColors.bgBody}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: currentColors.textMuted }}>{t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: currentColors.bgBody }]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={currentColors.bgBody}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentColors.bgCard,
            borderBottomColor: currentColors.borderColor,
          },
        ]}
      >
        <View style={styles.headerTitle}>
          <Ionicons name="heart" size={35} color={currentColors.favorite} />
          <Text
            style={[styles.headerText, { color: currentColors.textPrimary }]}
          >
            {t("favorites.title")}
          </Text>
        </View>
        <NotificationButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
          {favorites.length === 0
            ? t("favorites.noneYet")
            : t("favorites.saved", {
                count: favorites.length,
                plural: favorites.length > 1 ? "s" : "",
              })}
        </Text>

        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="heart-outline"
              size={64}
              color={currentColors.borderColor}
            />
            <Text
              style={[styles.emptyTitle, { color: currentColors.textPrimary }]}
            >
              {t("favorites.emptyTitle")}
            </Text>
            <Text
              style={[styles.emptyText, { color: currentColors.textMuted }]}
            >
              {t("favorites.emptyText")}
            </Text>
            <TouchableOpacity
              style={[
                styles.goBackBtn,
                {
                  backgroundColor: currentColors.accentDim,
                  borderColor: currentColors.accent,
                },
              ]}
              onPress={() => navigation.getParent()?.navigate("Dashboard")}
            >
              <Text
                style={[styles.goBackText, { color: currentColors.accent }]}
              >
                {t("favorites.goDashboard")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites.map((fav, index) => (
            <EnvironmentCard
              key={fav.id}
              environment={fav}
              rank={index + 1}
              onPress={() =>
                navigation.navigate("EnvironmentDetail", { envId: fav.id })
              }
              onRemoveFavorite={setConfirmEnv}
              currentColors={currentColors}
              t={t}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal
        visible={!!confirmEnv}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmEnv(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: currentColors.bgCard,
                borderColor: currentColors.borderColor,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Ionicons name="heart" size={24} color={currentColors.favorite} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: currentColors.textPrimary },
                ]}
              >
                {t("favorites.removeTitle")}
              </Text>
            </View>
            <Text
              style={[styles.modalText, { color: currentColors.textSecondary }]}
            >
              {t("favorites.removeQuestion", {
                name: confirmEnv?.name || "este ambiente",
              })}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  styles.cancelBtn,
                  { borderColor: currentColors.borderColor },
                ]}
                onPress={() => setConfirmEnv(null)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    { color: currentColors.textSecondary },
                  ]}
                >
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  styles.removeBtn,
                  { backgroundColor: currentColors.error },
                ]}
                onPress={confirmRemove}
              >
                <Text style={styles.removeText}>{t("common.delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f0fafa" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#00b894",
  },
  headerTitle: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  headerText: { fontSize: 20, fontWeight: "bold" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 0,
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rank: { width: 30, fontSize: 13, fontWeight: "800" },
  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: "800", marginBottom: 4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMetaTxt: { fontSize: 11, flexShrink: 1, maxWidth: 110 },
  statusText: { fontSize: 10, fontWeight: "800", marginLeft: 4 },
  scoreRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { fontSize: 12, fontWeight: "900" },
  heartBtn: { marginLeft: 2 },

  empty: {
    alignItems: "center",
    marginTop: 16,
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 17, fontWeight: "bold", color: "#0f172a" },
  emptyText: { fontSize: 13, color: "#999999", textAlign: "center" },

  goBackBtn: {
    marginTop: 12,
    backgroundColor: "rgba(0,184,148,0.1)",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00b894",
  },
  goBackText: { color: "#00b894", fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 17, fontWeight: "800" },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  modalActions: { flexDirection: "row", gap: 10 },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtn: { borderWidth: 1 },
  removeBtn: {},
  cancelText: { fontSize: 14, fontWeight: "700" },
  removeText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
