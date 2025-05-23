
import { initializeApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAfBhcBEz22dzPKY6JdWqq5RLcPOJMFTr8",
  authDomain: "myartistry-232c3.firebaseapp.com",
  projectId: "myartistry-232c3",
  storageBucket: "myartistry-232c3.firebasestorage.app",
  messagingSenderId: "898130466386",
  appId: "1:898130466386:web:cfe32ed8710ac27818f18b",
  measurementId: "G-Z2GJ0RBHDJ",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

// Enable offline persistence (optional)
if (typeof window !== "undefined") {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === "failed-precondition") {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn("Persistence failed: Multiple tabs open")
      } else if (err.code === "unimplemented") {
        // The current browser does not support persistence
        console.warn("Persistence not supported by this browser")
      }
    })
  } catch (err) {
    console.error("Error enabling persistence:", err)
  }
}

export { db, auth, googleProvider }
