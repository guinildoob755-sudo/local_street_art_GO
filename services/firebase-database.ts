/**
 * Firebase Realtime Database Services
 *
 * This file provides helper functions to:
 * - Create data with a custom ID
 * - Create data with an automatic ID
 * - Retrieve one entry by ID
 * - Retrieve all entries from a path
 */

import { get, getDatabase, push, ref, set } from 'firebase/database';
import app from './firebase-config';

/**
 * Initialize Firebase Realtime Database
 */
const database = getDatabase(app);

/**
 * Cleans an object before sending it to Firebase
 *
 * Firebase does not allow undefined values.
 * This function replaces undefined with null.
 *
 * @param data - Object to sanitize
 *
 * @returns Cleaned object
 */
const cleanData = (data: any) => {

  return Object.fromEntries(

    Object.entries(data).map(([key, value]) => [
      key,

      // Replace undefined values with null
      value === undefined ? null : value,
    ])
  );
};

/**
 * Create or overwrite data with a custom ID
 *
 * Example:
 * users/user123
 *
 * @param path - Firebase database path
 * @param id - Custom document ID
 * @param data - Data to store
 *
 * @returns Promise<void>
 */
export const createWithId = (
  path: string,
  id: string,
  data: any
): Promise<void> => {

  // Clean data before saving
  const safeData = cleanData(data);

  // Save data at the specified path
  return set(ref(database, `${path}/${id}`), safeData);
};

/**
 * Retrieve a single entry by its ID
 *
 * Example:
 * getById("users", "user123")
 *
 * @param path - Firebase database path
 * @param id - Entry ID
 *
 * @returns Retrieved object
 */
export const getById = (
  path: string,
  id: string
): Promise<any> => {

  return get(ref(database, `${path}/${id}`))
    .then((snap) => snap.val());
};

/**
 * Create a new entry with an automatically generated ID
 *
 * Example:
 * posts/-Nx123456
 *
 * @param path - Firebase database path
 * @param data - Data to store
 *
 * @returns Promise<void>
 */
export const create = (
  path: string,
  data: any
): Promise<void> => {

  // Clean data before saving
  const safeData = cleanData(data);

  // Push generates a unique ID automatically
  return push(ref(database, path), safeData)
    .then(() => {});
};

/**
 * Retrieve all entries from a database path
 *
 * Example:
 * getAll("posts")
 *
 * @param path - Firebase database path
 *
 * @returns Array of all stored entries
 */
export const getAll = (
  path: string
): Promise<any[]> => {

  return get(ref(database, path)).then((snap) => {

    // Return an empty array if no data exists
    if (!snap.exists()) return [];

    // Convert Firebase object into an array
    return Object.values(snap.val());
  });
};