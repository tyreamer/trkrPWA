import { auth } from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    auth.currentUser.updatePassword(password);

//Current User
export const currentUser = () => {
    return auth.currentUser != null ? auth.currentUser.displayName : ''
}
    

//Update Username
export const doUsernameUpdate = (username) =>
    auth.currentUser.updateProfile({ displayName: username });
