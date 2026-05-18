import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import app from './firebase-config';
import { createWithId } from './firebase-database';
 
const auth = getAuth(app);
 
export default auth;
 
export const signup = async (email: string, password: string, nickname: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  console.log("./services/firebase-auth.ts - signup function", result);
 
  const uid = result?.user?.uid;
  if (uid) {
    await createWithId("users", uid, { uid: uid, nickname: nickname });
  }
 
  return result;
};
 
// ✅ La fonction retourne maintenant la promesse
// => le "await login(...)" dans login.tsx attend bien la réponse de Firebase
// => auth.currentUser est bien rempli après le await
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then(function (result) {
      console.log("./services/firebase-auth.ts - login function - SUCCESS", result);
      return result;
    })
    .catch(function (error) {
      console.log("./services/firebase-auth.ts - login function - ERROR : ", error.code);
      throw error; // ✅ On relance l'erreur pour que le catch dans login.tsx la reçoive
    });
};
 
export const logout = () => {
  return signOut(auth).then(function () {
    console.log("./services/firebase-auth.ts - logout function", "Déconnecté.e !");
  });
};