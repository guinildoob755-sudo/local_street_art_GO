import { get, getDatabase, ref, set } from 'firebase/database';
import app from './firebase-config';

const database = getDatabase(app);

// 🔥 Nettoie les undefined (obligatoire pour Firebase)
const cleanData = (data: any) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  );
};

export const createWithId = (
  path: string,
  id: string,
  data: any
): Promise<void> => {
  const safeData = cleanData(data);

  return set(ref(database, `${path}/${id}`), safeData);
};

export const getById = (path: string, id: string): Promise<any> => {
  return get(ref(database, `${path}/${id}`)).then((snap) => snap.val());
};

