import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';

import { convertSlugToUrl } from 'resources/utilities';
import slugs from 'resources/slugs';

import ImageModal from 'components/ImageModal/ImageModal';

import { formateData } from 'util/formateData';
import { convertIntoDoller } from 'util/convertIntoDoller';

import customerStyle from './styles';

export default function CustomerDetail(props) {
    const theme = useTheme();
    const { styles } = customerStyle;
    const { userId, customerId } = props.location.state;
    const { push } = useHistory();

    const [data, setData] = useState([]);
    const [customerImages, setCustomerImages] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        getCustomerDetail();
        getInvoiceList();
        getCustomerImages();
    }, []);

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

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

    const getCustomerImages = () => {
        try {
            const refDetail = ref(database, `/CUSTOMER_IMG/user:${userId}/customer:${customerId}`);
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                setCustomerImages(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomerDetail = () => {
        try {
            const refDetail = ref(database, `/USER_CUSTOMER/${userId}/CUSTOMER/${customerId}`);
            onValue(refDetail, (snapShot) => {
                const data = snapShot.val();
                setUser(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getInvoiceList = () => {
        try {
            const refDetail = ref(database, `/INVOICE_LIST`);
            let arr = [];
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                data.map((item) => {
                    if (item.userId == userId && item.customerId == customerId) {
                        arr.push(item);
                    }
                });
                setData(arr);
            });
        } catch (error) {
            console.log(error);
        }
    };

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    const viewPdf = (id) => {
        // .ref(`/PDF/user:${userId}/customer:${customerId}/invoiceid:${ID}/1`)
        try {
            const refDetail = ref(
                database,
                `/PDF/user:${userId}/customer:${customerId}/invoiceid:${id}/`
            );
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                openInNewTab(data[0]?.url);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onActions = (item) => {
        if (item.type == 'draft') {
            onClick(slugs.ViewDraft, {
                userId,
                customerId,
                invoiceId: item.ID
            });
        } else viewPdf(item.ID);
    };

    return (
        <div>
            <div style={{ height: '330' }}>
                <span style={styles.text}>UserFirstName : {user?.UserFirstName}</span>
                <br />
                <span style={styles.text}>UserLastName : {user?.UserLastName}</span>
                <br />
                <span style={styles.text}>BusinessEmail : {user?.BusinessEmail}</span>
                <br />
                <span style={styles.text}>BusinessName : {user?.BusinessName}</span>
                <br />
                <span style={styles.text}>Address : {user?.BusinessAddress}</span>
                <br />
                <div style={styles.div}>
                    {customerImages &&
                        customerImages.map((item) => {
                            return (
                                <div style={styles.marginDiv}>
                                    <span>{item.photoName}</span>
                                    <ImageModal url={item.url} imageStyle={styles.img} />
                                </div>
                            );
                        })}
                </div>
            </div>
            {data.length != 0 ? (
                <TableContainer component={Paper}>
                    <Table aria-label='customized table'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>InvoiceDate</StyledTableCell>
                                <StyledTableCell align='left'>TotalItems</StyledTableCell>
                                <StyledTableCell align='left'>Type</StyledTableCell>
                                <StyledTableCell align='left'>Amount</StyledTableCell>
                                <StyledTableCell align='left'>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.map((item, index) => (
                                    <StyledTableRow align='left' key={item.id}>
                                        <StyledTableCell component='th' scope='row'>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.invoiceDate}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.totalItems}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.type}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {convertIntoDoller(item.Amount)}
                                        </StyledTableCell>
                                        <StyledTableCell align='left' style={styles.flexDiv}>
                                            <Button
                                                onClick={() => onActions(item)}
                                                style={{
                                                    backgroundColor: theme.color.BORDER,
                                                    color: theme.color.WHITE
                                                }}
                                            >
                                                {item.type == 'sent' ? 'View PDF' : 'View Detail'}
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <ToastContainer />
                </TableContainer>
            ) : null}
        </div>
    );
}
