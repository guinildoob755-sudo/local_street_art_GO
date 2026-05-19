import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A0CA3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F72585',
    marginBottom: 40,
  },

  cameraButton: {
    backgroundColor: '#7209B7',
    padding: 24,
    borderRadius: 50,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
});