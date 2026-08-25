import { useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import AccessibilityMenu from "../components/AccessibilityMenu";

const features = [
  {
    icon: "hardware-chip-outline",
    titleKey: "landing.features.feature1Title",
    textKey: "landing.features.feature1Text",
  },
  {
    icon: "notifications-outline",
    titleKey: "landing.features.feature2Title",
    textKey: "landing.features.feature2Text",
  },
  {
    icon: "analytics-outline",
    titleKey: "landing.features.feature3Title",
    textKey: "landing.features.feature3Text",
  },
  {
    icon: "shield-checkmark-outline",
    titleKey: "landing.features.feature4Title",
    textKey: "landing.features.feature4Text",
  },
];
const audiences = [
  {
    icon: "school-outline",
    titleKey: "landing.audiences.audience1Title",
    textKey: "landing.audiences.audience1Text",
  },
  {
    icon: "briefcase-outline",
    titleKey: "landing.audiences.audience2Title",
    textKey: "landing.audiences.audience2Text",
  },
  {
    icon: "people-circle-outline",
    titleKey: "landing.audiences.audience3Title",
    textKey: "landing.audiences.audience3Text",
  },
];

function SectionHeading({ eyebrow, title, accent, text, colors, fontScale }) {
  return (
    <View style={styles.sectionHeading}>
      <Text
        style={[
          styles.eyebrow,
          { color: colors.accent, fontSize: 12 * fontScale },
        ]}
      >
        {eyebrow.toUpperCase()}
      </Text>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.textPrimary, fontSize: 29 * fontScale },
        ]}
      >
        {title} <Text style={{ color: colors.accent }}>{accent}</Text>
      </Text>
      <Text
        style={[
          styles.sectionText,
          { color: colors.textSecondary, fontSize: 15 * fontScale },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function DashboardPreview({ colors, fontScale, t }) {
  return (
    <View
      style={[
        styles.dashboard,
        { backgroundColor: colors.bgCard, borderColor: colors.borderColor },
      ]}
    >
      <View style={styles.dashboardHeader}>
        <View>
          <Text
            style={[
              styles.dashboardKicker,
              { color: colors.accent, fontSize: 9 * fontScale },
            ]}
          >
            EDUAIRCONTROL
          </Text>
          <Text
            style={[
              styles.dashboardTitle,
              { color: colors.textPrimary, fontSize: 16 * fontScale },
            ]}
          >
            {t("landing.environmentalSummary")}
          </Text>
        </View>
        <View style={[styles.livePill, { backgroundColor: colors.successDim }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
          <Text style={{ color: colors.success, fontSize: 11 * fontScale }}>
            {t("landing.live")}
          </Text>
        </View>
      </View>
      <View style={styles.metricsRow}>
        <Metric
          icon="leaf-outline"
          value="28"
          label={t("landing.iaq")}
          color="#4ADE80"
          colors={colors}
          fontScale={fontScale}
        />
        <Metric
          icon="cloud-outline"
          value="612"
          label={t("landing.co2")}
          color={colors.accent}
          colors={colors}
          fontScale={fontScale}
        />
        <Metric
          icon="water-outline"
          value="48%"
          label={t("landing.humidity")}
          color="#38BDF8"
          colors={colors}
          fontScale={fontScale}
        />
      </View>
      <View style={[styles.chart, { borderColor: colors.borderColor }]}>
        <Text style={[styles.chartLabel, { color: colors.textMuted }]}>
          {t("landing.airQuality")}
        </Text>
      </View>
    </View>
  );
}
function Metric({ icon, value, label, color, colors, fontScale }) {
  return (
    <View style={[styles.metric, { backgroundColor: colors.bgCardAlt }]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text
        style={[
          styles.metricValue,
          { color: colors.textPrimary, fontSize: 20 * fontScale },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.metricLabel,
          { color: colors.textMuted, fontSize: 10 * fontScale },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
function Stat({ value, label, colors, fontScale }) {
  return (
    <View>
      <Text
        style={[
          styles.statValue,
          { color: colors.accent, fontSize: 19 * fontScale },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: colors.textMuted, fontSize: 11 * fontScale },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
function InfoCard({ icon, title, text, colors, fontScale, compact }) {
  return (
    <View
      style={[
        compact ? styles.compactCard : styles.infoCard,
        { backgroundColor: colors.bgCard, borderColor: colors.borderColor },
      ]}
    >
      <View style={[styles.cardIcon, { backgroundColor: colors.accentDim }]}>
        <Ionicons name={icon} size={21} color={colors.accent} />
      </View>
      <View style={styles.cardBody}>
        <Text
          style={[
            styles.cardTitle,
            { color: colors.textPrimary, fontSize: 16 * fontScale },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.cardText,
            { color: colors.textSecondary, fontSize: 13 * fontScale },
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

function FeatureCarousel({
  items,
  colors,
  fontScale,
  t,
  screenWidth,
  accessibilityLabel,
  itemLabel,
  compact = false,
}) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = screenWidth - 40;

  const moveTo = (index) => {
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    carouselRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: true });
    setActiveIndex(nextIndex);
  };

  return (
    <View>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / cardWidth,
          );
          setActiveIndex(index);
        }}
        accessibilityLabel={accessibilityLabel}
      >
        {items.map((item) => (
          <View
            key={item.titleKey}
            style={[styles.featureSlide, { width: cardWidth }]}
          >
            <InfoCard
              {...item}
              title={t(item.titleKey)}
              text={t(item.textKey)}
              colors={colors}
              fontScale={fontScale}
              compact={compact}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.carouselFooter}>
        <View style={styles.pagination} accessibilityRole="tablist">
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.titleKey}
              onPress={() => moveTo(index)}
              accessibilityRole="tab"
              accessibilityLabel={`${t(itemLabel)} ${index + 1}`}
              accessibilityState={{ selected: activeIndex === index }}
              style={styles.paginationButton}
            >
              <View
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      activeIndex === index
                        ? colors.accent
                        : colors.borderColor,
                    width: activeIndex === index ? 22 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.carouselControls}>
          <TouchableOpacity
            style={[styles.carouselButton, { borderColor: colors.borderColor }]}
            onPress={() => moveTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            accessibilityRole="button"
            accessibilityLabel={t("landing.previous")}
          >
            <Ionicons
              name="arrow-back"
              size={17}
              color={activeIndex === 0 ? colors.textMuted : colors.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.carouselButton, { borderColor: colors.borderColor }]}
            onPress={() => moveTo(activeIndex + 1)}
            disabled={activeIndex === items.length - 1}
            accessibilityRole="button"
            accessibilityLabel={t("landing.next")}
          >
            <Ionicons
              name="arrow-forward"
              size={17}
              color={
                activeIndex === items.length - 1
                  ? colors.textMuted
                  : colors.accent
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function LandingScreen({ navigation }) {
  const { currentColors, darkMode, fontScale } = useTheme();
  const { t } = useLanguage();
  const scrollRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const goTo = (section) =>
    scrollRef.current?.scrollTo({ y: section, animated: true });
  const closeMenu = () => setMenuOpen(false);
  const navigateToSection = (section) => {
    closeMenu();
    goTo(section);
  };
  return (
    <View style={[styles.container, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={currentColors.bgBody}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.brand}
            onPress={() => goTo(0)}
            accessibilityRole="button"
            accessibilityLabel={t("landing.home")}
          >
            <View
              style={[
                styles.logoMark,
                { backgroundColor: currentColors.accent },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={currentColors.bgBody}
              />
            </View>
            <Text
              style={[
                styles.brandText,
                {
                  color: currentColors.textPrimary,
                  fontSize: 17 * fontScale,
                },
              ]}
            >
              EduAir<Text style={{ color: currentColors.accent }}>Control</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.menuButton,
              { borderColor: currentColors.borderColor },
            ]}
            onPress={() => setMenuOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t("landing.openNavigation")}
            accessibilityState={{ expanded: menuOpen }}
          >
            <Ionicons
              name="menu-outline"
              size={25}
              color={currentColors.accent}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.hero}>
          <View
            style={[
              styles.heroGlow,
              { backgroundColor: currentColors.accentDim },
            ]}
          />
          <View style={styles.heroCopy}>
            <View
              style={[
                styles.badge,
                { backgroundColor: currentColors.accentDim },
              ]}
            >
              <Ionicons
                name="sparkles-outline"
                size={15}
                color={currentColors.accent}
              />
              <Text style={[styles.badgeText, { color: currentColors.accent }]}>
                {t("landing.healthyAir")}
              </Text>
            </View>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: currentColors.textPrimary,
                  fontSize: (screenWidth < 380 ? 38 : 44) * fontScale,
                },
              ]}
            >
              {t("landing.heroTitle")}{" "}
              <Text style={{ color: currentColors.accent }}>
                {t("landing.heroAccent")}
              </Text>
            </Text>
            <Text
              style={[
                styles.heroText,
                {
                  color: currentColors.textSecondary,
                  fontSize: 16 * fontScale,
                },
              ]}
            >
              {t("landing.heroDescription")}
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: currentColors.accent },
                ]}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: currentColors.bgBody },
                  ]}
                >
                  {t("landing.createAccount")}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={currentColors.bgBody}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: currentColors.borderColor },
                ]}
                onPress={() => goTo(600)}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: currentColors.textPrimary },
                  ]}
                >
                  {t("landing.explore")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroStats}>
              <Stat
                value="24/7"
                label={t("landing.monitoring")}
                colors={currentColors}
                fontScale={fontScale}
              />
              <Stat
                value="100%"
                label={t("landing.traceability")}
                colors={currentColors}
                fontScale={fontScale}
              />
              <Stat
                value="1"
                label={t("landing.centralView")}
                colors={currentColors}
                fontScale={fontScale}
              />
            </View>
          </View>
          <DashboardPreview
            colors={currentColors}
            fontScale={fontScale}
            t={t}
          />
        </View>
        <View style={styles.section}>
          <SectionHeading
            eyebrow={t("landing.whyEyebrow")}
            title={t("landing.whyTitle")}
            accent={t("landing.whyAccent")}
            text={t("landing.whyDescription")}
            colors={currentColors}
            fontScale={fontScale}
          />
          <FeatureCarousel
            items={features}
            colors={currentColors}
            fontScale={fontScale}
            t={t}
            screenWidth={screenWidth}
            accessibilityLabel={t("landing.benefit")}
            itemLabel="landing.benefit"
          />
        </View>
        <View
          style={[
            styles.section,
            styles.tintedSection,
            { backgroundColor: currentColors.bgCardAlt },
          ]}
        >
          <SectionHeading
            eyebrow={t("landing.designedEyebrow")}
            title={t("landing.designedTitle")}
            accent={t("landing.designedAccent")}
            text={t("landing.designedDescription")}
            colors={currentColors}
            fontScale={fontScale}
          />
          <FeatureCarousel
            items={audiences}
            colors={currentColors}
            fontScale={fontScale}
            t={t}
            screenWidth={screenWidth}
            accessibilityLabel={t("landing.audience")}
            itemLabel="landing.audience"
            compact
          />
        </View>
        <View style={[styles.cta, { backgroundColor: currentColors.accent }]}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color={currentColors.bgBody}
          />
          <Text
            style={[
              styles.ctaTitle,
              { color: currentColors.bgBody, fontSize: 28 * fontScale },
            ]}
          >
            {t("landing.ctaTitle")}
          </Text>
          <Text style={[styles.ctaText, { color: currentColors.bgBody }]}>
            {t("landing.ctaDescription")}
          </Text>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              { backgroundColor: currentColors.bgBody },
            ]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={{ color: currentColors.accent, fontWeight: "800" }}>
              {t("landing.startNow")}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={currentColors.accent}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerBrand,
              {
                color: currentColors.textPrimary,
                fontSize: 18 * fontScale,
              },
            ]}
          >
            EduAir<Text style={{ color: currentColors.accent }}>Control</Text>
          </Text>
          <Text style={[styles.footerText, { color: currentColors.textMuted }]}>
            {t("landing.footerDescription")}
          </Text>
          <Text style={[styles.copyright, { color: currentColors.textMuted }]}>
            © 2026 EduAirControl · Neiva, Colombia
          </Text>
        </View>
      </ScrollView>
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.menuOverlay} onPress={closeMenu}>
          <Pressable
            style={[styles.sideMenu, { backgroundColor: currentColors.bgCard }]}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.sideMenuHeader}>
              <Text
                style={[
                  styles.sideMenuTitle,
                  {
                    color: currentColors.textPrimary,
                    fontSize: 20 * fontScale,
                  },
                ]}
              >
                {t("landing.navigation")}
              </Text>
              <TouchableOpacity
                onPress={closeMenu}
                accessibilityRole="button"
                accessibilityLabel={t("landing.closeNavigation")}
              >
                <Ionicons
                  name="close"
                  size={25}
                  color={currentColors.textMuted}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sideMenuLinks}>
              <MenuLink
                icon="home-outline"
                label={t("landing.home")}
                colors={currentColors}
                fontScale={fontScale}
                onPress={() => navigateToSection(0)}
              />
              <MenuLink
                icon="sparkles-outline"
                label={t("landing.whyEyebrow")}
                colors={currentColors}
                fontScale={fontScale}
                onPress={() => navigateToSection(600)}
              />
              <MenuLink
                icon="people-outline"
                label={t("landing.designedEyebrow")}
                colors={currentColors}
                fontScale={fontScale}
                onPress={() => navigateToSection(1050)}
              />
            </View>
            <AccessibilityMenu inline />
            <View
              style={[
                styles.sideMenuActions,
                { borderTopColor: currentColors.borderColor },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.sideMenuPrimary,
                  { backgroundColor: currentColors.accent },
                ]}
                onPress={() => {
                  closeMenu();
                  navigation.navigate("SignUp");
                }}
              >
                <Text
                  style={[
                    styles.sideMenuPrimaryText,
                    { color: currentColors.bgBody, fontSize: 15 * fontScale },
                  ]}
                >
                  {t("landing.createAccount")}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={currentColors.bgBody}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sideMenuLogin,
                  { borderColor: currentColors.borderColor },
                ]}
                onPress={() => {
                  closeMenu();
                  navigation.navigate("Login");
                }}
              >
                <Text
                  style={[
                    styles.sideMenuLoginText,
                    { color: currentColors.accent, fontSize: 15 * fontScale },
                  ]}
                >
                  {t("landing.signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <AccessibilityMenu />
    </View>
  );

  function MenuLink({ icon, label, colors, fontScale, onPress }) {
    return (
      <TouchableOpacity
        style={styles.sideMenuLink}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons name={icon} size={21} color={colors.accent} />
        <Text
          style={[
            styles.sideMenuLinkText,
            { color: colors.textPrimary, fontSize: 16 * fontScale },
          ]}
        >
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 28 },
  navbar: {
    marginTop: 30,
    minHeight: 78,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { fontSize: 17, fontWeight: "800" },
  menuButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    alignItems: "flex-end",
  },
  sideMenu: {
    width: "84%",
    maxWidth: 380,
    height: "100%",
    paddingTop: 56,
    paddingHorizontal: 22,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 12,
  },
  sideMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.18)",
  },
  sideMenuTitle: { fontWeight: "900" },
  sideMenuLinks: { paddingVertical: 18, gap: 6 },
  sideMenuLink: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sideMenuLinkText: { flex: 1, fontWeight: "700" },
  sideMenuActions: {
    borderTopWidth: 1,
    paddingTop: 22,
    gap: 11,
  },
  sideMenuPrimary: {
    minHeight: 49,
    borderRadius: 11,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sideMenuPrimaryText: { fontWeight: "800" },
  sideMenuLogin: {
    minHeight: 49,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenuLoginText: { fontWeight: "800" },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 46,
    position: "relative",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -100,
    right: -120,
  },
  heroCopy: { zIndex: 1 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 18,
  },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  heroTitle: { fontWeight: "900", lineHeight: 49, maxWidth: 360 },
  heroText: { lineHeight: 25, marginTop: 16, maxWidth: 390 },
  heroButtons: { flexDirection: "row", gap: 10, marginTop: 24 },
  primaryButton: {
    minHeight: 49,
    borderRadius: 11,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  primaryButtonText: { fontWeight: "800", fontSize: 14 },
  secondaryButton: {
    minHeight: 49,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { fontWeight: "700", fontSize: 14 },
  heroStats: { flexDirection: "row", gap: 28, marginTop: 30 },
  statValue: { fontWeight: "900" },
  statLabel: { marginTop: 2 },
  dashboard: {
    marginTop: 34,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dashboardKicker: { fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  dashboardTitle: { fontWeight: "800", marginTop: 3 },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  metricsRow: { flexDirection: "row", gap: 7 },
  metric: { flex: 1, minHeight: 88, borderRadius: 11, padding: 10 },
  metricValue: { fontWeight: "900", marginTop: 7 },
  metricLabel: { marginTop: 1 },
  chart: { marginTop: 12, borderTopWidth: 1, paddingTop: 12 },
  chartLabel: { fontSize: 10 },
  section: { paddingHorizontal: 20, paddingVertical: 48 },
  tintedSection: { paddingVertical: 48 },
  sectionHeading: { marginBottom: 24 },
  eyebrow: { fontWeight: "900", letterSpacing: 1.3, marginBottom: 10 },
  sectionTitle: { fontWeight: "900", lineHeight: 35 },
  sectionText: { lineHeight: 23, marginTop: 11 },
  featureSlide: { paddingHorizontal: 0 },
  carouselFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  pagination: { flexDirection: "row", alignItems: "center", gap: 3 },
  paginationButton: { padding: 6 },
  paginationDot: { height: 8, borderRadius: 4 },
  carouselControls: { flexDirection: "row", gap: 8 },
  carouselButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    gap: 13,
  },
  compactCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 13,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontWeight: "800" },
  cardText: { lineHeight: 20, marginTop: 4 },
  cta: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 26,
    alignItems: "flex-start",
  },
  ctaTitle: { fontWeight: "900", marginTop: 13 },
  ctaText: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  ctaButton: {
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  footer: { paddingHorizontal: 20, paddingTop: 42, paddingBottom: 14 },
  footerBrand: { fontSize: 18, fontWeight: "900" },
  footerText: { fontSize: 13, marginTop: 8 },
  copyright: { fontSize: 11, marginTop: 26 },
});
