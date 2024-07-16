import { equalTo, get, onValue, orderByChild, query, ref, update } from 'firebase/database';

import * as Config from '../../configs/index';
import { notify } from 'util/notify';
import { formateData } from 'util/formateData';

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

export const getAdminUserDetails = async (id) => {
    const userRef = ref(Config.database, `/ADMIN/USERS/${id}`);
    let data = null;

    await get(userRef).then((snapshot) => {
        const results = snapshot.val();
        data = results;
    });

    return data;
};
export const updateUserDetails = async (id, data) => {
    const userRef = ref(Config.database, `/USERS/${id}`);
    await update(userRef, data);
};

export const restoreUser = async (id) => {
    const myUserId = await localStorage.getItem('userID');

    if (id === myUserId) {
        notify("You can't delete own account", 0);
        return;
    }

    const userRef = ref(Config.database, `/USERS/${id}`);

    await update(userRef, {
        isDeleted: false
    });

    notify(`User has been Activated Successfully`, 1);
};

export const deleteUser = (id) => {
    const myUserId = localStorage.getItem('userID');
    if (id === myUserId) {
        notify("You can't delete own account", 0);
        return;
    }

    const userRef = ref(Config.database, `/USERS/${id}`);

    update(userRef, {
        isDeleted: true
    });

    notify(`User has been Deleted Successfully`, 0);
};

export const getUserListByAdminLevel = async () => {
    try {
        const id = await localStorage.getItem('userID');

        let userList = [];

        const userDetail = await getAdminUserDetails(id);

        const subUserRef = ref(Config.database, `/ADMIN/USERS/${id}/SUB_USERS`);

        if (userDetail?.adminLevel === 2) {
            await onValue(subUserRef, (snapshot) => {
                const data = snapshot.val();
                userList = formateData(data);
            });
        } else if (userDetail?.adminLevel === 1) {
            const userRef = ref(Config.database, '/USERS');
            await onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                userList = formateData(data);
            });
        } else {
            userList.push(userDetail);
        }

        return userList;
    } catch (error) {
        console.log(error);
    }
};

export const approveUser = async (id) => {
    const userRef = ref(Config.database, `/USERS/${id}`);
    await update(userRef, {
        isApproved: true
    });

    notify(`User has been Approved Successfully`, 1);
};

export const getAllMyUsers = async (givenUserId) => {
    const userRef = ref(Config.database, '/USERS');
    const userId = await localStorage.getItem('userID');

    const userQuery = query(
        userRef,
        orderByChild('referralByUserId'),
        equalTo(givenUserId ?? userId)
    );

    const snapshot = await get(userQuery);

    const users = snapshot.val();
    return formateData(users);
};
