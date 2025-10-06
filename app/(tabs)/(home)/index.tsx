import React from "react";
import { Stack, Link } from "expo-router";
import { StyleSheet, View, Text, Platform, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Camera App",
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <IconSymbol name="camera.fill" size={80} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Welcome to Camera App</Text>
          <Text style={styles.description}>
            Capture beautiful moments with our simple and intuitive camera interface.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <IconSymbol name="camera" size={24} color={colors.accent} />
              <Text style={styles.featureText}>Take Photos</Text>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="photo.on.rectangle" size={24} color={colors.accent} />
              <Text style={styles.featureText}>View Gallery</Text>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="camera.rotate" size={24} color={colors.accent} />
              <Text style={styles.featureText}>Switch Cameras</Text>
            </View>
          </View>
          
          <Link href="/(tabs)/camera" asChild>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Open Camera</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.card} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 40, // Extra padding for floating tab bar
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    boxShadow: '0px 4px 8px rgba(98, 0, 238, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
});
