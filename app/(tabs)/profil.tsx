// Import the Image component from expo-image for optimized image rendering
import { Image } from 'expo-image';

// Import React Native components for styling and touch interactions
import { StyleSheet, Pressable } from 'react-native';

// Import Expo Router hook for navigation between screens
import { useRouter } from 'expo-router';

// Import React hooks for lifecycle management and state handling
import { useEffect, useState } from 'react';

// Import Redux hook to access global application state
import { useSelector } from 'react-redux';

// Import Firebase authentication logout function
import { logout } from '@/services/firebase-auth';

// Import Firebase database helper functions
import { getById, getAll } from '@/services/firebase-database';

// Import RootState type for Redux state typing
import { RootState } from '@/services/store';

// Import custom themed text component
import { ThemedText } from '@/components/themed-text';

// Import custom themed view component
import { ThemedView } from '@/components/themed-view';

// Import custom icon component
import { IconSymbol } from '@/components/ui/icon-symbol';

// Main profile screen component
export default function TabThreeScreen() {

  // Router instance used for navigation
  const router = useRouter();

  // Retrieve the current user's UID from Redux store
  const uid = useSelector((state: RootState) => state.user.uid);

  // State for storing user's nickname
  const [nickname, setNickname] = useState('');

  // State for storing user's email
  const [email, setEmail] = useState('');

  // State for storing number of artworks created by the user
  const [artworksCount, setArtworksCount] = useState(0);

  /**
   * Load user data when the component mounts
   * or when the UID changes.
   */
  useEffect(() => {
    // Stop execution if no user is connected
    if (!uid) return;

    // Fetch user information
    loadUserData();
  }, [uid]);

  /**
   * Fetch user profile data and artworks count
   * from Firebase database.
   */
  async function loadUserData() {
    try {

      // Retrieve user document by UID
      const user = await getById('users', uid);

      // If user exists, update local states
      if (user) {
        setNickname(user.nickname ?? '');
        setEmail(user.email ?? '');
      }

      // Retrieve all artworks from database
      const allArtworks = await getAll('artworks');

      // Filter artworks belonging to the current user
      const userArtworks = allArtworks.filter((a: any) => a.uid === uid);

      // Store artworks count in state
      setArtworksCount(userArtworks.length);

    } catch (err) {

      // Log database loading errors
      console.error('Failed to load user data:', err);
    }
  }

  /**
   * Handle user logout action.
   */
  const handleLogout = async () => {
    try {

      // Disconnect the user from Firebase Authentication
      await logout();

      // Redirect user to home/login screen
      router.replace('/');

    } catch (error) {

      // Log logout errors
      console.error('Logout error:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>

      {/* Header section containing title and logout button */}
      <ThemedView style={styles.header}>

        {/* Screen title */}
        <ThemedText type="title">Profile</ThemedText>

        {/* Logout button */}
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>

          {/* Logout icon */}
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={20}
            color="#f72585"
          />

          {/* Logout text */}
          <ThemedText type="link">Logout</ThemedText>
        </Pressable>
      </ThemedView>

      {/* User avatar image */}
      <Image
        source={{ uri: 'https://i.pravatar.cc/300' }}
        style={styles.avatar}
      />

      {/* Display user's nickname */}
      <ThemedText type="title" style={styles.name}>
        {nickname || 'Chargement...'}
      </ThemedText>

      {/* Display user's email or UID */}
      <ThemedText style={styles.email}>
        {email || uid}
      </ThemedText>

      {/* Statistics section */}
      <ThemedView style={styles.statsContainer}>

        {/* Artworks statistics box */}
        <ThemedView style={styles.statBox}>

          {/* Artwork icon */}
          <IconSymbol name="camera.fill" size={22} color="#7209b7" />

          {/* Number of artworks */}
          <ThemedText type="defaultSemiBold">
            {artworksCount}
          </ThemedText>

          {/* Label */}
          <ThemedText>Artworks</ThemedText>
        </ThemedView>

        {/* Likes statistics box */}
        <ThemedView style={styles.statBox}>

          {/* Likes icon */}
          <IconSymbol name="heart.fill" size={22} color="#f72585" />

          {/* Number of likes */}
          <ThemedText type="defaultSemiBold">0</ThemedText>

          {/* Label */}
          <ThemedText>Likes</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  // Main container style
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },

  // Header container style
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Logout button style
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  // User avatar style
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#7209b7',
  },

  // Username style
  name: {
    textAlign: 'center',
    marginTop: 10,
  },

  // Email style
  email: {
    textAlign: 'center',
    opacity: 0.6,
  },

  // Statistics container style
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },

  // Statistics card style
  statBox: {
    alignItems: 'center',
    gap: 6,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    width: 120,
  },
});