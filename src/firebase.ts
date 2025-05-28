// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importe outros serviços Firebase que você possa precisar no futuro, por exemplo:
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOUYFiymHJ8j-XPrQUcj7ih-yxIsQnru8", // Sua chave de API específica
  authDomain: "conecta-sxs-site.firebaseapp.com",
  projectId: "conecta-sxs-site",
  storageBucket: "conecta-sxs-site.firebasestorage.app",
  messagingSenderId: "512213123091",
  appId: "1:512213123091:web:6c8b24f7b7ce7ae21bbfe6",
  measurementId: "G-SH1946RZ2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const db = getFirestore(app); // Exemplo se você for usar Firestore
// const auth = getAuth(app); // Exemplo se você for usar Authentication

// Exporte as instâncias que você usará em outras partes do seu aplicativo
export { app, analytics /*, db, auth */ };