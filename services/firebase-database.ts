import { get, getDatabase, push, ref, set } from 'firebase/database';
import app from './firebase-config';

const database = getDatabase(app);

const cleanData = (data: any) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  );
};

export const createWithId = (path: string, id: string, data: any): Promise<void> => {
  const safeData = cleanData(data);
  return set(ref(database, `${path}/${id}`), safeData);
};

export const getById = (path: string, id: string): Promise<any> => {
  return get(ref(database, `${path}/${id}`)).then((snap) => snap.val());
};

// ← ajout : créer une entrée avec ID auto
export const create = (path: string, data: any): Promise<void> => {
  const safeData = cleanData(data);
  return push(ref(database, path), safeData).then(() => {});
};

// ← ajout : récupérer toutes les entrées d'un path
export const getAll = (path: string): Promise<any[]> => {
  return get(ref(database, path)).then((snap) => {
    if (!snap.exists()) return [];
    return Object.values(snap.val());
  });
};