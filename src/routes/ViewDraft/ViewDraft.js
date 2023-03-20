import ImageModal from 'components/ImageModal/ImageModal';
import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { convertIntoDoller } from 'util/convertIntoDoller';
import { formateData } from 'util/formateData';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ToastContainer } from 'react-toastify';
import { useTheme } from 'react-jss';
import { style } from 'glamor';

export default function ViewDraft(props) {
    const theme = useTheme();
    const [invoices, setInvoices] = useState([]);
    const [invoiceImg, setInvoiceImg] = useState([]);
    const [note, setNote] = useState('');
    const { invoiceId, userId, customerId } = props.location.state;
    useEffect(() => {
        getDraftDetail();
    }, []);
    const getDraftDetail = () => {
        try {
            const details = ref(database, `/INVOICE_LIST/${invoiceId}`);
            onValue(details, (snapShot) => {
                if (snapShot.val()) {
                    setNote(snapShot.val()?.note);
                }
            });
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
    const StyledTableCell = withStyles(() => ({
        head: {
            backgroundColor: theme.color.veryDarkGrayishBlue,
            color: theme.color.white
        },
        body: {
            fontSize: 14
        }
    }))(TableCell);
    const StyledTableRow = withStyles(() => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.color.lightGrayishBlue
            }
        }
    }))(TableRow);

    return (
        <div style={styles.div}>
            <div style={styles.subDiv}>
                {note ? (
                    <div style={styles.bottomView}>
                        <TableContainer component={Paper}>
                            <Table aria-label='customized table'>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align='left'>Note</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <StyledTableRow align='left'>
                                        <StyledTableCell component='th' scope='row'>
                                            {note}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                            <ToastContainer />
                        </TableContainer>
                    </div>
                ) : null}
                {invoices &&
                    invoices.map((item, index) => {
                        if (item.WeightType == 'unit') {
                            return (
                                <div style={styles.div1}>
                                    <span>
                                        ({index + 1}).{item.itemName}
                                    </span>
                                    <br />
                                    <br />
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
                                    <span>
                                        ({index + 1}).{item.itemName}
                                    </span>
                                    <br />
                                    <br />
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
        </div>
    );
}
