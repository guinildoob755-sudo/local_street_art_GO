// Import optimized image component from Expo
import { Image } from 'expo-image';

// Import React Native components
import {
  StyleSheet,
  Pressable,
} from 'react-native';

// Import Expo Router navigation hook
import { useRouter } from 'expo-router';

// Import React hooks
import {
  useEffect,
  useState,
} from 'react';

// Import Redux hook
import { useSelector } from 'react-redux';

// Import Firebase authentication helper
import { logout } from '@/services/firebase-auth';

// Import Firebase database helpers
import {
  getById,
  getAll,
} from '@/services/firebase-database';

// Import Redux store type
import { RootState } from '@/services/store';

// Import custom themed UI components
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Import reusable icon component
import { IconSymbol } from '@/components/ui/icon-symbol';

/**
 * TabThreeScreen Component
 *
 * Profile screen displaying:
 * - User avatar
 * - Nickname
 * - User ID
 * - Artwork statistics
 * - Logout button
 */
export default function TabThreeScreen() {

  /**
   * Expo Router instance
   */
  const router = useRouter();

  /**
   * Current authenticated user ID
   * retrieved from Redux store.
   */
  const uid = useSelector(
    (state: RootState) => state.user.uid
  );

  /**
   * User nickname state
   */
  const [nickname, setNickname] =
    useState('');

  /**
   * Number of artworks created by the user
   */
  const [artworksCount, setArtworksCount] =
    useState(0);

  /**
   * Load user data when the component mounts
   * or when the user ID changes.
   */
  useEffect(() => {

    if (!uid) return;

    loadUserData();

  }, [uid]);

  /**
   * loadUserData()
   *
   * Retrieves:
   * - User profile information
   * - Number of artworks uploaded
   */
  async function loadUserData() {

    try {

      /**
       * Retrieve user document
       */
      const user = await getById(
        'users',
        uid
      );

      console.log(
        'user from firebase:',
        user
      );

      /**
       * Update nickname if user exists
       */
      if (user) {
        setNickname(user.nickname);
      }

      /**
       * Retrieve all artworks
       */
      const allArtworks =
        await getAll('artworks');

      /**
       * Filter artworks belonging
       * to the current user
       */
      const userArtworks =
        allArtworks.filter(
          (a: any) => a.uid === uid
        );

      /**
       * Store artwork count
       */
      setArtworksCount(
        userArtworks.length
      );

    } catch (err) {

      console.error(
        'Failed to load user data:',
        err
      );
    }
  }

  /**
   * handleLogout()
   *
   * Logs the user out
   * and redirects to the home page.
   */
  const handleLogout = async () => {

    try {

      // Firebase logout
      await logout();

      // Redirect to authentication screen
      router.replace('/');

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );
    }
  };

  return (
    <ThemedView style={styles.container}>

      {/* HEADER */}
      <ThemedView style={styles.header}>

        {/* Screen title */}
        <ThemedText type="title">
          Profile
        </ThemedText>

        {/* Logout button */}
        <Pressable
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={20}
            color="#f72585"
          />

          <ThemedText type="link">
            Logout
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* USER AVATAR */}
      <Image
        source={{
          uri: 'https://i.pravatar.cc/300',
        }}
        style={styles.avatar}
      />

      {/* USERNAME */}
      <ThemedText
        type="title"
        style={styles.name}
      >
        {nickname || 'Loading...'}
      </ThemedText>

      {/* USER ID / EMAIL */}
      <ThemedText style={styles.email}>
        {uid}
      </ThemedText>

      {/* USER STATISTICS */}
      <ThemedView style={styles.statsContainer}>

        {/* Artwork statistics */}
        <ThemedView style={styles.statBox}>

          <IconSymbol
            name="camera.fill"
            size={22}
            color="#7209b7"
          />

          <ThemedText type="defaultSemiBold">
            {artworksCount}
          </ThemedText>

          <ThemedText>
            Artworks
          </ThemedText>
        </ThemedView>

        {/* Likes statistics */}
        <ThemedView style={styles.statBox}>

          <IconSymbol
            name="heart.fill"
            size={22}
            color="#f72585"
          />

          <ThemedText type="defaultSemiBold">
            0
          </ThemedText>

          <ThemedText>
            Likes
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  /**
   * Main container
   */
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },

  /**
   * Header section
   */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /**
   * Logout button container
   */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  /**
   * User avatar image
   */
  avatar: {
    width: 110,
    height: 110,

    borderRadius: 55,

    alignSelf: 'center',

    marginTop: 20,

    borderWidth: 3,
    borderColor: '#7209b7',
  },

  /**
   * Username text
   */
  name: {
    textAlign: 'center',
    marginTop: 10,
  },

  /**
   * User ID / email text
   */
  email: {
    textAlign: 'center',
    opacity: 0.6,
  },

  /**
   * Statistics container
   */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },

  /**
   * Statistics card
   */
  statBox: {
    alignItems: 'center',

    gap: 6,

    padding: 15,

    borderRadius: 16,

    backgroundColor: '#f5f5f5',

    width: 120,
  },
});