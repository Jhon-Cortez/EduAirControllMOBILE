import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useEnvironments } from "../../context/EnvironmentsContext";
import { useLanguage } from "../../context/LanguageContext";
import NotificationButton from "../../components/NotificationButton";
import {
  calcEnvironmentScore,
  isNormalEnvironment,
  isWarningEnvironment,
  isAlertEnvironment,
} from "../../utils/environmentMetrics";

// ── Score Ring ─────────────────────────────────────────────────
function ScoreRing({ score, size = 52, currentColors }) {
  const color =
    score >= 75
      ? currentColors.success
      : score >= 50
        ? currentColors.warning
        : currentColors.error;
  return (
    <View
      style={[
        srStyles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
        },
      ]}
    >
      <Text style={[srStyles.num, { color, fontSize: size * 0.27 }]}>
        {score}
      </Text>
    </View>
  );
}
const srStyles = StyleSheet.create({
  ring: { borderWidth: 3, alignItems: "center", justifyContent: "center" },
  num: { fontWeight: "bold" },
});

// ── Status Icon ────────────────────────────────────────────────
function StatusIcon({ statusKey, size = 18, currentColors }) {
  const map = {
    "dashboard.statusNormal": {
      name: "checkmark-circle",
      color: currentColors.success,
    },
    "dashboard.statusWarning": {
      name: "warning",
      color: currentColors.warning,
    },
    "dashboard.statusAlert": {
      name: "alert-circle",
      color: currentColors.error,
    },
    normal: { name: "checkmark-circle", color: currentColors.success },
    warning: { name: "warning", color: currentColors.warning },
    alert: { name: "alert-circle", color: currentColors.error },
  };
  const icon = map[statusKey] || map["normal"];
  return <Ionicons name={icon.name} size={size} color={icon.color} />;
}

// ── Helpers ────────────────────────────────────────────────────
// ── Global Health Card ─────────────────────────────────────────
function GlobalHealthCard({ environments, currentColors, t }) {
  const total = environments.length;
  if (!total) return null;
  const normal = environments.filter(isNormalEnvironment).length;
  const warning = environments.filter(isWarningEnvironment).length;
  const alert = environments.filter(isAlertEnvironment).length;
  const pct = Math.round((normal / total) * 100);
  const color =
    pct >= 70
      ? currentColors.success
      : pct >= 40
        ? currentColors.warning
        : currentColors.error;
  const emoji = pct >= 70 ? "🟢" : pct >= 40 ? "🟡" : "🔴";
  const label =
    pct >= 70
      ? t("dashboard.goodHealth")
      : pct >= 40
        ? t("dashboard.recommendedAttention")
        : t("dashboard.interventionNeeded");

  return (
    <View
      style={[
        hcStyles.card,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        },
      ]}
    >
      <View style={hcStyles.row}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[hcStyles.label, { color: currentColors.textPrimary }]}>
            {label}
          </Text>
          <Text style={[hcStyles.sub, { color: currentColors.textMuted }]}>
            {t("dashboard.monitored", { count: total })}
          </Text>
        </View>
        <Text style={[hcStyles.pct, { color }]}>{pct}%</Text>
      </View>
      <View
        style={[hcStyles.track, { backgroundColor: currentColors.bgInput }]}
      >
        {normal > 0 && (
          <View
            style={[
              hcStyles.seg,
              { flex: normal, backgroundColor: currentColors.success },
            ]}
          />
        )}
        {warning > 0 && (
          <View
            style={[
              hcStyles.seg,
              { flex: warning, backgroundColor: currentColors.warning },
            ]}
          />
        )}
        {alert > 0 && (
          <View
            style={[
              hcStyles.seg,
              { flex: alert, backgroundColor: currentColors.error },
            ]}
          />
        )}
      </View>
      <View style={hcStyles.legend}>
        {[
          {
            color: currentColors.success,
            icon: "checkmark-circle",
            count: normal,
            label: t("status.normal"),
          },
          {
            color: currentColors.warning,
            icon: "warning",
            count: warning,
            label: t("status.warning"),
          },
          {
            color: currentColors.error,
            icon: "alert-circle",
            count: alert,
            label: t("status.alert"),
          },
        ].map((item) => (
          <View
            key={item.label}
            style={[
              hcStyles.legendItem,
              {
                backgroundColor: `${item.color}14`,
                borderColor: `${item.color}55`,
              },
            ]}
          >
            <Ionicons name={item.icon} size={13} color={item.color} />
            <Text style={[hcStyles.legendCount, { color: item.color }]}>
              {item.count}
            </Text>
            <Text
              style={[hcStyles.legendTxt, { color: currentColors.textMuted }]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const hcStyles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  label: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 12, marginTop: 2 },
  pct: { fontSize: 20, fontWeight: "bold" },
  track: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  seg: { height: "100%" },
  legend: { flexDirection: "row", gap: 8 },
  legendItem: {
    flex: 1,
    minHeight: 30,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  legendCount: { fontSize: 13, fontWeight: "800" },
  legendTxt: { fontSize: 10.5, fontWeight: "700", flexShrink: 1 },
});

// ── Stats Bar ──────────────────────────────────────────────────
function StatsBar({ environments, currentColors, t }) {
  const counts = [
    {
      n: environments.filter(isNormal).length,
      color: currentColors.success,
      icon: "checkmark-circle",
      label: t("status.normal"),
    },
    {
      n: environments.filter(isWarning).length,
      color: currentColors.warning,
      icon: "warning",
      label: t("status.warning"),
    },
    {
      n: environments.filter(isAlert).length,
      color: currentColors.error,
      icon: "alert-circle",
      label: t("status.alert"),
    },
    {
      n: environments.length,
      color: currentColors.accent,
      icon: "trophy",
      label: t("dashboard.total"),
    },
  ];
  return (
    <View
      style={[
        sbStyles.bar,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        },
      ]}
    >
      {counts.map((s, i) => (
        <View
          key={i}
          style={[
            sbStyles.stat,
            i < counts.length - 1 && {
              borderRightWidth: 1,
              borderRightColor: currentColors.borderColor,
            },
          ]}
        >
          <Ionicons name={s.icon} size={18} color={s.color} />
          <Text style={[sbStyles.count, { color: s.color }]}>{s.n}</Text>
          <Text style={[sbStyles.label, { color: currentColors.textMuted }]}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
const sbStyles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 12, gap: 3 },
  count: { fontSize: 18, fontWeight: "bold" },
  label: { fontSize: 10, fontWeight: "600" },
});

// ── Alerts Panel ───────────────────────────────────────────────
function AlertsPanel({ environments, onPress, currentColors, t }) {
  const problematic = environments.filter(
    (e) => isAlertEnvironment(e) || isWarningEnvironment(e),
  );

  if (!problematic.length) {
    return (
      <View
        style={[
          apStyles.empty,
          {
            backgroundColor: currentColors.bgCard,
            borderColor: currentColors.borderColor,
          },
        ]}
      >
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={currentColors.success}
        />
        <Text style={[apStyles.emptyTxt, { color: currentColors.textMuted }]}>
          {t("dashboard.noAlerts")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        apStyles.panel,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        },
      ]}
    >
      <View style={apStyles.titleRow}>
        <Ionicons name="notifications" size={16} color={currentColors.accent} />
        <Text style={[apStyles.title, { color: currentColors.textPrimary }]}>
          {t("dashboard.activeAlerts")}
        </Text>
        <View
          style={[apStyles.badge, { backgroundColor: currentColors.accent }]}
        >
          <Text style={apStyles.badgeTxt}>{problematic.length}</Text>
        </View>
      </View>
      {problematic.map((env) => {
        const alert = isAlertEnvironment(env);
        const color = alert ? currentColors.error : currentColors.warning;
        const temperature = env.temp ?? env.temperature ?? 0;
        const issues = [];
        if (temperature < 18 || temperature > 24)
          issues.push(`Temp ${temperature}°C`);
        if (env.humidity < 40 || env.humidity > 60)
          issues.push(`Hum ${env.humidity}%`);
        if (env.co2 > 1000) issues.push(`CO₂ ${env.co2}ppm`);
        if (env.noise > 50)
          issues.push(`${t("dashboard.noise")} ${env.noise}dB`);
        return (
          <TouchableOpacity
            key={env.id}
            style={[
              apStyles.item,
              { borderLeftColor: color, backgroundColor: `${color}15` },
            ]}
            onPress={() => onPress(env.id)}
          >
            <Ionicons
              name={alert ? "alert-circle" : "warning"}
              size={18}
              color={color}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  apStyles.itemName,
                  { color: currentColors.textPrimary },
                ]}
              >
                {env.name}
              </Text>
              {issues.length > 0 && (
                <Text style={[apStyles.itemIssues, { color }]}>
                  {issues.join(" · ")}
                </Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={currentColors.textMuted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const apStyles = StyleSheet.create({
  empty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  emptyTxt: { fontSize: 13, flex: 1 },
  panel: { borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 12 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  title: { fontSize: 14, fontWeight: "700", flex: 1 },
  badge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  badgeTxt: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginBottom: 6,
  },
  itemName: { fontSize: 13, fontWeight: "600" },
  itemIssues: { fontSize: 11, marginTop: 2 },
});

// ── Rank Row (rank 4+) ─────────────────────────────────────────
function RankRow({ env, rank, score, onPress, onToggleFav, currentColors }) {
  const t = env.temp ?? env.temperature ?? 0;
  const pills = [
    { label: `${t}°C`, warn: t < 18 || t > 24 },
    { label: `${env.humidity}%`, warn: env.humidity < 40 || env.humidity > 60 },
    { label: `${env.co2}ppm`, warn: env.co2 > 1000 },
    { label: `${env.noise}dB`, warn: env.noise > 50 },
  ];
  const warn = pills.filter((p) => p.warn);
  const visible = warn.length ? warn.slice(0, 2) : pills.slice(0, 2);

  return (
    <TouchableOpacity
      style={[
        rrStyles.row,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        },
      ]}
      onPress={() => onPress(env.id)}
      activeOpacity={0.85}
    >
      <Text style={[rrStyles.rank, { color: currentColors.textMuted }]}>
        #{rank}
      </Text>
      <StatusIcon
        statusKey={env.statusKey}
        size={18}
        currentColors={currentColors}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={[rrStyles.name, { color: currentColors.textPrimary }]}
          numberOfLines={1}
        >
          {env.name}
        </Text>
        {env.location ? (
          <Text style={[rrStyles.loc, { color: currentColors.textMuted }]}>
            {env.location}
          </Text>
        ) : null}
      </View>
      <View style={rrStyles.pills}>
        {visible.map((p, i) => (
          <View
            key={i}
            style={[
              rrStyles.pill,
              {
                backgroundColor: p.warn
                  ? currentColors.warningDim
                  : currentColors.bgCard,
                borderColor: p.warn
                  ? currentColors.warning
                  : currentColors.borderColor,
              },
            ]}
          >
            <Text
              style={[
                rrStyles.pillTxt,
                {
                  color: p.warn
                    ? currentColors.warning
                    : currentColors.textMuted,
                },
              ]}
            >
              {p.label}
            </Text>
          </View>
        ))}
      </View>
      <ScoreRing score={score} size={42} currentColors={currentColors} />
      <TouchableOpacity
        onPress={() => onToggleFav(env.id, !env.isFavorite)}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={{ marginLeft: 6 }}
      >
        <Ionicons
          name={env.isFavorite ? "heart" : "heart-outline"}
          size={50}
          color={
            env.isFavorite ? currentColors.favorite : currentColors.textMuted
          }
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
const rrStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  rank: { fontSize: 13, fontWeight: "700", width: 28 },
  name: { fontSize: 14, fontWeight: "600" },
  loc: { fontSize: 11, marginTop: 1 },
  pills: { flexDirection: "row", gap: 4 },
  pill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  pillTxt: { fontSize: 10, fontWeight: "600" },
});

// ── Filter Bar ─────────────────────────────────────────────────
const FILTERS = [
  { key: "all", labelKey: "dashboard.all" },
  { key: "normal", icon: "checkmark-circle", labelKey: "status.normal" },
  { key: "warning", icon: "warning", labelKey: "status.warning" },
  { key: "alert", icon: "alert-circle", labelKey: "status.alert" },
];

// ── Main ───────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme();
  const { environments, toggleFavorite } = useEnvironments();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");

  const ranked = useMemo(
    () =>
      environments
        .map((env) => ({ env, score: calcEnvironmentScore(env) }))
        .sort((a, b) => b.score - a.score),
    [environments],
  );

  const locations = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(environments.map((env) => env.location).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [environments],
  );

  const rankingStats = useMemo(() => {
    if (!ranked.length) return { average: 0, best: null, worst: null };
    return {
      average: Math.round(
        ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length,
      ),
      best: ranked[0],
      worst: ranked[ranked.length - 1],
    };
  }, [ranked]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return ranked.filter(({ env }) => {
      const matchesSearch =
        !query ||
        String(env.name || "")
          .toLowerCase()
          .includes(query);
      const matchesLocation = location === "all" || env.location === location;
      const matchesStatus =
        filter === "all" ||
        (filter === "normal" && isNormalEnvironment(env)) ||
        (filter === "warning" && isWarningEnvironment(env)) ||
        (filter === "alert" && isAlertEnvironment(env));
      return matchesSearch && matchesLocation && matchesStatus;
    });
  }, [filter, location, ranked, search]);

  const handlePress = (id) =>
    navigation.navigate("EnvironmentDetail", { envId: id });

  if (!loaded) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: currentColors.bgBody }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#999" }}>{t("loading")}</Text>
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
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.headerTitle, { color: currentColors.textPrimary }]}
          >
            {t("dashboard.title")}
          </Text>
          <Text style={[styles.headerSub, { color: currentColors.textMuted }]}>
            {t("dashboard.subtitle")}
          </Text>
        </View>
        <NotificationButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: currentColors.bgCard,
              borderColor: currentColors.borderColor,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={17}
            color={currentColors.textMuted}
          />
          <TextInput
            style={[styles.searchInput, { color: currentColors.textPrimary }]}
            placeholder={t("dashboard.searchPlaceholder")}
            placeholderTextColor={currentColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={currentColors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.locationScroll}
          contentContainerStyle={styles.locationRow}
        >
          {locations.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.locationChip,
                { borderColor: currentColors.borderColor },
                location === item && {
                  backgroundColor: currentColors.accent,
                  borderColor: currentColors.accent,
                },
              ]}
              onPress={() => setLocation(item)}
            >
              <Text
                style={[
                  styles.locationChipText,
                  {
                    color:
                      location === item
                        ? currentColors.bgBody
                        : currentColors.textSecondary,
                  },
                ]}
              >
                {item === "all" ? t("dashboard.allLocations") : item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View
          style={[
            styles.rankingStats,
            {
              backgroundColor: currentColors.bgCard,
              borderColor: currentColors.borderColor,
            },
          ]}
        >
          <View style={styles.rankingStat}>
            <Text
              style={[styles.rankingStatValue, { color: currentColors.accent }]}
            >
              {environments.length}
            </Text>
            <Text
              style={[
                styles.rankingStatLabel,
                { color: currentColors.textMuted },
              ]}
            >
              {t("dashboard.total")}
            </Text>
          </View>
          <View style={styles.rankingStat}>
            <Text
              style={[styles.rankingStatValue, { color: currentColors.accent }]}
            >
              {rankingStats.average}
            </Text>
            <Text
              style={[
                styles.rankingStatLabel,
                { color: currentColors.textMuted },
              ]}
            >
              {t("dashboard.average")}
            </Text>
          </View>
          <View style={styles.rankingStat}>
            <Text
              style={[
                styles.rankingStatName,
                { color: currentColors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {rankingStats.best?.env.name || "-"}
            </Text>
            <Text
              style={[
                styles.rankingStatLabel,
                { color: currentColors.textMuted },
              ]}
            >
              {t("dashboard.best")}
            </Text>
          </View>
          <View style={styles.rankingStat}>
            <Text
              style={[
                styles.rankingStatName,
                { color: currentColors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {rankingStats.worst?.env.name || "-"}
            </Text>
            <Text
              style={[
                styles.rankingStatLabel,
                { color: currentColors.textMuted },
              ]}
            >
              {t("dashboard.worst")}
            </Text>
          </View>
        </View>

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
                styles.filterBtn,
                {
                  backgroundColor: currentColors.bgCard,
                  borderColor: currentColors.borderColor,
                },
                filter === f.key && {
                  backgroundColor: currentColors.accent,
                  borderColor: currentColors.accent,
                },
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterTxt,
                  {
                    color:
                      filter === f.key
                        ? currentColors.bgBody
                        : currentColors.textSecondary,
                  },
                ]}
              >
                {f.icon ? `${t(f.labelKey)}` : t(f.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Empty */}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>🏜️</Text>
            <Text style={[styles.emptyTxt, { color: currentColors.textMuted }]}>
              {t("dashboard.emptyByStatus")}
            </Text>
          </View>
        )}

        {/* Ranking list */}
        {filtered.length > 0 && (
          <View style={styles.listSection}>
            <Text
              style={[styles.listTitle, { color: currentColors.textMuted }]}
            >
              {t("dashboard.positions", { from: 1, to: filtered.length })}
            </Text>
            {filtered.map(({ env, score }, idx) => (
              <RankRow
                key={env.id}
                env={env}
                rank={idx + 1}
                score={score}
                onPress={handlePress}
                onToggleFav={toggleFavorite}
                currentColors={currentColors}
              />
            ))}
          </View>
        )}

        {/* Legend */}
        <View
          style={[
            styles.legend,
            {
              backgroundColor: currentColors.bgCard,
              borderColor: currentColors.borderColor,
            },
          ]}
        >
          <Text
            style={[styles.legendTitle, { color: currentColors.textPrimary }]}
          >
            {t("dashboard.scoreTitle")}
          </Text>
          {[
            t("dashboard.idealTemp"),
            t("dashboard.idealHumidity"),
            t("dashboard.idealCo2"),
            t("dashboard.idealNoise"),
          ].map((l) => (
            <Text
              key={l}
              style={[
                styles.legendItem,
                { color: currentColors.textSecondary },
              ]}
            >
              {l}
            </Text>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSub: { fontSize: 12, marginTop: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 20, paddingBottom: 20 },
  filterScroll: { marginBottom: 16, maxHeight: 58, flexGrow: 0 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  locationScroll: { maxHeight: 42, flexGrow: 0, marginBottom: 10 },
  locationRow: { flexDirection: "row", gap: 8, paddingRight: 8 },
  locationChip: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  locationChipText: { fontSize: 12, fontWeight: "700" },
  rankingStats: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    paddingVertical: 10,
  },
  rankingStat: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  rankingStatValue: { fontSize: 17, fontWeight: "800" },
  rankingStatName: { fontSize: 11, fontWeight: "700", maxWidth: 72 },
  rankingStatLabel: { fontSize: 9, marginTop: 3 },
  filterRow: { flexDirection: "row", gap: 10, paddingRight: 8 },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center",
  },
  filterTxt: { fontSize: 14, fontWeight: "800" },
  empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTxt: { fontSize: 14 },
  listSection: { marginTop: 4 },
  listTitle: { fontSize: 13, fontWeight: "600", marginBottom: 10 },
  legend: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  legendTitle: { fontSize: 13, fontWeight: "700", marginBottom: 4 },
  legendItem: { fontSize: 12 },
});
