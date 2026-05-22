// Import Ionicons icon library from Expo
import { Ionicons } from '@expo/vector-icons';

// Import router for screen navigation
import { router } from 'expo-router';

// Import React and hooks
import React, { useState, useEffect } from 'react';

// Import React Native components and APIs
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

// Import Redux hook
import { useSelector } from 'react-redux';

// Import RootState type for Redux typing
import { RootState } from '@/services/store';

// Import Firebase database helper
import { getAll } from '@/services/firebase-database';

// Get device screen width
const { width } = Dimensions.get('window');

/**
 * Artwork object structure
 */
type Artwork = {
  id: string;
  url: string;
  uid: string;
  nickname: string;
  createdAt: number;
  lat?: number;
  lng?: number;
  likes: number;
  liked: boolean;
  description?: string;
};

/**
 * Available tabs displayed at the top
 */
const TABS = ['TENDANCES', 'RÉCENTS', 'SUIVIS'];

/**
 * Artwork card component
 * Displays one artwork with image, author info,
 * description, location, and like button.
 */
function ArtworkCard({
  item,
  onLike,
}: {
  item: Artwork;
  onLike: (id: string) => void;
}) {

  /**
   * Open artwork location in maps application
   */
  const openMap = () => {

    // Stop if no coordinates exist
    if (!item.lat || !item.lng) return;

    // Generate platform-specific map URL
    const url = Platform.select({
      ios: `maps:${item.lat},${item.lng}`,
      android: `geo:${item.lat},${item.lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`,
    });

    // Open map application
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>

      {/* Artwork image */}
      <Image source={{ uri: item.url }} style={styles.cardImage} />

      {/* Description badge */}
      {item.description ? (
        <View style={styles.descriptionBadge}>
          <Text style={styles.descriptionText}>
            {item.description}
          </Text>
        </View>
      ) : null}

      {/* Dark overlay for better readability */}
      <View style={styles.cardOverlay} />

      {/* Footer section */}
      <View style={styles.cardFooter}>

        {/* Author information */}
        <View style={styles.authorRow}>

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.nickname
                ? item.nickname.charAt(0).toUpperCase()
                : '?'}
            </Text>
          </View>

          {/* Nickname and location */}
          <View>

            {/* User nickname */}
            <Text style={styles.nickname}>
              {item.nickname}
            </Text>

            {/* Location display */}
            {item.lat && item.lng ? (

              <TouchableOpacity onPress={openMap}>
                <Text style={styles.location}>
                  📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                </Text>
              </TouchableOpacity>

            ) : (

              <Text style={styles.noLocation}>
                📍 Pas de localisation
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

          {/* Likes count */}
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
 * Main Home Screen component
 */
export default function HomeScreen() {

  // Store artworks list
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Store selected tab index
  const [activeTab, setActiveTab] = useState(0);

  // Get current user UID from Redux store
  const uid = useSelector((state: RootState) => state.user.uid);

  /**
   * Load artworks when user changes
   */
  useEffect(() => {
    loadImages({ uid });
  }, [uid]);

  /**
   * Parameters for loading images
   */
  interface LoadImagesParams {
    uid: string;
  }

  /**
   * Fetch artworks and users from Firebase
   */
  async function loadImages({ uid }: LoadImagesParams) {
    try {

      // Retrieve all artworks
      const data = await getAll('artworks');

      // Retrieve all users
      const users = await getAll('users');

      /**
       * Create a map:
       * uid => nickname
       */
      const usersMap: Record<string, string> = {};

      users.forEach((u: any) => {
        usersMap[u.uid] = u.nickname;
      });

      /**
       * Format artworks data
       */
      const formatted: Artwork[] = data.map(
        (item: any, index: number) => ({
          id: item.createdAt?.toString() ?? index.toString(),
          url: item.url ?? item.photo ?? '',
          uid: item.uid,
          nickname: usersMap[item.uid] ?? 'Anonyme',
          createdAt: item.createdAt,
          lat: item.lat ?? null,
          lng: item.lng ?? null,
          likes: 0,
          liked: false,
          description: item.description ?? '',
        })
      );

      // Save artworks into state
      setArtworks(formatted);

    } catch (err) {

      // Log loading errors
      console.error(
        'Failed to load images on Home screen:',
        err
      );
    }
  }

  /**
   * Handle artwork like toggle
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

        {/* Application title */}
        <Text style={styles.headerTitle}>
          localS-treet-Art
        </Text>

        {/* Notification button */}
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#F72585"
          />
        </TouchableOpacity>
      </View>

      {/* TABS */}
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

            {/* Tab label */}
            <Text
              style={[
                styles.tabText,
                activeTab === i && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ARTWORKS LIST */}
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}

        // Render artwork card
        renderItem={({ item }) => (
          <ArtworkCard
            item={item}
            onLike={handleLike}
          />
        )}

        // Empty state
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Aucune œuvre pour l'instant.
              {'\n'}
              Soyez le premier à partager !
            </Text>
          </View>
        }
      />

      {/* CAMERA BUTTON */}
      <TouchableOpacity
        style={styles.cameraButton}

        // Navigate to camera screen
        onPress={() => router.push('/camera')}

        activeOpacity={0.85}
      >

        {/* Camera icon */}
        <Ionicons
          name="camera"
          size={26}
          color="#fff"
        />

        {/* Button label */}
        <Text style={styles.cameraButtonText}>
          CRÉER
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  // Main screen container
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Header style
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

  // Header title style
  headerTitle: {
    color: '#F72585',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },

  // Notification icon style
  headerIcon: {
    padding: 4,
  },

  // Tabs container style
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },

  // Single tab style
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

  // Tab text style
  tabText: {
    color: '#444',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // Active tab text style
  tabTextActive: {
    color: '#fff',
  },

  // List style
  list: {
    padding: 16,
    paddingBottom: 110,
  },

  // Artwork card style
  card: {
    backgroundColor: '#141420',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#222236',
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Artwork image style
  cardImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },

  // Description badge style
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

  // Description text style
  descriptionText: {
    color: '#fff',
    fontSize: 12,
  },

  // Overlay style
  cardOverlay: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
  },

  // Card footer style
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#141420',
  },

  // Author row style
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Avatar style
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

  // Avatar text style
  avatarText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  // Nickname text style
  nickname: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Location text style
  location: {
    color: '#F72585',
    fontSize: 11,
    marginTop: 2,
  },

  // No location text style
  noLocation: {
    color: '#444',
    fontSize: 11,
    marginTop: 2,
  },

  // Like button style
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

  // Active like button style
  likeButtonActive: {
    backgroundColor: '#1a0028',
    borderColor: '#F72585',
  },

  // Heart icon style
  likeIcon: {
    color: '#F72585',
    fontSize: 17,
  },

  // Likes count style
  likeCount: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
  },

  // Active likes count style
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
    shadowOffset: { width: 0, height: 8 },
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