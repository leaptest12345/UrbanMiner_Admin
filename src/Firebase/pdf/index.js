import { ref, onValue } from 'firebase/database';

import * as Config from '../../configs/index';

export const getSalesPdf = (userId, customerId, invoiceId) => {
    return new Promise(async (resolve) => {
        const SALES_PATH = `/PDF/user:${userId}/customer:${customerId}/salesContract:${invoiceId}`;

        const pdfRef = ref(Config.database, SALES_PATH);

        const callback = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve({
                    invoicePdf: data[1].url
                });
            } else {
                resolve(null);
            }
        };
        onValue(pdfRef, callback);
    });
};

export const getPdf = (userId, customerId, invoiceId) => {
    return new Promise(async (resolve) => {
        const pdfRef = ref(
            Config.database,
            `/PDF/user:${userId}/customer:${customerId}/buyAndSellId:${invoiceId}`
        );

        const callback = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve({
                    invoicePdf: data[1].url,
                    invoiceSummaryPdf: data[2].url
                });
            } else {
                resolve(null);
            }
        };
        onValue(pdfRef, callback);
    });
};
