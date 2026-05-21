import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/services/store';
import { getAll } from '@/services/firebase-database';

const { width } = Dimensions.get('window');


type Artwork = {
  id: string;
  url: string;
  uid: string;
  createdAt: number;
  lat?: number;
  lng?: number;
  likes: number;
  liked: boolean;
  description?: string;  // ← ajout
};

const TABS = ['TENDANCES', 'RÉCENTS', 'SUIVIS'];

function ArtworkCard({
  item,
  onLike,
}: {
  item: Artwork;
  onLike: (id: string) => void;
}) {
  const openMap = () => {
    if (!item.lat || !item.lng) return;
    const url = Platform.select({
      ios: `maps:${item.lat},${item.lng}`,
      android: `geo:${item.lat},${item.lng}`,
      default: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.cardImage} />
      <View style={styles.cardOverlay} />
      <View style={styles.cardFooter}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.uid ? item.uid.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.nickname}>{item.uid}</Text>
            {/* ← Localisation sous le pseudo */}
            {item.lat && item.lng ? (
              <TouchableOpacity onPress={openMap}>
                <Text style={styles.location}>
                  📍 {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noLocation}>📍 Pas de localisation</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.likeButton, item.liked && styles.likeButtonActive]}
          onPress={() => onLike(item.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.likeIcon}>{item.liked ? '♥' : '♡'}</Text>
          <Text style={[styles.likeCount, item.liked && styles.likeCountActive]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const uid = useSelector((state: RootState) => state.user.uid);

  useEffect(() => {
    loadImages({ uid });
  }, [uid]);

  interface LoadImagesParams {
    uid: string;
  }

  async function loadImages({ uid }: LoadImagesParams) {
    try {
      const data = await getAll('artworks');
      const formatted: Artwork[] = data.map((item: any, index: number) => ({
        id: item.createdAt?.toString() ?? index.toString(),
        // ← gère les deux clés 'url' et 'photo'
        url: item.url ?? item.photo ?? '',
        uid: item.uid,
        createdAt: item.createdAt,
        lat: item.lat ?? null,
        lng: item.lng ?? null,
        likes: 0,
        liked: false,
        description: item.description ?? '',  // ← ajout
      }));
      setArtworks(formatted);
    } catch (err) {
      console.error('Failed to load images on Home screen:', err);
    }
  }

  function handleLike(id: string) {
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, liked: !a.liked, likes: a.liked ? a.likes - 1 : a.likes + 1 }
          : a
      )
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}> localS-treet-Art</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={22} color="#F72585" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE */}
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <>
            <ArtworkCard item={item} onLike={handleLike} />
            {item.description ? (
              <View style={styles.descriptionBadge}>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            ) : null}
          </>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Aucune œuvre pour l'instant.{'\n'}Soyez le premier à partager !
            </Text>
          </View>
        }
      />

      {/* BOUTON CAMÉRA */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => router.push('/photo')}
        activeOpacity={0.85}
      >
        <Ionicons name="camera" size={26} color="#fff" />
        <Text style={styles.cameraButtonText}>CRÉER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0D0D0D' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0D0D0D', paddingVertical: 16, paddingHorizontal: 22,
    borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
  },
  headerTitle: { color: '#F72585', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  headerIcon: { padding: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#1e1e1e' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#F72585' },
  tabText: { color: '#444', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  tabTextActive: { color: '#fff' },
  list: { padding: 16, paddingBottom: 110 },
  card: {
    backgroundColor: '#141420', borderRadius: 20, marginBottom: 20,
    overflow: 'hidden', borderWidth: 1, borderColor: '#222236',
    shadowColor: '#F72585', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
  },
  descriptionBadge: {
  position: 'absolute', top: 12, left: 12,
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: 10, paddingVertical: 6,
  borderRadius: 10, maxWidth: '80%',
},
descriptionText: { color: '#fff', fontSize: 12 },
  cardImage: { width: '100%', height: 240, resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', bottom: 56, left: 0, right: 0, height: 60, backgroundColor: 'transparent' },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#141420',
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#7209B7',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F72585',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  nickname: { color: '#e0e0e0', fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  // ← nouveaux styles localisation
  location: { color: '#F72585', fontSize: 11, marginTop: 2 },
  noLocation: { color: '#444', fontSize: 11, marginTop: 2 },
  likeButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D0D0D',
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 50, borderWidth: 1, borderColor: '#2a2a2a',
  },
  likeButtonActive: { backgroundColor: '#1a0028', borderColor: '#F72585' },
  likeIcon: { color: '#F72585', fontSize: 17 },
  likeCount: { color: '#666', fontSize: 13, fontWeight: '700' },
  likeCountActive: { color: '#F72585' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#333', fontSize: 15, textAlign: 'center', lineHeight: 24 },
  cameraButton: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#7209B7', paddingVertical: 16, paddingHorizontal: 40,
    borderRadius: 50, shadowColor: '#F72585', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55, shadowRadius: 18, elevation: 12,
  },
  cameraButtonText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
});