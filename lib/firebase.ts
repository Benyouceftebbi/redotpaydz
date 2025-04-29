import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase with error handling
let app
let db

try {
  console.log("Initializing Firebase with config:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    // Don't log the API key for security reasons
  })

  app = initializeApp(firebaseConfig)
  db = getFirestore(app)

  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Error initializing Firebase:", error)
  throw new Error("Failed to initialize Firebase. Check your configuration.")
}

export { db }
