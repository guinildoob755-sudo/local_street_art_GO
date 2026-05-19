import { Image } from 'expo-image';
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

const artworks = [
  {
    id: 1,
    artist: 'Yes.guy🇦🇴',
    likes: 128,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 2,
    artist: 'StreetFlow',
    likes: 92,
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200',
    latitude: 48.8606,
    longitude: 2.3376,
  },
];

export default function ExploreScreen() {
  const openMap = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps:${lat},${lng}`,
      android: `geo:${lat},${lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: '#f72585',
        dark: '#3a0ca3',
      }}
      headerImage={
        <IconSymbol
          size={280}
          color="#ffffff40"
          name="map.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Street Art</ThemedText>
      </ThemedView>

      <ThemedText style={styles.subtitle}>
        Discover graffiti and urban artworks around the city.
      </ThemedText>

      {artworks.map((artwork) => (
        <Pressable
          key={artwork.id}
          style={styles.card}
          onPress={() => openMap(artwork.latitude, artwork.longitude)}>
          <Image
            source={{ uri: artwork.image }}
            style={styles.image}
            contentFit="cover"
          />

          <ThemedView style={styles.cardContent}>
            <ThemedView style={styles.artistRow}>
              <IconSymbol name="person.fill" size={18} color="#f72585" />
              <ThemedText type="defaultSemiBold">
                {artwork.artist}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.likeRow}>
              <IconSymbol name="heart.fill" size={18} color="#f72585" />
              <ThemedText>{artwork.likes} likes</ThemedText>
            </ThemedView>

            <ThemedText style={styles.mapText}>
              Tap to open location
            </ThemedText>
          </ThemedView>
        </Pressable>
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 20,
  },

  card: {
    marginBottom: 20,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 240,
  },

  cardContent: {
    padding: 16,
    gap: 10,
  },

  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  mapText: {
    color: '#7209b7',
    marginTop: 6,
    fontWeight: '600',
  },
});