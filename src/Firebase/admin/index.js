import { equalTo, get, onValue, orderByChild, query, ref, set, update } from 'firebase/database';
import { v4 as uuid } from 'uuid';

import * as Config from '../../configs/index';
import { formateData } from 'util/formateData';

// interface Admin {
//     ID: string;
//     adminLevel: number;
//     email: string;
//     SUB_USERS: string[];
//     role: {
//         permissionStatus: {
//             addAdmin: boolean;
//             addProduct: boolean;
//             feedback: boolean;
//             item: boolean;
//             payment: boolean;
//             pdfDetali: boolean;
//             priceSheet: boolean;
//             privacy: boolean;
//             term: boolean;
//             user: boolean;
//         };
//         roleName: string;
//     };
// }

export const getMyDetails = async () => {
    const id = await localStorage.getItem('userID');
    return getAdmin(id);
};

export const getAdmin = async (id) => {
    const adminRef = ref(Config.database, `/ADMIN/USERS/${id}`);
    let data = null;
    await onValue(adminRef, (snapshot) => {
        const results = snapshot.val();
        data = results;
    });

    return data;
};

export const createAdmin = async (email, adminLevel, permissionStatus) => {
    const userUniqueId = uuid();

    const adminRef = ref(Config.database, `/ADMIN/USERS/${userUniqueId}`);

    await set(adminRef, {
        ID: userUniqueId,
        email: email,
        adminLevel: adminLevel,
        role: {
            roleName: 'admin',
            PermissionStatus: permissionStatus
        }
    });
};

export const updateAdminUser = async (id, data) => {
    const adminRef = ref(Config.database, `/ADMIN/USERS/${id}`);
    await update(adminRef, data);
};

export const findAdminByEmail = async (email) => {
    let admin = null;
    const userRef = ref(Config.database, '/ADMIN/USERS');
    const userQuery = query(userRef, orderByChild('email'), equalTo(email));

    const snapshot = await get(userQuery);

    const adminData = snapshot.val();

    if (adminData) {
        const adminId = Object.keys(adminData)[0];
        const result = adminData[adminId];
        admin = result;
    }

    console.log('findAadminByEmail: ', admin);
    return admin;
};

export const getAdminSubUsers = async (id) => {
    const subUserRef = ref(Config.database, `/ADMIN/USERS/${id}/SUB_USERS`);
    let subUsers = null;

    await onValue(subUserRef, (snapshot) => {
        subUsers = snapshot.val();
    });

    return formateData(subUsers);
};
