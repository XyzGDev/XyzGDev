

// firebase.js
import { sendPasswordResetEmail } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔹 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_-cJEa19T4GHdSymxjkxq6gyAx9EyrXU",
  authDomain: "loginsystemofgameweb.firebaseapp.com",
  projectId: "loginsystemofgameweb",
  storageBucket: "loginsystemofgameweb.firebasestorage.app",
  messagingSenderId: "975159958103",
  appId: "1:975159958103:web:cfbb51e409280819c8e112"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ================== HELPERS ==================

async function upsertUser(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      purchased_games: {},
      last_login_at: Date.now()
    });
  } else {
    await updateDoc(ref, {
      last_login_at: Date.now()
    });
  }
}

// ================== AUTH ==================

export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);

  await upsertUser(result.user.uid);

  // 🔥 FORCE HOME PAGE
  window.location.href = "index.html";
}


export async function registerUser(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  alert("Verification email sent. Please verify before login.");
}

export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  if (!cred.user.emailVerified) {
    alert("Please verify your email first.");
    await signOut(auth);
    return;
  }

  await upsertUser(cred.user.uid);

  // 🔥 FORCE HOME PAGE
  window.location.href = "index.html";
}


export function checkAuth(callback) {
  onAuthStateChanged(auth, callback);
}

export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

export async function getUserData(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function forgotPassword(email) {
  if (!email) {
    alert("Please enter your email first.");
    return;
  }

  await sendPasswordResetEmail(auth, email);
  alert("Password reset email sent.");
}
