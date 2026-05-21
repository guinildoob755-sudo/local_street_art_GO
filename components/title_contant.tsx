// Import the color palette used across the application
import { Colors } from '@/constants/theme';

// Import React Native components for layout, styling, and images
import { Image, StyleSheet, View } from 'react-native';

// Import custom themed components
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

/**
 * TitleContent Component
 *
 * Displays the main application title with:
 * - Two decorative logos on each side
 * - A styled title text
 * - Two underline decorations below the title
 */
export function TitleContent() {
  return (
    <ThemedView>
      {/* Main container */}
      <View style={styles.content}>

        {/* Row containing the logos and the title */}
        <View style={styles.titleContent}>

          {/* Left logo */}
          <Image
            source={require('@/assets/images/logo_art.png')}
            style={styles.topLogo}
          />

          {/* Application title */}
          <ThemedText style={styles.title}>
            LocalStreetArt
          </ThemedText>

          {/* Right logo */}
          <Image
            source={require('@/assets/images/logo_art.png')}
            style={styles.topLogo}
          />
        </View>

        {/* Decorative underline */}
        <View style={styles.underline1}></View>

        {/* Smaller decorative underline */}
        <View style={styles.underline2}></View>
      </View>
    </ThemedView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  /**
   * Main container styles
   * Centers content horizontally
   */
  content: {
    alignItems: "center",
    justifyContent: "flex-start"
  },

  /**
   * Layout for title and logos
   * Displays items in a horizontal row
   */
  titleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  /**
   * Logo image styling
   */
  topLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  /**
   * Title text styling
   */
  title: {
    fontSize: 24,
    fontFamily: 'Creepster',
    textTransform: "uppercase",
    textAlign: "center"
  },

  /**
   * First underline decoration
   */
  underline1: {
    width: 260,
    height: 1,
    backgroundColor: Colors.light.text
  },

  /**
   * Second underline decoration
   * Slightly smaller and spaced below the first one
   */
  underline2: {
    width: 200,
    height: 1,
    backgroundColor: Colors.light.text,
    marginTop: 4
  }
});