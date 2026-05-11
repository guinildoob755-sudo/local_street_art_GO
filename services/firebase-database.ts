import {getDatabase, ref, set} from 'firebase/database';
import app from './firebase-config';

const database = getDatabase(app);

export const 