'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).then(async (userCredential) => {
    if (userCredential && userCredential.user) {
      const user = userCredential.user;
      const firestore = getFirestore(authInstance.app);
      const judgeRef = doc(firestore, 'judges', user.uid);

      try {
        const docSnap = await getDoc(judgeRef);
        if (!docSnap.exists()) {
          // Document doesn't exist, so create it.
          const judgeData = {
            id: user.uid,
            name: 'Anonymous Judge', // Default name for anonymous user
            email: `${user.uid}@anonymous.judge`, // Placeholder email
            createdAt: serverTimestamp(),
          };

          // Use non-blocking set with error handling but await it here to ensure it exists for the name check
          await setDoc(judgeRef, judgeData).catch(error => {
            errorEmitter.emit(
              'permission-error',
              new FirestorePermissionError({
                path: judgeRef.path,
                operation: 'create',
                requestResourceData: judgeData,
              })
            );
          });
        }
      } catch (error) {
        // This catch block handles errors from getDoc, which should also be reported.
        console.error("Error checking for judge document:", error);
         const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: judgeRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
      }
    }
  }).catch(error => {
    // This handles errors from the signInAnonymously call itself
    console.error("Anonymous sign-in failed:", error);
  });
}


/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
