// Import navigation themes from React Navigation
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

// Import Expo font loader
import { useFonts } from 'expo-font';

// Import Expo Router components and hooks
import {
  Stack,
  useRouter,
} from 'expo-router';

// Import Expo splash screen API
import * as SplashScreen from 'expo-splash-screen';

// Import Expo status bar component
import { StatusBar } from 'expo-status-bar';

// Import Reanimated dependency
import 'react-native-reanimated';

// Import Redux store
import { store } from '@/services/store';

// Import Redux Provider and dispatch hook
import {
  Provider,
  useDispatch,
} from 'react-redux';

// Import Redux action to store user UID
import { setUid } from '@/features/userSlice';

// Import app color constants
import { Colors } from '@/constants/theme';

// Import custom hook for dark/light mode
import { useColorScheme } from '@/hooks/use-color-scheme';

// Import React hooks
import {
  useEffect,
  useState,
} from 'react';

// Import Firebase authentication listener
import { onAuthStateChanged } from 'firebase/auth';

// Import Firebase auth instance
import auth from '../services/firebase-auth';

/**
 * Prevent the splash screen from automatically hiding
 * until fonts and resources are fully loaded.
 */
SplashScreen.preventAutoHideAsync();

/**
 * Expo Router unstable settings
 *
 * Defines the main anchor route.
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * AppContent Component
 *
 * Handles:
 * - Authentication state
 * - Navigation flow
 * - Theme management
 * - Protected routes
 *
 * This component is separated from the Redux Provider
 * because useDispatch() cannot be used inside the Provider itself.
 */
function AppContent() {

  /**
   * Authentication state
   */
  const [isLoggedIn, setIsLoggedIn] =
    useState<boolean>(false);

  /**
   * Current device color scheme
   * (light or dark mode)
   */
  const colorScheme =
    useColorScheme();

  /**
   * Expo Router instance
   */
  const router = useRouter();

  /**
   * Redux dispatch function
   */
  const dispatch = useDispatch();

  /**
   * Listen to Firebase authentication changes
   */
  useEffect(() => {

    /**
     * Firebase auth listener
     */
    const unsub = onAuthStateChanged(
      auth,
      (user_) => {

        /**
         * User connected
         */
        if (user_ && user_.uid) {

          // Store user UID in Redux
          dispatch(
            setUid(user_.uid)
          );

          // Update auth state
          setIsLoggedIn(true);

          // Navigate to main tabs
          router.navigate('/(tabs)');

        } else {

          /**
           * User disconnected
           */
          setIsLoggedIn(false);
        }
      }
    );

    /**
     * Cleanup listener
     */
    return unsub;

  }, []);

  return (

    /**
     * Theme provider
     *
     * Dynamically switches between:
     * - DarkTheme
     * - DefaultTheme
     */
    <ThemeProvider
      value={
        colorScheme === 'dark'
          ? DarkTheme
          : DefaultTheme
      }
    >

      {/* Navigation stack */}
      <Stack>

        {/* Protected routes for authenticated users */}
        <Stack.Protected guard={isLoggedIn}>

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>

        {/* Protected routes for guests */}
        <Stack.Protected guard={!isLoggedIn}>

          {/* Login screen */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* Signup / authentication modal */}
          <Stack.Screen
            name="signup"
            options={{

              title: 'Connexion',

              /**
               * Header styling
               */
              headerStyle: {
                backgroundColor:
                  Colors.dark.background,
              },

              /**
               * Header text/icon color
               */
              headerTintColor: '#bd811e',

              /**
               * Header title style
               */
              headerTitleStyle: {
                fontWeight: 'bold',
              },

              /**
               * Hide bottom border/shadow
               */
              headerShadowVisible: false,

              /**
               * Modal presentation style
               */
              presentation:
                'transparentModal',

              /**
               * Navigation animation
               */
              animation:
                'slide_from_left',
            }}
          />
        </Stack.Protected>

        {/* Generic modal screen */}
        <Stack.Screen
          name="modal"
          options={{
            title: 'Modal',
          }}
        />

        {/* Map modal screen */}
        <Stack.Screen
          name="map-modal"
          options={{
            title: 'Modal2',
          }}
        />
      </Stack>

      {/* Status bar configuration */}
      <StatusBar style="auto" />

    </ThemeProvider>
  );
}

/**
 * RootLayout Component
 *
 * Main application entry point.
 *
 * Responsibilities:
 * - Load custom fonts
 * - Hide splash screen
 * - Provide Redux store
 */
export default function RootLayout() {

  /**
   * Load custom fonts
   */
  const [loaded, error] = useFonts({

    /**
     * Custom Betania font
     */
    'Betania': require(
      '../assets/fonts/BetaniaPatmosGDL-Regular.ttf'
    ),
  });

  /**
   * Hide splash screen when fonts finish loading
   */
  useEffect(() => {

    if (loaded || error) {
      SplashScreen.hideAsync();
    }

  }, [loaded, error]);

  /**
   * Prevent rendering until fonts are ready
   */
  if (!loaded && !error) {
    return null;
  }

  return (

    /**
     * Redux Provider
     *
     * Makes the Redux store available
     * throughout the application.
     */
    <Provider store={store}>

      {/* Main app content */}
      <AppContent />

    </Provider>
  );
}