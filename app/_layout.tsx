import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react'; // ← ajoute cet import
import auth from '../services/firebase-auth';
import { onAuthStateChanged } from 'firebase/auth';


import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};


export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Betania': require('../assets/fonts/BetaniaPatmosGDL-Regular.ttf'),
  });

  const colorScheme = useColorScheme();

  const [user, setUser] = useState<any | null>(null);
useEffect(() => {
    const unsub = onAuthStateChanged(auth, user_ => {
      setUser(user_);
    });
    return unsub;
  }, []);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user_ => {
      setUser(user_);
    });
    return unsub;
  }, []);


  // ✅ Décommenté — indispensable pour cacher le splash screen
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // ✅ Décommenté — évite le flash avant que la police soit prête
  if (!loaded && !error) {
    return null;

    
  }



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} /> 
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}