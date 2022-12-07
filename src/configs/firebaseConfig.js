import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyDRQTyNvgMNENz1AwFeNngEjcOV1WM3oTA',
    authDomain: 'reactnative-5b22f.firebaseapp.com',
    databaseURL: 'https://reactnative-5b22f-default-rtdb.firebaseio.com',
    projectId: 'reactnative-5b22f',
    storageBucket: 'reactnative-5b22f.appspot.com',
    messagingSenderId: '236743556994',
    appId: '1:236743556994:web:85fdbf8ac722bdfc75199b',
    measurementId: 'G-82DREJ5KE9'
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
