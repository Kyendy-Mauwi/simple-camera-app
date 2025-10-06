import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={styles.profileHeader}>
          <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          <Text style={styles.name}>Camera User</Text>
          <Text style={styles.email}>camera.user@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Photos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>MB Used</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.infoRow}>
            <IconSymbol name="camera.fill" size={20} color={colors.accent} />
            <Text style={styles.infoText}>Camera Quality: High</Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="photo.fill" size={20} color={colors.accent} />
            <Text style={styles.infoText}>Auto-save Photos: On</Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="location.fill" size={20} color={colors.accent} />
            <Text style={styles.infoText}>Location Services: Off</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});
