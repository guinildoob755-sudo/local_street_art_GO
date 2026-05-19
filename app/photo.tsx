import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const unstable_settings = {
  anchor: '(tabs)', // ← c'est lui qui gère
};

export default function PhotoScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();

  // 📸 PRENDRE PHOTO
  const takePhoto = async () => {
    const camera = cameraRef.current;

    if (!camera) return;

    const result = await camera.takePictureAsync();

    setPhoto(result.uri);
  };

  // ☁️ UPLOAD FIREBASE
  const uploadPhoto = async () => {
    if (!photo) return;

    try {
      setUploading(true);

      const response = await fetch(photo);
      const blob = await response.blob();

      const filename = `artworks/${Date.now()}.jpg`;

      const storage = getStorage();

      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      console.log("Photo uploadée :", downloadURL);

      // ✅ APRÈS
      Alert.alert(
        "Succès !",
        "Votre œuvre a été ajoutée.",
        [
          {
            text: "OK",
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (err) {
      console.log("Erreur upload :", err);

      Alert.alert(
        "Erreur",
        "L'upload a échoué."
      );
    } finally {
      setUploading(false);
    }
  };

  if (!permission) return <View />;


  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>
          Permission caméra requise
        </Text>

        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "cyan", marginTop: 10 }}>
            Autoriser la caméra
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing="back"
        >
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              📸 Prendre photo
            </Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.publish}
            onPress={uploadPhoto}
            disabled={uploading}
          >
            <Text style={{ color: "#fff" }}>
              {uploading
                ? "Upload..."
                : "Publier"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPhoto(null)}
            style={styles.retake}
          >
            <Text style={{ color: "#fff" }}>
              Reprendre
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },

  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },

  button: {
    backgroundColor: "#7209B7",
    padding: 16,
    borderRadius: 16,
  },

  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 320,
    height: 420,
    borderRadius: 20,
  },

  publish: {
    marginTop: 20,
    backgroundColor: "#F72585",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  retake: {
    marginTop: 15,
  },
});