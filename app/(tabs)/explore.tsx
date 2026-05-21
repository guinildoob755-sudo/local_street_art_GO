
// Import the Image component from expo-image for optimized image rendering
import { Image } from 'expo-image';

// Import React hooks
import { useEffect, useState } from 'react';

// Import React Native utilities and components
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';

// Import custom UI components
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Import Firebase database helper function
import { getAll } from '@/services/firebase-database';

/**
 * Artwork Type
 *
 * Represents a street artwork object stored in the database.
 */
type Artwork = {
  // Image URL of the artwork
  url: string;

  // User ID or creator identifier
  uid: string;

  // Timestamp of creation
  createdAt: number;

  // Optional latitude coordinate
  lat?: number;

  // Optional longitude coordinate
  lng?: number;
};

/**
 * ExploreScreen Component
 *
 * This screen displays a list of street artworks fetched from Firebase.
 * Users can:
 * - Browse artwork images
 * - View artist information
 * - Open artwork locations in a map application
 */
export default function ExploreScreen() {
  /**
   * artworks state
   *
   * Stores all artworks retrieved from the database.
   */
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  /**
   * useEffect
   *
   * Loads artworks once when the component mounts.
   */
  useEffect(() => {
    loadArtworks();
  }, []);

  /**
   * loadArtworks()
   *
   * Fetches all artworks from the Firebase database.
   */
  async function loadArtworks() {
    try {
      const data = await getAll('artworks');

      // Update state with retrieved artworks
      setArtworks(data);
    } catch (err) {
      // Log an error if the request fails
      console.error('Failed to load artworks:', err);
    }
  }

  /**
   * openMap()
   *
   * Opens the artwork location in the device's map application.
   *
   * @param lat - Latitude coordinate
   * @param lng - Longitude coordinate
   */
  const openMap = (lat?: number, lng?: number) => {
    // Prevent execution if coordinates are missing
    if (!lat || !lng) return;

    /**
     * Generate a platform-specific map URL
     */
    const url = Platform.select({
      // Apple Maps URL for iOS
      ios: `maps:${lat},${lng}`,

      // Geo URI for Android
      android: `geo:${lat},${lng}`,

      // Google Maps URL for web/other platforms
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    // Open the generated URL
    if (url) Linking.openURL(url);
  };

  return (
    <ParallaxScrollView
      // Header background colors for light and dark mode
      headerBackgroundColor={{
        light: '#f72585',
        dark: '#3a0ca3',
      }}

      // Header icon displayed in the parallax section
      headerImage={
        <IconSymbol
          size={280}
          color="#ffffff40"
          name="map.fill"
          style={styles.headerImage}
        />
      }
    >
      {/* Screen title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Explore Street Art
        </ThemedText>
      </ThemedView>

      {/* Screen subtitle */}
      <ThemedText style={styles.subtitle}>
        Discover graffiti and urban artworks around the city.
      </ThemedText>

      {/* Empty state message */}
      {artworks.length === 0 && (
        <ThemedText style={styles.empty}>
          No artworks available yet.
        </ThemedText>
      )}

      {/* Render artwork cards */}
      {artworks.map((artwork, index) => (
        <Pressable
          // Unique key for React rendering
          key={artwork.createdAt?.toString() ?? index.toString()}

          // Card styling
          style={styles.card}

          // Open map when the card is pressed
          onPress={() => openMap(artwork.lat, artwork.lng)}
        >
          {/* Artwork image */}
          <Image
            source={{ uri: artwork.url }}
            style={styles.image}
            contentFit="cover"
          />

          {/* Card content */}
          <ThemedView style={styles.cardContent}>

            {/* Artist information row */}
            <ThemedView style={styles.artistRow}>
              <IconSymbol
                name="person.fill"
                size={18}
                color="#f72585"
              />

              <ThemedText type="defaultSemiBold">
                {artwork.uid}
              </ThemedText>
            </ThemedView>

            {/* Map interaction hint */}
            {artwork.lat && artwork.lng && (
              <ThemedText style={styles.mapText}>
                Tap to open location
              </ThemedText>
            )}
          </ThemedView>
        </Pressable>
      ))}
    </ParallaxScrollView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
  // Header icon positioning
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },

  // Title section layout
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  // Subtitle text style
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
  },

  // Empty state text style
  empty: {
    textAlign: 'center',
    opacity: 0.4,
    marginTop: 40,
  },

  // Artwork card container
  card: {
    marginBottom: 20,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',

    // Shadow styling
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Android shadow
    elevation: 4,
  },

  // Artwork image style
  image: {
    width: '100%',
    height: 240,
  },

  // Card content spacing
  cardContent: {
    padding: 16,
    gap: 10,
  },

  // Artist row layout
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Map hint text style
  mapText: {
    color: '#7209b7',
    marginTop: 6,
    fontWeight: '600',
  },
});