/**
 * NotificationsScreen — móvil
 * Equivalente a NotificationPanel.jsx de la web.
 * Muestra las notificaciones generadas desde useNotifications.
 */
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../hooks/useNotifications";
import { useLanguage } from "../../context/LanguageContext";

function NotificationItem({ notification, onPress, currentColors, locale }) {
  const config = {
    danger: {
      icon: "alert-circle",
      color: currentColors.error,
      bg: currentColors.errorDim,
    },
    warning: {
      icon: "warning",
      color: currentColors.warning,
      bg: currentColors.warningDim,
    },
    info: {
      icon: "information-circle",
      color: currentColors.info,
      bg: currentColors.accentDim,
    },
  };
  const cfg = config[notification.type] || config.info;
  const timeStr =
    notification.time instanceof Date
      ? notification.time.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: cfg.bg,
          borderColor: cfg.color,
          opacity: notification.read ? 0.62 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!notification.envId}
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + "22" }]}>
        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: currentColors.textPrimary }]}>
          {notification.title}
        </Text>
        <Text
          style={[styles.itemMsg, { color: currentColors.textSecondary }]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
        <Text style={[styles.itemTime, { color: currentColors.textMuted }]}>
          {timeStr}
        </Text>
      </View>
      {notification.envId && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={currentColors.textMuted}
        />
      )}
    </TouchableOpacity>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { language, t } = useLanguage();

  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { key: "all", label: t("notifications.all") },
    { key: "danger", label: t("notifications.alerts") },
    { key: "warning", label: t("notifications.warnings") },
    { key: "info", label: t("notifications.info") },
  ];

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  if (!loaded) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: currentColors.bgBody }]}
      >
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
        <Ionicons name="notifications" size={24} color={currentColors.accent} />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.headerTitle, { color: currentColors.textPrimary }]}
          >
            {t("notifications.title")}
          </Text>
          {unreadCount > 0 && (
            <Text style={[styles.headerSub, { color: currentColors.error }]}>
              {t("notifications.activeAlerts", { count: unreadCount })}
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <View
            style={[styles.badge, { backgroundColor: currentColors.error }]}
          >
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        {unreadCount > 0 && (
          <TouchableOpacity
            accessibilityLabel={t("notifications.markAllRead")}
            onPress={markAllAsRead}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={22}
              color={currentColors.accent}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              { borderColor: currentColors.borderColor },
              filter === f.key && {
                backgroundColor: currentColors.accent,
                borderColor: currentColors.accent,
              },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color:
                    filter === f.key
                      ? currentColors.bgBody
                      : currentColors.textSecondary,
                },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notification list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color={currentColors.accent}
            />
            <Text
              style={[styles.emptyTitle, { color: currentColors.textPrimary }]}
            >
              {t("notifications.emptyTitle")}
            </Text>
            <Text
              style={[styles.emptyText, { color: currentColors.textMuted }]}
            >
              {t("notifications.emptyText")}
            </Text>
          </View>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              currentColors={currentColors}
              locale={language === "en" ? "en-US" : "es-CO"}
              onPress={() => {
                markAsRead(n.id);
                if (n.envId)
                  navigation.navigate("EnvironmentDetail", { envId: n.envId });
              }}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSub: { fontSize: 12, marginTop: 1 },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  filterScroll: { marginTop: 12, maxHeight: 58, flexGrow: 0 },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: "transparent",
    minHeight: 48,
    justifyContent: "center",
  },
  filterChipText: { fontSize: 14, fontWeight: "800" },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  itemMsg: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  itemTime: { fontSize: 11 },

  empty: { alignItems: "center", marginTop: 16, paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: "bold" },
  emptyText: { fontSize: 13, textAlign: "center", maxWidth: 280 },
});
