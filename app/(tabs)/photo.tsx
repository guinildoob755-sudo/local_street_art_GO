import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useState, useRef } from 'react';
import { sendPhoto } from '@/services/firebase-storage';
import { useSelector } from 'react-redux';
import { RootState } from '@/services/store';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const { uid } = useSelector((state: RootState) => state.user);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(''); // ← ajout
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
    }
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>Permission</Text>
        </Pressable>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePhoto() {
    if (!cameraRef.current) return;
    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      setLastPhoto(photo?.uri ?? null);
    } catch (err) {
      console.error('Failed to take photo:', err);
    } finally {
      setLoading(false);
    }
  }

  async function sendPhotoToFirebase() {
    if (!lastPhoto) return;
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      await sendPhoto(uid, lastPhoto, { lat: latitude, lng: longitude }, description); // ← ajout
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to send photo:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {!lastPhoto ? (
        // ← Vue caméra
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </Pressable>
            <Pressable style={styles.shutterButton} onPress={takePhoto}>
              <View style={styles.shutterInner} />
            </Pressable>
            <View style={styles.button} />
          </View>
        </>
      ) : (
        // ← Vue aperçu avec description
        <View style={styles.previewContainer}>
          <View style={styles.photoWrapper}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Ajouter une description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Décrivez votre œuvre..."
              placeholderTextColor="#555"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={200}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => {
              setLastPhoto(null);
              setDescription('');
            }}>
              <Text style={styles.text}>Reprendre</Text>
            </Pressable>

            <Pressable style={styles.shutterButton} onPress={sendPhotoToFirebase}>
              <Text style={styles.confirmText}>
                {loading ? '...' : '✓'}
              </Text>
            </Pressable>

            <View style={styles.button} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  message: { textAlign: 'center', paddingBottom: 10, color: '#fff' },
  camera: { position: 'relative', zIndex: 0, height: '100%', width: '100%' },
  buttonContainer: {
    position: 'absolute', bottom: 48,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', width: '100%', paddingHorizontal: 48,
  },
  button: { flex: 1, alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  shutterButton: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 4, borderColor: 'white',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white' },
  confirmText: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  previewContainer: { flex: 1, backgroundColor: '#0D0D0D' },
  photoWrapper: { flex: 1 },
  descriptionContainer: {
    backgroundColor: '#141420', padding: 16,
    borderTopWidth: 1, borderTopColor: '#222236',
  },
  descriptionLabel: {
    color: '#B8C0FF', fontSize: 12, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8,
  },
  descriptionInput: {
    backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#7209B7',
    borderRadius: 12, padding: 12, color: '#fff', fontSize: 14,
    minHeight: 70, textAlignVertical: 'top',
  },
  charCount: { color: '#444', fontSize: 11, textAlign: 'right', marginTop: 4 },
});