import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { store } from '@/services/store';
import { Provider } from 'react-redux';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import auth from '../services/firebase-auth';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loaded, error] = useFonts({
    'Betania': require('../assets/fonts/BetaniaPatmosGDL-Regular.ttf'),
  });

  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user_ => {
      if (user_ && user_.uid) {
        setIsLoggedIn(true);
        router.navigate({
          pathname: '/(tabs)',
          params: { uid: user_.uid }
        });
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsub;
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Provider store={store}>
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
    </Provider>
  );
}