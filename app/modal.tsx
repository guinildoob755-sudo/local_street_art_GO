import { Link, router } from 'expo-router';
import{ Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil</Text>
 
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => router.push("/photo")}
      >
        <Ionicons name="camera" size={40} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 50,
  },
});
