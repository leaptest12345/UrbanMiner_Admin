import { ref, remove, set, update, onValue } from 'firebase/database';

import * as Config from '../../configs/index';

export const buy_item_list_table = 'BUY_ITEM_LIST';
export const sell_item_list_table = 'SELL_ITEM_LIST';
export const packing_item_list_table = 'PACKING_ITEM_LIST';

export const getTotalInvoices = async (userId, type) => {
    let invoiceRef;

    if (type == 'CONTACTS') {
        invoiceRef = ref(Config.database, `/CONTACTS/${userId}`);
    } else if (type == 'BUY') {
        invoiceRef = ref(Config.database, `/BUY_ITEM_LIST/${userId}`);
    } else if (type == 'SELL') {
        invoiceRef = ref(Config.database, `/SELL_ITEM_LIST/${userId}`);
    } else if (type == 'PACKING') {
        invoiceRef = ref(Config.database, `/PACKING_ITEM_LIST/${userId}`);
    } else if (type == 'SALES') {
        invoiceRef = ref(Config.database, `/SALES_CONTRACT_LIST/${userId}`);
    } else {
        invoiceRef = ref(Config.database, `/INVENTORY_ITEMS/${userId}`);
    }

    let totalContacts = 0;

    onValue(invoiceRef, (snapshot) => {
        const contacts = snapshot.val();

        if (contacts) {
            console.log('contacts', type, Object.values(contacts));
            totalContacts = Object.values(contacts).length;
        } else {
            totalContacts = 0;
        }
    });

    return totalContacts;
};

export const deleteItem = async (userId, type, id) => {
    let invoiceRef;

    if (type == 'CONTACTS') {
        invoiceRef = ref(Config.database, `/CONTACTS/${userId}/${id}`);
    } else if (type == 'BUY') {
        invoiceRef = ref(Config.database, `/BUY_ITEM_LIST/${userId}/${id}`);
    } else if (type == 'SELL') {
        invoiceRef = ref(Config.database, `/SELL_ITEM_LIST/${userId}/${id}`);
    } else if (type == 'PACKING') {
        invoiceRef = ref(Config.database, `/PACKING_ITEM_LIST/${userId}/${id}`);
    } else if (type == 'SALES') {
        invoiceRef = ref(Config.database, `/SALES_CONTRACT_LIST/${userId}/${id}`);
    } else {
        invoiceRef = ref(Config.database, `/INVENTORY_ITEMS/${userId}/${id}`);
    }

    await remove(invoiceRef);
};

export const getList = async (userId, type) => {
    let invoiceRef;

    console.log('type', type);

    if (type == 'CONTACT') {
        invoiceRef = ref(Config.database, `/CONTACTS/${userId}`);
    } else if (type == 'BUY') {
        invoiceRef = ref(Config.database, `/BUY_ITEM_LIST/${userId}`);
    } else if (type == 'SELL') {
        invoiceRef = ref(Config.database, `/SELL_ITEM_LIST/${userId}`);
    } else if (type == 'PACKING') {
        invoiceRef = ref(Config.database, `/PACKING_ITEM_LIST/${userId}`);
    } else if (type == 'SALES') {
        invoiceRef = ref(Config.database, `/SALES_CONTRACT_LIST/${userId}`);
    } else {
        invoiceRef = ref(Config.database, `/INVENTORY_ITEMS/${userId}`);
    }

    let list = [];

    onValue(invoiceRef, (snapshot) => {
        const contacts = snapshot.val();

        if (contacts) {
            list = Object.values(contacts);
        } else {
            list = [];
        }
    });

    return list;
};

export const getContactDetail = async (userId, itemId) => {
    const invoiceRef = ref(Config.database, `/CONTACTS/${userId}/${itemId}`);

    let detail = {};

    onValue(invoiceRef, (snapshot) => {
        const contacts = snapshot.val();

        if (contacts) {
            detail = contacts;
        } else {
            detail = {};
        }
    });

    return detail;
};

export const buy_item_table = 'BUY_ITEM';
export const sell_item_table = 'SELL_ITEM';
export const packing_item_table = 'PACKING_ITEM';

export const getItemDetail = async (itemId, type) => {
    const path =
        type == 'BUY' ? buy_item_table : type == 'SELL' ? sell_item_table : packing_item_table;

    const invoiceRef = ref(Config.database, `/${path}/${itemId}`);

    let detail = {};

    onValue(invoiceRef, (snapshot) => {
        const values = snapshot.val();

        if (values) {
            detail = values;
        } else {
            detail = {};
        }
    });

    return detail;
};
