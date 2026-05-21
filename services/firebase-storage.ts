import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import app from './firebase-config';
import { create } from './firebase-database';

const storage = getStorage(app);

export const sendPhoto = async (
  uid: string,
  uri: string,
  coords: { lat: number; lng: number },
  description: string = ''  // ← ajout
) => {
  try {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `users/${uid}/photos/${id}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    await create('artworks', {
      id,
      url: downloadURL,
      lat: coords.lat,
      lng: coords.lng,
      uid,
      createdAt: Date.now(),
      description,  // ← ajout
    });

  } catch (err) {
    console.error('sendPhoto error:', err);
  }
};