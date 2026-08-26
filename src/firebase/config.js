import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {

    apiKey: "AIzaSyDeTIr5ZhcksKo1F2fPZLhK-PVWd8u6eeM",
    authDomain: "ai-interview-assistant-5a44c.firebaseapp.com",
    projectId: "ai-interview-assistant-5a44c",
    storageBucket: "ai-interview-assistant-5a44c.firebasestorage.app",
    messagingSenderId: "184499065830",
    appId: "1:184499065830:web:eedf1d46e2998eaa0f3c27"

};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;