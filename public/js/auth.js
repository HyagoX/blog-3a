import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKmlgGppmrY45BkiVFWU6c2TXjpoimh24",
    authDomain: "blog-3a-c1a12.firebaseapp.com",
    projectId: "blog-3a-c1a12",
    storageBucket: "blog-3a-c1a12.appspot.com",
    messagingSenderId: "191795743732",
    appId: "1:191795743732:web:5488bf2afbf59cf0a307a1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail 
};