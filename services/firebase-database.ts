import { get, getDatabase, ref, set } from 'firebase/database';
import app from './firebase-config';

const database = getDatabase(app);

export const createWithId = (path: string, id: string, data: any): Promise<void> => {
  return set(ref(database, `/${path}/${id}`), data);
};

export const getById = (path: string, id: string): Promise<any> => {
  return get(ref(database, `/${path}/${id}`)).then(snap => snap.val());
};

