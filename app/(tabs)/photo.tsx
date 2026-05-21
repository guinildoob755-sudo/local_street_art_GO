// Import React Native components
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Import Expo Camera components and hooks
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';

// Import React hooks
import {
  useEffect,
  useState,
  useRef,
} from 'react';

// Import Firebase storage helper
import { sendPhoto } from '@/services/firebase-storage';

// Import Redux hook
import { useSelector } from 'react-redux';

// Import Redux store type
import { RootState } from '@/services/store';

// Import Expo Location API
import * as Location from 'expo-location';

// Import Expo Router navigation
import { useRouter } from 'expo-router';

/**
 * CameraScreen Component
 *
 * Allows users to:
 * - Take photos
 * - Add artwork descriptions
 * - Retrieve GPS location
 * - Upload photos to Firebase
 */
export default function CameraScreen() {

  /**
   * Current authenticated user ID
   */
  const { uid } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * Camera direction state
   *
   * Possible values:
   * - "back"
   * - "front"
   */
  const [facing, setFacing] =
    useState<CameraType>('back');

  /**
   * Camera permission state
   */
  const [permission, requestPermission] =
    useCameraPermissions();

  /**
   * Stores the latest captured photo URI
   */
  const [lastPhoto, setLastPhoto] =
    useState<string | null>(null);

  /**
   * Loading state for async operations
   */
  const [loading, setLoading] =
    useState<boolean>(false);

  /**
   * Stores location permission errors
   */
  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  /**
   * Artwork description entered by the user
   */
  const [description, setDescription] =
    useState<string>('');

  /**
   * Camera reference
   *
   * Used to access camera methods
   * مثل takePictureAsync()
   */
  const cameraRef =
    useRef<CameraView>(null);

  /**
   * Expo Router instance
   */
  const router = useRouter();

  /**
   * Request location permission
   * when the screen mounts.
   */
  useEffect(() => {

    async function getCurrentLocation() {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      // Handle denied permission
      if (status !== 'granted') {
        setErrorMsg(
          'Permission to access location was denied'
        );
      }
    }

    getCurrentLocation();

  }, []);

  /**
   * Request camera permission
   * when the component mounts.
   */
  useEffect(() => {

    if (!permission || !permission.granted) {
      requestPermission();
    }

  }, []);

  /**
   * Loading state while permission is undefined
   */
  if (!permission) {
    return <View />;
  }

  /**
   * Permission denied screen
   */
  if (!permission.granted) {
    return (
      <View style={styles.container}>

        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>

        <Pressable onPress={requestPermission}>
          <Text>Permission</Text>
        </Pressable>

      </View>
    );
  }

  /**
   * toggleCameraFacing()
   *
   * Switches between front and back camera.
   */
  function toggleCameraFacing() {

    setFacing((current) =>
      current === 'back'
        ? 'front'
        : 'back'
    );
  }

  /**
   * takePhoto()
   *
   * Captures an image using the device camera.
   */
  async function takePhoto() {

    // Prevent execution if camera is unavailable
    if (!cameraRef.current) return;

    try {

      setLoading(true);

      /**
       * Capture image
       */
      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });

      /**
       * Save captured image URI
       */
      setLastPhoto(photo?.uri ?? null);

    } catch (err) {

      console.error(
        'Failed to take photo:',
        err
      );

    } finally {

      setLoading(false);
    }
  }

  /**
   * sendPhotoToFirebase()
   *
   * Uploads the photo to Firebase
   * with:
   * - GPS coordinates
   * - Artwork description
   */
  async function sendPhotoToFirebase() {

    // Prevent upload if no photo exists
    if (!lastPhoto) return;

    try {

      setLoading(true);

      /**
       * Get current device position
       */
      const location =
        await Location.getCurrentPositionAsync({});

      const {
        latitude,
        longitude,
      } = location.coords;

      /**
       * Upload photo to Firebase
       */
      await sendPhoto(
        uid,
        lastPhoto,
        {
          lat: latitude,
          lng: longitude,
        },
        description
      );

      /**
       * Navigate back to tabs screen
       */
      router.replace('/(tabs)');

    } catch (err) {

      console.error(
        'Failed to send photo:',
        err
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      {!lastPhoto ? (

        /**
         * CAMERA VIEW
         */
        <>
          {/* Camera preview */}
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          />

          {/* Bottom controls */}
          <View style={styles.buttonContainer}>

            {/* Flip camera button */}
            <Pressable
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>
                Flip
              </Text>
            </Pressable>

            {/* Capture button */}
            <Pressable
              style={styles.shutterButton}
              onPress={takePhoto}
            >
              <View style={styles.shutterInner} />
            </Pressable>

            {/* Empty placeholder */}
            <View style={styles.button} />
          </View>
        </>

      ) : (

        /**
         * PHOTO PREVIEW SCREEN
         */
        <View style={styles.previewContainer}>

          {/* Preview wrapper */}
          <View style={styles.photoWrapper}>
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={cameraRef}
            />
          </View>

          {/* Description form */}
          <View style={styles.descriptionContainer}>

            <Text style={styles.descriptionLabel}>
              Add a description
            </Text>

            {/* Description input */}
            <TextInput
              style={styles.descriptionInput}

              placeholder="Describe your artwork..."
              placeholderTextColor="#555"

              value={description}
              onChangeText={setDescription}

              multiline

              maxLength={200}
            />

            {/* Character counter */}
            <Text style={styles.charCount}>
              {description.length}/200
            </Text>
          </View>

          {/* Bottom action buttons */}
          <View style={styles.buttonContainer}>

            {/* Retake photo */}
            <Pressable
              style={styles.button}
              onPress={() => {
                setLastPhoto(null);
                setDescription('');
              }}
            >
              <Text style={styles.text}>
                Retake
              </Text>
            </Pressable>

            {/* Confirm upload */}
            <Pressable
              style={styles.shutterButton}
              onPress={sendPhotoToFirebase}
            >
              <Text style={styles.confirmText}>
                {loading ? '...' : '✓'}
              </Text>
            </Pressable>

            {/* Empty placeholder */}
            <View style={styles.button} />
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({

  /**
   * Main container
   */
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  /**
   * Permission message
   */
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },

  /**
   * Camera preview
   */
  camera: {
    position: 'relative',
    zIndex: 0,
    height: '100%',
    width: '100%',
  },

  /**
   * Bottom controls container
   */
  buttonContainer: {
    position: 'absolute',
    bottom: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',

    paddingHorizontal: 48,
  },

  /**
   * Generic button container
   */
  button: {
    flex: 1,
    alignItems: 'center',
  },

  /**
   * Button text
   */
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  /**
   * Main capture button
   */
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,

    borderWidth: 4,
    borderColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Inner circle of shutter button
   */
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },

  /**
   * Confirm button text
   */
  confirmText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  /**
   * Preview screen container
   */
  previewContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  /**
   * Preview image wrapper
   */
  photoWrapper: {
    flex: 1,
  },

  /**
   * Description section container
   */
  descriptionContainer: {
    backgroundColor: '#141420',

    padding: 16,

    borderTopWidth: 1,
    borderTopColor: '#222236',
  },

  /**
   * Description label
   */
  descriptionLabel: {
    color: '#B8C0FF',
    fontSize: 12,
    fontWeight: '700',

    letterSpacing: 1,

    textTransform: 'uppercase',

    marginBottom: 8,
  },

  /**
   * Description text input
   */
  descriptionInput: {
    backgroundColor: '#0D0D0D',

    borderWidth: 1,
    borderColor: '#7209B7',

    borderRadius: 12,

    padding: 12,

    color: '#fff',
    fontSize: 14,

    minHeight: 70,

    textAlignVertical: 'top',
  },

  /**
   * Character counter
   */
  charCount: {
    color: '#444',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
});