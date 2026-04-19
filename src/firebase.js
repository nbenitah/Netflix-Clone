
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signOut,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAZj3w95DFK-rHZxKcdk8YqgYzeVKItqiw",
  authDomain: "netflix-clone-7b785.firebaseapp.com",
  projectId: "netflix-clone-7b785",
  storageBucket: "netflix-clone-7b785.firebasestorage.app",
  messagingSenderId: "228502067812",
  appId: "1:228502067812:web:661ffb598a8444beb99d71"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup=async(name, email, password)=>{
    try{
       const res = await createUserWithEmailAndPassword(auth, email,
         password);
         const user = res.user;
         await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
         });

         return user;

    }catch(error){
        console.error(error);
        throw error;
    }
}
const login=async(email, password)=>{
    try{
         const credentials = await signInWithEmailAndPassword(auth, email, password);

         return credentials.user;

    }catch(error){
        console.error(error);
        throw error;
    }
}
const logout=async()=>{
    await signOut(auth);
}

export {app, auth, db, signup, login, logout};