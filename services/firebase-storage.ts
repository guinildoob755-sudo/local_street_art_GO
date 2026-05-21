/**
 * Firebase Storage Services
 *
 * This file handles:
 * - Uploading photos to Firebase Storage
 * - Generating downloadable image URLs
 * - Saving artwork metadata in Firebase Database
 */

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'firebase/storage';

import app from './firebase-config';
import { create } from './firebase-database';

/**
 * Initialize Firebase Storage
 */
const storage = getStorage(app);

/**
 * Upload a photo and save its metadata
 *
 * Workflow:
 * 1. Generate a unique image ID
 * 2. Convert local image URI into a Blob
 * 3. Upload the image to Firebase Storage
 * 4. Retrieve the public download URL
 * 5. Save artwork information in Firebase Database
 *
 * @param uid - User unique identifier
 * @param uri - Local image URI
 * @param coords - GPS coordinates of the artwork
 * @param description - Optional artwork description
 */
export const sendPhoto = async (
  uid: string,
  uri: string,
  coords: { lat: number; lng: number },
  description: string = ''
) => {

  try {

    /**
     * Generate a unique image ID
     * Combines timestamp + random string
     */
    const id = `${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    /**
     * Fetch the local image file
     */
    const response = await fetch(uri);

    /**
     * Convert the image into a Blob
     * Required for Firebase upload
     */
    const blob = await response.blob();

    /**
     * Define Firebase Storage path
     *
     * Example:
     * users/user123/photos/image456
     */
    const storageRef = ref(
      storage,
      `users/${uid}/photos/${id}`
    );

    /**
     * Upload the image file to Firebase Storage
     */
    await uploadBytes(storageRef, blob);

    /**
     * Retrieve the downloadable public URL
     */
    const downloadURL = await getDownloadURL(storageRef);

    /**
     * Save artwork metadata in Firebase Database
     */
    await create('artworks', {

      // Artwork unique ID
      id,

      // Public image URL
      url: downloadURL,

      // GPS coordinates
      lat: coords.lat,
      lng: coords.lng,

      // Owner UID
      uid,

      // Upload timestamp
      createdAt: Date.now(),

      // Optional artwork description
      description,
    });

  } catch (err) {

    /**
     * Error handling
     */
    console.error('sendPhoto error:', err);
  }
};