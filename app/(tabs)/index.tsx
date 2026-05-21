// Import Ionicons icons from Expo
import { Ionicons } from '@expo/vector-icons';

// Import Expo Router for navigation
import { router } from 'expo-router';

// Import React and hooks
import React, { useState, useEffect } from 'react';

// Import React Native components and utilities
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Import Redux hook to access global state
import { useSelector } from 'react-redux';

// Import RootState type from Redux store
import { RootState } from '@/services/store';

// Import Firebase helper function
import { getAll } from '@/services/firebase-database';

// Get device screen width
const { width } = Dimensions.get('window');

/**
 * Artwork Type
 *
 * Represents an artwork object displayed in the feed.
 */
type Artwork = {
  // Unique artwork identifier
  id: string;

  // Artwork image URL
  url: string;

  // Artist/user identifier
  uid: string;

  // Artwork creation timestamp
  createdAt: number;

  // Optional GPS latitude
  lat?: number;

  // Optional GPS longitude
  lng?: number;

  // Number of likes
  likes: number;

  // Like state for the current user
  liked: boolean;

  // Optional artwork description
  description?: string;
};

/**
 * Navigation tabs
 */
const TABS = ['TENDANCES', 'RÉCENTS', 'SUIVIS'];

/**
 * ArtworkCard Component
 *
 * Displays a single artwork card with:
 * - Image
 * - Artist information
 * - Location
 * - Like button
 */
function ArtworkCard({
  item,
  onLike,
}: {
  item: Artwork;
  onLike: (id: string) => void;
}) {

  /**
   * openMap()
   *
   * Opens the artwork location in the device map application.
   */
  const openMap = () => {
    // Prevent opening if location is unavailable
    if (!item.lat || !item.lng) return;

    /**
     * Generate a platform-specific map URL
     */
    const url = Platform.select({
      ios: `maps:${item.lat},${item.lng}`,
      android: `geo:${item.lat},${item.lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`,
    });

    // Open the map application
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>

      {/* Artwork image */}
      <Image
        source={{ uri: item.url }}
        style={styles.cardImage}
      />

      {/* Gradient/overlay effect */}
      <View style={styles.cardOverlay} />

      {/* Footer section */}
      <View style={styles.cardFooter}>

        {/* Artist section */}
        <View style={styles.authorRow}>

          {/* Artist avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.uid ? item.uid.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>

          {/* Artist information */}
          <View>
            <Text style={styles.nickname}>
              {item.uid}
            </Text>

            {/* Artwork location */}
            {item.lat && item.lng ? (
              <TouchableOpacity onPress={openMap}>
                <Text style={styles.location}>
                  📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noLocation}>
                📍 No location available
              </Text>
            )}
          </View>
        </View>

        {/* Like button */}
        <TouchableOpacity
          style={[
            styles.likeButton,
            item.liked && styles.likeButtonActive,
          ]}
          onPress={() => onLike(item.id)}
          activeOpacity={0.75}
        >
          {/* Heart icon */}
          <Text style={styles.likeIcon}>
            {item.liked ? '♥' : '♡'}
          </Text>

          {/* Like count */}
          <Text
            style={[
              styles.likeCount,
              item.liked && styles.likeCountActive,
            ]}
          >
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * HomeScreen Component
 *
 * Main application feed displaying artworks uploaded by users.
 *
 * Features:
 * - Artwork feed
 * - Like system
 * - Location opening
 * - Category tabs
 * - Camera navigation
 */
export default function HomeScreen() {

  /**
   * artworks state
   *
   * Stores all fetched artworks.
   */
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  /**
   * activeTab state
   *
   * Stores the selected tab index.
   */
  const [activeTab, setActiveTab] = useState(0);

  /**
   * Current authenticated user ID from Redux
   */
  const uid = useSelector(
    (state: RootState) => state.user.uid
  );

  /**
   * Load artworks whenever the user changes.
   */
  useEffect(() => {
    loadImages({ uid });
  }, [uid]);

  /**
   * Parameters type for loadImages()
   */
  interface LoadImagesParams {
    uid: string;
  }

  /**
   * loadImages()
   *
   * Fetches artworks from Firebase database
   * and formats them for the feed.
   */
  async function loadImages({ uid }: LoadImagesParams) {
    try {
      // Retrieve artworks collection
      const data = await getAll('artworks');

      /**
       * Format Firebase data
       */
      const formatted: Artwork[] = data.map(
        (item: any, index: number) => ({
          id: item.createdAt?.toString() ?? index.toString(),

          // Support both "url" and "photo" fields
          url: item.url ?? item.photo ?? '',

          uid: item.uid,
          createdAt: item.createdAt,

          lat: item.lat ?? null,
          lng: item.lng ?? null,

          // Default like values
          likes: 0,
          liked: false,

          // Artwork description
          description: item.description ?? '',
        })
      );

      // Update state
      setArtworks(formatted);

    } catch (err) {

      // Error handling
      console.error(
        'Failed to load images on Home screen:',
        err
      );
    }
  }

  /**
   * handleLike()
   *
   * Toggles the like state for an artwork.
   *
   * @param id - Artwork ID
   */
  function handleLike(id: string) {
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              liked: !a.liked,
              likes: a.liked
                ? a.likes - 1
                : a.likes + 1,
            }
          : a
      )
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* Status bar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D0D0D"
      />

      {/* HEADER */}
      <View style={styles.header}>

        {/* App title */}
        <Text style={styles.headerTitle}>
          localS-treet-Art
        </Text>

        {/* Notifications button */}
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#F72585"
          />
        </TouchableOpacity>
      </View>

      {/* NAVIGATION TABS */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === i && styles.tabActive,
            ]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === i &&
                  styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ARTWORK LIST */}
      <FlatList
        data={artworks}

        // Unique key for each item
        keyExtractor={(item) => item.id}

        contentContainerStyle={styles.list}

        showsVerticalScrollIndicator={false}

        /**
         * Render artwork card
         */
        renderItem={({ item }) => (
          <>
            <ArtworkCard
              item={item}
              onLike={handleLike}
            />

            {/* Artwork description badge */}
            {item.description ? (
              <View style={styles.descriptionBadge}>
                <Text style={styles.descriptionText}>
                  {item.description}
                </Text>
              </View>
            ) : null}
          </>
        )}

        /**
         * Empty state UI
         */
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No artworks available yet.{'\n'}
              Be the first to share!
            </Text>
          </View>
        }
      />

      {/* CAMERA BUTTON */}
      <TouchableOpacity
        style={styles.cameraButton}

        // Navigate to photo upload screen
        onPress={() => router.push('/photo')}

        activeOpacity={0.85}
      >
        <Ionicons
          name="camera"
          size={26}
          color="#fff"
        />

        <Text style={styles.cameraButtonText}>
          CREATE
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  // Main container
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Header container
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#0D0D0D',

    paddingVertical: 16,
    paddingHorizontal: 22,

    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },

  // App title
  headerTitle: {
    color: '#F72585',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },

  // Notification icon container
  headerIcon: {
    padding: 4,
  },

  // Tabs container
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111',

    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },

  // Single tab
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },

  // Active tab style
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#F72585',
  },

  // Default tab text
  tabText: {
    color: '#444',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // Active tab text
  tabTextActive: {
    color: '#fff',
  },

  // Feed list container
  list: {
    padding: 16,
    paddingBottom: 110,
  },

  // Artwork card
  card: {
    backgroundColor: '#141420',
    borderRadius: 20,

    marginBottom: 20,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#222236',

    shadowColor: '#F72585',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 6,
  },

  // Description badge
  descriptionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,

    backgroundColor: 'rgba(0,0,0,0.6)',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 10,
    maxWidth: '80%',
  },

  // Description text
  descriptionText: {
    color: '#fff',
    fontSize: 12,
  },

  // Artwork image
  cardImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },

  // Overlay effect
  cardOverlay: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
  },

  // Card footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
    paddingVertical: 14,

    backgroundColor: '#141420',
  },

  // Artist section row
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Avatar container
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,

    backgroundColor: '#7209B7',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: '#F72585',
  },

  // Avatar text
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  // Username text
  nickname: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Location text
  location: {
    color: '#F72585',
    fontSize: 11,
    marginTop: 2,
  },

  // Missing location text
  noLocation: {
    color: '#444',
    fontSize: 11,
    marginTop: 2,
  },

  // Like button
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    backgroundColor: '#0D0D0D',

    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 50,

    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  // Active like button
  likeButtonActive: {
    backgroundColor: '#1a0028',
    borderColor: '#F72585',
  },

  // Heart icon
  likeIcon: {
    color: '#F72585',
    fontSize: 17,
  },

  // Like count
  likeCount: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
  },

  // Active like count
  likeCountActive: {
    color: '#F72585',
  },

  // Empty state container
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },

  // Empty state text
  emptyText: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Floating camera button
  cameraButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

    backgroundColor: '#7209B7',

    paddingVertical: 16,
    paddingHorizontal: 40,

    borderRadius: 50,

    shadowColor: '#F72585',
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.55,
    shadowRadius: 18,

    elevation: 12,
  },

  // Camera button text
  cameraButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
});