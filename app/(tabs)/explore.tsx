import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAll } from '@/services/firebase-database';


type Artwork = {
  url: string;
  uid: string;
  createdAt: number;
  lat?: number;
  lng?: number;
};

export default function ExploreScreen() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    loadArtworks();
  }, []);
  

  async function loadArtworks() {
    try {
      const data = await getAll('artworks');
      setArtworks(data);
    } catch (err) {
      console.error('Failed to load artworks:', err);
    }
  }

  const openMap = (lat?: number, lng?: number) => {
    if (!lat || !lng) return;
    const url = Platform.select({
      ios: `maps:${lat},${lng}`,
      android: `geo:${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f72585', dark: '#3a0ca3' }}
      headerImage={
        <IconSymbol size={280} color="#ffffff40" name="map.fill" style={styles.headerImage} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Street Art</ThemedText>
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Discover graffiti and urban artworks around the city.
      </ThemedText>

      {artworks.length === 0 && (
        <ThemedText style={styles.empty}>Aucune œuvre pour l'instant.</ThemedText>
      )}

      {artworks.map((artwork, index) => (
        <Pressable
          key={artwork.createdAt?.toString() ?? index.toString()}
          style={styles.card}
          onPress={() => openMap(artwork.lat, artwork.lng)}
        >
          <Image source={{ uri: artwork.url }} style={styles.image} contentFit="cover" />
          <ThemedView style={styles.cardContent}>
            <ThemedView style={styles.artistRow}>
              <IconSymbol name="person.fill" size={18} color="#f72585" />
              <ThemedText type="defaultSemiBold">{artwork.uid}</ThemedText>
            </ThemedView>
            {artwork.lat && artwork.lng && (
              <ThemedText style={styles.mapText}>Tap to open location</ThemedText>
            )}
          </ThemedView>
        </Pressable>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { bottom: -90, left: -35, position: 'absolute' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  subtitle: { fontSize: 16, opacity: 0.7, marginBottom: 20 },
  empty: { textAlign: 'center', opacity: 0.4, marginTop: 40 },
  card: {
    marginBottom: 20, borderRadius: 22, overflow: 'hidden',
    backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1,
    shadowRadius: 8, elevation: 4,
  },
  image: { width: '100%', height: 240 },
  cardContent: { padding: 16, gap: 10 },
  artistRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapText: { color: '#7209b7', marginTop: 6, fontWeight: '600' },
});