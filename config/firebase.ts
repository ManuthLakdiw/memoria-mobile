// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// @ts-ignore
import {getReactNativePersistence, initializeAuth} from "@firebase/auth";
import {getFirestore} from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzmohUxGJjZ6DQSCbTvo_r9EYmVs3S1m0",
    authDomain: "memoria-app-73daa.firebaseapp.com",
    projectId: "memoria-app-73daa",
    storageBucket: "memoria-app-73daa.firebasestorage.app",
    messagingSenderId: "1052635223942",
    appId: "1:1052635223942:web:f155765648dffa55807e07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// for authentication
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// for database
export const db = getFirestore(app);