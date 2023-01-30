import ImageModal from 'components/ImageModal/ImageModal';
import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { convertIntoDoller } from 'util/convertIntoDoller';
import { formateData } from 'util/formateData';
import styles from './styles';
export default function ViewDraft(props) {
    const [invoices, setInvoices] = useState([]);
    const [invoiceImg, setInvoiceImg] = useState([]);
    const { invoiceId, userId, customerId } = props.location.state;
    useEffect(() => {
        getDraftDetail();
    }, []);
    const getDraftDetail = () => {
        try {
            const refDetail = ref(database, `/INVOICE/${invoiceId}`);
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                setInvoices(data);
            });
            const refDeatail1 = ref(
                database,
                `/INVOICE_IMAGES/User:${userId}/customer:${customerId}/invoice:${invoiceId}`
            );
            onValue(refDeatail1, (snapShot) => {
                const arr = [];
                const data = formateData(snapShot.val());
                arr.push(data);
                setInvoiceImg(arr[0]);
            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div style={styles.div}>
            <div style={styles.subDiv}>
                {invoices &&
                    invoices.map((item, index) => {
                        if (item.WeightType == 'unit') {
                            return (
                                <div style={styles.div1}>
                                    <span>Unit:{item.unit}</span>
                                    <br />
                                    <span>Price:{item.price}</span>
                                    <br />
                                    <span>Total:{convertIntoDoller(item.Total)}</span>
                                    <br />
                                    <div style={styles.container}>
                                        {invoiceImg.length != 0 &&
                                            invoiceImg[parseInt(item.ID) - 1].map((item) => {
                                                if (item) {
                                                    return (
                                                        <ImageModal
                                                            url={item.url}
                                                            imageStyle={styles.img}
                                                        />
                                                    );
                                                }
                                            })}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div>
                                    <span>GrossWeight:{item.grossWeight}</span>
                                    <br />
                                    <span>TareWeight:{item.tareWeight}</span>
                                    <br />
                                    <span>NetWeight:{item.netWeight}</span>
                                    <br />
                                    <span>Price:{item.price}</span>
                                    <br />
                                    <span>Total:{convertIntoDoller(item.Total)}</span>
                                    <br />
                                    <div style={styles.container}>
                                        {invoiceImg.length != 0 &&
                                            invoiceImg[parseInt(item.ID) - 1].map((item) => {
                                                if (item) {
                                                    return (
                                                        <ImageModal
                                                            url={item.url}
                                                            imageStyle={styles.img}
                                                        />
                                                    );
                                                }
                                            })}
                                    </div>
                                </div>
                            );
                        }
                    })}
            </div>
            <div></div>
        </div>
    );
}
