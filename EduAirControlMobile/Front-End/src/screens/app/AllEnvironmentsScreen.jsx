import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useEnvironments } from "../../context/EnvironmentsContext";
import { useLanguage } from "../../context/LanguageContext";
import NotificationButton from "../../components/NotificationButton";
import {
  calcEnvironmentScore,
  getEnvironmentStatusKey,
} from "../../utils/environmentMetrics";

function getSeverity(env) {
  const status = getEnvironmentStatusKey(env);
  if (status === "alert") return 3;
  if (status === "warning") return 2;
  return 1;
}

function EnvironmentRow({ env, currentColors, t, onPress }) {
  const statusKey = getEnvironmentStatusKey(env);
  const statusColor =
    statusKey === "normal"
      ? currentColors.success
      : statusKey === "warning"
        ? currentColors.warning
        : currentColors.error;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
          borderLeftColor: statusColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconBox, { backgroundColor: `${statusColor}18` }]}>
        <Ionicons name="business-outline" size={20} color={statusColor} />
      </View>
      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardName, { color: currentColors.textPrimary }]}
          numberOfLines={1}
        >
          {env.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={currentColors.textMuted}
          />
          <Text
            style={[styles.metaText, { color: currentColors.textMuted }]}
            numberOfLines={1}
          >
            {env.location}
          </Text>
          <Ionicons
            name="people-outline"
            size={12}
            color={currentColors.textMuted}
          />
          <Text style={[styles.metaText, { color: currentColors.textMuted }]}>
            {env.capacity}
          </Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={[styles.scorePill, { borderColor: statusColor }]}>
          <Text style={[styles.scoreText, { color: statusColor }]}>
            {calcEnvironmentScore(env)}
          </Text>
        </View>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {t(`status.${statusKey}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AllEnvironmentsScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme();
  const { environments } = useEnvironments();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [favorite, setFavorite] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterSection, setFilterSection] = useState("status");

  const statusFilters = [
    { key: "all", label: t("dashboard.all") },
    { key: "normal", label: t("status.normal") },
    { key: "warning", label: t("status.warning") },
    { key: "alert", label: t("status.alert") },
  ];
  const favoriteFilters = [
    { key: "all", label: t("environments.any") },
    { key: "favorites", label: t("tabs.favorites") },
  ];
  const capacityFilters = [
    { key: "all", label: t("environments.anyCapacity") },
    { key: "small", label: t("environments.small") },
    { key: "medium", label: t("environments.medium") },
    { key: "large", label: t("environments.large") },
  ];
  const locationFilters = [
    { key: "all", label: "Todos los bloques" },
    ...Array.from(
      new Set(environments.map((env) => env.location).filter(Boolean)),
    )
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ key: item, label: item })),
  ];
  const sortFilters = [
    { key: "name", label: t("environments.byName") },
    { key: "score", label: t("environments.byScore") },
    { key: "capacity", label: t("environments.byCapacity") },
    { key: "critical", label: "Mas criticos" },
  ];
  const filterSections = [
    { key: "status", label: t("environments.status") },
    { key: "favorite", label: t("environments.favorite") },
    { key: "capacity", label: t("environments.capacity") },
    { key: "location", label: "Bloque" },
    { key: "sort", label: t("environments.sort") },
  ];
  const filterGroups = {
    status: {
      title: t("environments.status"),
      items: statusFilters,
      active: status,
      setActive: setStatus,
    },
    favorite: {
      title: t("environments.favorite"),
      items: favoriteFilters,
      active: favorite,
      setActive: setFavorite,
    },
    capacity: {
      title: t("environments.capacity"),
      items: capacityFilters,
      active: capacity,
      setActive: setCapacity,
    },
    location: {
      title: "Bloque o ubicacion",
      items: locationFilters,
      active: location,
      setActive: setLocation,
    },
    sort: {
      title: t("environments.sort"),
      items: sortFilters,
      active: sort,
      setActive: setSort,
    },
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return environments
      .filter((env) => {
        const envStatus = getEnvironmentStatusKey(env);
        const cap = Number(env.capacity) || 0;
        const matchSearch =
          !q ||
          env.name.toLowerCase().includes(q) ||
          String(env.location || "")
            .toLowerCase()
            .includes(q);
        const matchStatus = status === "all" || status === envStatus;
        const matchFavorite = favorite === "all" || env.isFavorite;
        const matchLocation = location === "all" || env.location === location;
        const matchCapacity =
          capacity === "all" ||
          (capacity === "small" && cap <= 30) ||
          (capacity === "medium" && cap > 30 && cap <= 50) ||
          (capacity === "large" && cap > 50);
        return (
          matchSearch &&
          matchStatus &&
          matchFavorite &&
          matchCapacity &&
          matchLocation
        );
      })
      .sort((a, b) => {
        if (sort === "score")
          return calcEnvironmentScore(b) - calcEnvironmentScore(a);
        if (sort === "capacity") return (b.capacity || 0) - (a.capacity || 0);
        if (sort === "critical")
          return (
            getSeverity(b) - getSeverity(a) ||
            calcEnvironmentScore(a) - calcEnvironmentScore(b)
          );
        return a.name.localeCompare(b.name);
      });
  }, [capacity, environments, favorite, location, search, sort, status]);
  const activeFiltersCount = [
    status !== "all",
    favorite !== "all",
    capacity !== "all",
    location !== "all",
    sort !== "name",
  ].filter(Boolean).length;
  const activeGroup = filterGroups[filterSection];
  const clearFilters = () => {
    setStatus("all");
    setFavorite("all");
    setCapacity("all");
    setLocation("all");
    setSort("name");
  };

  if (!loaded) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: currentColors.bgBody }]}
      >
        <View style={styles.center}>
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentColors.bgCard,
            borderBottomColor: currentColors.borderColor,
          },
        ]}
      >
        <Ionicons name="business" size={24} color={currentColors.accent} />
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.headerTitle, { color: currentColors.textPrimary }]}
          >
            {t("environments.title")}
          </Text>
          <Text style={[styles.headerSub, { color: currentColors.textMuted }]}>
            {t("environments.subtitle")}
          </Text>
        </View>
        <NotificationButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            placeholder={t("management.searchPlaceholder")}
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

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: currentColors.bgCard,
                borderColor: currentColors.borderColor,
              },
            ]}
            onPress={() => setFiltersOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={currentColors.accent}
            />
            <Text
              style={[
                styles.filterButtonText,
                { color: currentColors.textPrimary },
              ]}
            >
              {t("environments.filters")}
            </Text>
            {activeFiltersCount > 0 && (
              <View
                style={[
                  styles.filterBadge,
                  { backgroundColor: currentColors.accent },
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    { color: currentColors.bgBody },
                  ]}
                >
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickSortButton,
              {
                backgroundColor: currentColors.bgCard,
                borderColor: currentColors.borderColor,
              },
            ]}
            onPress={() => {
              setFilterSection("sort");
              setFiltersOpen(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="swap-vertical-outline"
              size={17}
              color={currentColors.textMuted}
            />
            <Text
              style={[
                styles.quickSortText,
                { color: currentColors.textSecondary },
              ]}
            >
              {sortFilters.find((item) => item.key === sort)?.label}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.resultCount, { color: currentColors.textMuted }]}>
          {t("management.showing", {
            shown: filtered.length,
            total: environments.length,
          })}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={56}
              color={currentColors.borderColor}
            />
            <Text
              style={[styles.emptyTitle, { color: currentColors.textPrimary }]}
            >
              {t("management.noResults")}
            </Text>
            <Text
              style={[styles.emptyText, { color: currentColors.textMuted }]}
            >
              {t("management.tryAnother")}
            </Text>
          </View>
        ) : (
          filtered.map((env) => (
            <EnvironmentRow
              key={env.id}
              env={env}
              currentColors={currentColors}
              t={t}
              onPress={() =>
                navigation.navigate("EnvironmentDetail", { envId: env.id })
              }
            />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal
        visible={filtersOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setFiltersOpen(false)}
          />
          <View
            style={[
              styles.filterSheet,
              { backgroundColor: currentColors.bgBody },
            ]}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setFiltersOpen(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.sheetBody}>
              <View
                style={[
                  styles.sectionMenu,
                  {
                    backgroundColor: currentColors.bgCard,
                    borderRightColor: currentColors.borderColor,
                  },
                ]}
              >
                {filterSections.map((section) => (
                  <TouchableOpacity
                    key={section.key}
                    style={[
                      styles.sectionItem,
                      { borderBottomColor: currentColors.borderColor },
                      filterSection === section.key && {
                        backgroundColor: currentColors.bgBody,
                      },
                    ]}
                    onPress={() => setFilterSection(section.key)}
                  >
                    {filterSection === section.key && (
                      <View
                        style={[
                          styles.sectionIndicator,
                          { backgroundColor: currentColors.accent },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.sectionText,
                        {
                          color:
                            filterSection === section.key
                              ? currentColors.accent
                              : currentColors.textSecondary,
                        },
                      ]}
                    >
                      {section.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.optionsPane}>
                <Text
                  style={[
                    styles.optionsTitle,
                    { color: currentColors.textPrimary },
                  ]}
                >
                  {activeGroup.title}
                </Text>
                {activeGroup.items.map((item) => {
                  const selected = activeGroup.active === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.optionRow,
                        { borderBottomColor: currentColors.borderColor },
                      ]}
                      onPress={() => activeGroup.setActive(item.key)}
                      activeOpacity={0.85}
                    >
                      <View
                        style={[
                          styles.radio,
                          {
                            borderColor: selected
                              ? currentColors.accent
                              : currentColors.borderColor,
                          },
                        ]}
                      >
                        {selected && (
                          <View
                            style={[
                              styles.radioDot,
                              { backgroundColor: currentColors.accent },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          { color: currentColors.textPrimary },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={currentColors.accent}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View
              style={[
                styles.sheetFooter,
                {
                  backgroundColor: currentColors.bgCard,
                  borderTopColor: currentColors.borderColor,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text
                  style={[
                    styles.clearButtonText,
                    { color: currentColors.accent },
                  ]}
                >
                  {t("environments.clearFilters")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.resultsButton,
                  { backgroundColor: currentColors.accent },
                ]}
                onPress={() => setFiltersOpen(false)}
              >
                <Text
                  style={[
                    styles.resultsButtonText,
                    { color: currentColors.bgBody },
                  ]}
                >
                  {t("environments.seeResults", { count: filtered.length })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingTop: 20, paddingBottom: 20 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  controlsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  filterButton: {
    flex: 1.2,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  filterButtonText: { fontSize: 14, fontWeight: "900" },
  filterBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  filterBadgeText: { fontSize: 11, fontWeight: "900" },
  quickSortButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  quickSortText: { fontSize: 13, fontWeight: "800" },
  resultCount: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderRadius: 14,
    borderWidth: 1.5,
    borderLeftWidth: 4,
    padding: 13,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "800", marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, maxWidth: 130 },
  rightSide: { alignItems: "center", gap: 3 },
  scorePill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { fontSize: 12, fontWeight: "900" },
  statusText: { fontSize: 10, fontWeight: "800" },
  empty: { alignItems: "center", paddingTop: 52, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "800" },
  emptyText: { fontSize: 13, textAlign: "center" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  filterSheet: {
    minHeight: "62%",
    maxHeight: "78%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "visible",
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    top: -46,
    zIndex: 2,
  },
  sheetBody: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionMenu: {
    width: 135,
    borderRightWidth: 1,
  },
  sectionItem: {
    minHeight: 74,
    borderBottomWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  sectionIndicator: {
    position: "absolute",
    left: 0,
    top: 14,
    bottom: 14,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  sectionText: { fontSize: 14, fontWeight: "800", lineHeight: 18 },
  optionsPane: { flex: 1, paddingHorizontal: 22, paddingTop: 26 },
  optionsTitle: { fontSize: 20, fontWeight: "900", marginBottom: 14 },
  optionRow: {
    minHeight: 62,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionText: { flex: 1, fontSize: 17, fontWeight: "700" },
  sheetFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: { fontSize: 15, fontWeight: "900" },
  resultsButton: {
    flex: 1.5,
    minHeight: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsButtonText: { fontSize: 15, fontWeight: "900" },
});
