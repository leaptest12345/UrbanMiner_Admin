import { ref, remove, get, onValue } from 'firebase/database';

import * as Config from '../../configs/index';

export const buy_item_list_table = 'BUY_ITEM_LIST';
export const sell_item_list_table = 'SELL_ITEM_LIST';
export const packing_item_list_table = 'PACKING_ITEM_LIST';

export const getAllInvoiceTotal = async (type) => {
    let contactRef = ref(Config.database, `/CONTACTS/`);
    let buyRef = ref(Config.database, `/BUY_ITEM_LIST/`);
    let sellRef = ref(Config.database, `/SELL_ITEM_LIST/`);
    let packingRef = ref(Config.database, `/PACKING_ITEM_LIST/`);
    let salesRef = ref(Config.database, `/SALES_CONTRACT_LIST/`);
    let inventoryRef = ref(Config.database, `/INVENTORY_ITEMS/`);

    let list = [contactRef, buyRef, sellRef, packingRef, salesRef, inventoryRef];

    let invoiceTotalList = [
        {
            type: 'CONTACTS',
            total: 0
        },
        {
            type: 'BUY',
            total: 0
        },
        {
            type: 'SELL',
            total: 0
        },
        {
            type: 'PACKING',
            total: 0
        },
        {
            type: 'SALES',
            total: 0
        },
        {
            type: 'INVENTORY',
            total: 0
        }
    ];

    list.forEach((invoiceRef, index) => {
        onValue(invoiceRef, (snapshot) => {
            const contacts = snapshot.val();

            if (contacts) {
                const values = Object.values(contacts);

                let count = 0;

                values.forEach((item) => {
                    if (item) {
                        const keys = Object.keys(item);

                        count = count + keys.length;
                    }
                });

                invoiceTotalList[index].total = count;
            } else {
                invoiceTotalList[index].total = 0;
            }
        });
    });

    return invoiceTotalList;
};

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

export const getItemDetail = async (userId, itemId, type) => {
    const path =
        type === 'BUY'
            ? buy_item_table
            : type === 'SELL'
            ? sell_item_table
            : type === 'SALES'
            ? `/SALES_CONTRACT_LIST/${userId}/`
            : packing_item_table;

    const invoiceRef = ref(Config.database, path + `/${itemId}`);

    try {
        const snapshot = await get(invoiceRef);
        const values = snapshot.val();

        if (values) {
            return type === 'SALES' ? values?.salesContractItemList ?? [] : values;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error fetching item detail:', error);
        throw error; // Propagate the error
    }
};
