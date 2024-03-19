import { equalTo, get, orderByChild, query, ref } from 'firebase/database';

import * as Config from '../../../configs/index';

export const findUserByEmail = async (email) => {
    let user = null;
    const userRef = ref(Config.database, '/USERS');
    const userQuery = query(userRef, orderByChild('email'), equalTo(email));

    const snapshot = await get(userQuery);

    const userData = snapshot.val();

    if (userData) {
        const userId = Object.keys(userData)[0];
        const result = userData[userId];
        user = result;
    }

    console.log('findUserByEmail: ', user);
    return user;
};

export const getUserDetails = async (id) => {
    const userRef = ref(Config.database, `/USERS/${id}`);
    let data = null;

    await get(userRef).then((snapshot) => {
        const results = snapshot.val();
        data = results;
    });

    return data;
};
