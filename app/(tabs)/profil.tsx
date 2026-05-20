import { Image } from 'expo-image';
import { StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { logout } from '@/services/firebase-auth';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabThreeScreen() {
  const router = useRouter();

  const user = {
    name: 'Yes.guy🇦🇴',
    email: 'guy.17.06@gmail.com',
    artworks: 12,
    likes: 84,
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out');

      // redirection après déconnexion
      router.replace('/'); // ou '/'
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={20}
            color="#f72585"
          />
          <ThemedText type="link">Logout</ThemedText>
        </Pressable>
      </ThemedView>

      {/* AVATAR */}
      <Image
        source={{ uri: 'https://i.pravatar.cc/300' }}
        style={styles.avatar}
      />

      {/* USER INFO */}
      <ThemedText type="title" style={styles.name}>
        {user.name}
      </ThemedText>

      <ThemedText style={styles.email}>{user.email}</ThemedText>

      {/* STATS */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statBox}>
          <IconSymbol name="camera.fill" size={22} color="#7209b7" />
          <ThemedText type="defaultSemiBold">
            {user.artworks}
          </ThemedText>
          <ThemedText>Artworks</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statBox}>
          <IconSymbol name="heart.fill" size={22} color="#f72585" />
          <ThemedText type="defaultSemiBold">
            {user.likes}
          </ThemedText>
          <ThemedText>Likes</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#7209b7',
  },

  name: {
    textAlign: 'center',
    marginTop: 10,
  },

  email: {
    textAlign: 'center',
    opacity: 0.6,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },

  statBox: {
    alignItems: 'center',
    gap: 6,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    width: 120,
  },
});