// Import the Tabs component from expo-router to create tab navigation
import { Tabs } from 'expo-router';
import React from 'react';

// Import a custom tab button component with haptic feedback
import { HapticTab } from '@/components/haptic-tab';

// Import a reusable icon component for tab icons
import { IconSymbol } from '@/components/ui/icon-symbol';

// Import app color constants
import { Colors } from '@/constants/theme';

// Import hook to detect the current device color scheme (light/dark mode)
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * TabLayout Component
 *
 * This component defines the bottom tab navigation of the application.
 * It includes three screens:
 * - Home
 * - Explore
 * - Profile
 *
 * Features:
 * - Dynamic color adaptation based on light/dark theme
 * - Haptic feedback when pressing tabs
 * - Custom icons for each tab
 */
export default function TabLayout() {
  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // Set the active tab color based on the current theme
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

        // Hide the top header for all tab screens
        headerShown: false,

        // Use a custom tab button with haptic feedback
        tabBarButton: HapticTab,
      }}
    >
      {/* Home screen tab */}
      <Tabs.Screen
        name="index"
        options={{
          // Displayed title in the tab bar
          title: 'Home',

          // Icon displayed for the Home tab
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />

      {/* Explore screen tab */}
      <Tabs.Screen
        name="explore"
        options={{
          // Displayed title in the tab bar
          title: 'Explore',

          // Icon displayed for the Explore tab
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="paperplane.fill"
              color={color}
            />
          ),
        }}
      />

      {/* Profile screen tab */}
      <Tabs.Screen
        name="profil"
        options={{
          // Displayed title in the tab bar
          title: 'My Profile',

          // Icon displayed for the Profile tab
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="paperplane.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}