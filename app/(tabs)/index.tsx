import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Image, Pressable, FlatList, SafeAreaViewBase, StatusBar } from 'react-native';


export default function ModalScreen() {
  type Artwork = {
  id: string;
  photo: string;
  nickname: string;
  likes: number;
  liked: boolean;
};

// =====================
// ARTWORK CARD
// =====================
function ArtworkCard({
  item,
  onLike,
}: {
  item: Artwork;
  onLike: (id: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.photo }} style={styles.cardImage} />
      <View style={styles.cardFooter}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.nickname.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.nickname}>{item.nickname}</Text>
        </View>

        <TouchableOpacity
          style={[styles.likeButton, item.liked && styles.likeButtonActive]}
          onPress={() => onLike(item.id)}
          activeOpacity={0.8}
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



  return (
    <View style={styles.container}>

      <Text style={styles.title}>Accueil</Text>

      {/* BOUTON CAMERA → navigue vers /photo */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => router.push('/photo')}
      >
        <Ionicons name="camera" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// =====================
// STYLES
// =====================
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // HEADER
  header: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F72585',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F72585',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // TABS
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#7209B7',
  },
  tabText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#fff',
  },

  // LIST
  list: {
    padding: 16,
    paddingBottom: 100,
  },

  // CARD
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7209B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  nickname: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // LIKE BUTTON
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D0D0D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  likeButtonActive: {
    backgroundColor: '#2a0040',
    borderColor: '#F72585',
  },
  likeIcon: {
    color: '#F72585',
    fontSize: 18,
  },
  likeCount: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  likeCountActive: {
    color: '#F72585',
  },

  // EMPTY STATE
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#444',
    fontSize: 15,
    textAlign: 'center',
  },

  // ADD BUTTON
  addButton: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    backgroundColor: '#7209B7',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
  },
});