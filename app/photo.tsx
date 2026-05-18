import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
export default function Photo() {
  // ✅ TYPE CORRIGÉ ICI (IMPORTANT)
  const cameraRef = useRef<CameraView | null>(null);
 
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
 
  if (!permission) return <View />;
 
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Permission caméra requise</Text>
 
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "cyan", marginTop: 10 }}>
            Autoriser la caméra
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  // 📸 TAKE PHOTO (SAFE)
  const takePhoto = async () => {
    const camera = cameraRef.current;
    if (!camera) return;
 
    const result = await camera.takePictureAsync();
    setPhoto(result.uri);
  };
 
  return (
    <View style={styles.container}>
      {!photo ? (
        // 🎥 CAMERA LIVE
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={{ color: "#fff", fontSize: 18 }}>
              📸 Prendre photo
            </Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        // 🖼️ PREVIEW PHOTO
        <View style={styles.preview}>
          <Image source={{ uri: photo }} style={styles.image} />
 
          <TouchableOpacity
            style={styles.publish}
            onPress={() => alert("Photo publiée !")}
          >
            <Text style={{ color: "#fff" }}>Publier</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            onPress={() => setPhoto(null)}
            style={styles.retake}
          >
            <Text style={{ color: "#fff" }}>Reprendre</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
 
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
 
  button: {
    marginBottom: 40,
    backgroundColor: "#F72585",
    padding: 15,
    borderRadius: 30,
  },
 
  preview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
 
  image: {
    width: 320,
    height: 450,
    borderRadius: 20,
  },
 
  publish: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
  },
 
  retake: {
    marginTop: 10,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
  },
});
 
 