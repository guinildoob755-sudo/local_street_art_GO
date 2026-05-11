import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import app from './firebase-config';
const auth = getAuth(app);

export const signUp = async (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password).then(function(userCredential) {
        // Signed in 
        const user = userCredential.user;
        console.log('User created successfully:', user);
        // ...
    }   ).catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error creating user:', errorCode, errorMessage);
        // ..
    });
}