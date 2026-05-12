import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import app from './firebase-config';
import { createWithId } from './firebase-database';

const auth = getAuth(app);

export default auth;

export const signup = (email:string, password:string, nickname: string) => {
  createUserWithEmailAndPassword(auth, email, password).then(function(result) {
    console.log("./services/firebase-auth.ts - signup function", result);
    const uid = result?.user?.uid;
    if(uid) {
      createWithId("users",uid, {uid: uid, nickname:  nickname})    
    }
  });
};

export const login = (email:string, password:string, nickname: string) => {
  createUserWithEmailAndPassword(auth, email, password).then(function(result) {
    console.log("./services/firebase-auth.ts - login function", result);
    const uid = result?.user?.uid;
    if(uid) {
      createWithId("users",uid, {uid: uid, nickname:  nickname})    
    }
  });
};