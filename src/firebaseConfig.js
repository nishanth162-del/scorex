// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC79As1CUaQI8APiDV281fManBWkynXCew",
  authDomain: "scorex18.firebaseapp.com",
  projectId: "scorex18",
  storageBucket: "scorex18.firebasestorage.app",
  messagingSenderId: "341558279616",
  appId: "1:341558279616:web:2d716a4cdcfdd15ad69c25",
  measurementId: "G-60MLCN0Q29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);  // Correctly initialize auth
const db1 = getFirestore(app);  // Initialize Firestore for database use
const db = getDatabase(app);
// Export auth and db so they can be used in other parts of the app
export { auth, db1 ,db};
