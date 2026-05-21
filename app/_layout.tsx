import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { store } from '@/services/store';
import { Provider, useDispatch } from 'react-redux';  // ← ajout useDispatch
import { setUid } from '@/features/userSlice';         // ← ajout

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import auth from '../services/firebase-auth';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

// ← Séparation en deux composants car useDispatch ne peut pas
//    être utilisé à l'intérieur du Provider lui-même
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();  // ← ajout

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user_ => {
      if (user_ && user_.uid) {
        dispatch(setUid(user_.uid));  // ← ajout crucial
        setIsLoggedIn(true);
        router.navigate('/(tabs)');
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsub;
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{
            title: 'Connexion',
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: '#bd811e',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
            presentation: 'transparentModal',
            animation: "slide_from_left"
          }} />
        </Stack.Protected>
        <Stack.Screen name="modal" options={{ title: 'Modal' }} />
        <Stack.Screen name="map-modal" options={{ title: 'Modal2' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Betania': require('../assets/fonts/BetaniaPatmosGDL-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}