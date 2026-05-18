import { ThemedText } from '@/components/themed-text';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();

  // Redirection vers index.tsx
  const openHomePage = () => {
    router.push('../app/index.tsx');
  };

  return (
    <View style={styles.container}>

      {/* Logo cliquable */}
      <TouchableOpacity onPress={openHomePage}>
        <Image
          source={require('@/assets/images/logo_art.png')}
          style={styles.image}
        />
      </TouchableOpacity>

      <ThemedText style={styles.title}>
        Welcome to localstreetart
      </ThemedText>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A0CA3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F72585',
  },
});