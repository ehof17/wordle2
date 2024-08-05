import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,  collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "wordle-5x5.firebaseapp.com",
  projectId: "wordle-5x5",
  storageBucket: "wordle-5x5.appspot.com",
  messagingSenderId: "684375759874",
  appId: "1:684375759874:web:e11025f57ef8b2ac2d5b1b",
  measurementId: "G-RHFNRJDMEX"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Initialize Firestore

const fetchScores = async () => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(collection(db, 'scores'), where('date', '>=', today));
    const querySnapshot = await getDocs(q);
    const scoresList = querySnapshot.docs.map(doc => doc.data());
    return scoresList;
 
    
  };
export { db, fetchScores };