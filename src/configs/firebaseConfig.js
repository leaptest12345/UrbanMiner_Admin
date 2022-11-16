import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBqjAaXB97aTT1LwTdXRly_zCg10Nt74yg",
  authDomain: "urbanminer-86fa7.firebaseapp.com",
  databaseURL: "https://urbanminer-86fa7-default-rtdb.firebaseio.com",
  projectId: "urbanminer-86fa7",
  storageBucket: "urbanminer-86fa7.appspot.com",
  messagingSenderId: "656599383295",
  appId: "1:656599383295:web:6ff5b2409b558dfee3e0ca",
  measurementId: "G-0H10LQFBNC"
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);