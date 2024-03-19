import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyCPpB5u96_fKUOhrpLfTD6Lhdxs6-pCSGU',
    authDomain: 'urbanminer-49466.firebaseapp.com',
    databaseURL: 'https://urbanminer-49466-default-rtdb.firebaseio.com',
    projectId: 'urbanminer-49466',
    storageBucket: 'urbanminer-49466.appspot.com',
    messagingSenderId: '281440786865',
    appId: '1:281440786865:web:0922bf95a2e82242510590',
    measurementId: 'G-0NR3F1Z5HB'
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };
