import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore,  collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore
// const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
// async function accessSecretVersion(name) {
//   const client = new SecretManagerServiceClient();   

//   const [version] = await client.accessSecretVersion({
//       name: name,
//   });
//   const payload = version.payload.data.toString('utf8');
//   return payload;
// }
// const secretName = 'projects/684375759874/secrets/NEXT_PUBLIC_FIREBASE_API_KEY';
// async function getFirebaseConfig() {
//   const apiKey = await accessSecretVersion(secretName);
//   console.log("We built this city.... Yeah We built ths city")
//   console.log(apiKey)

//   return firebaseConfig;
// }
console.log('process.env.Pigs')
console.log(process.env.Pigs)
console.log('process.env.er')
console.log(process.env.er)
console.log('process.env.bigTest')
console.log(process.env.bigTest)
console.log('process.env.smallTest')
console.log(process.env.smallTest)

console.log("Did we build the city on rock and roll?")
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)

console.log(process.env.bigTest)
console.log(process.env.smallTest)
console.log(process.env.STORAGE_BUCKET)
console.log("Did we build the city on rock and roll?")
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
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