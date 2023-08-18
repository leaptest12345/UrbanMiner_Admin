import React, { useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';
import { useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import LoadingSpinner from 'components/Spinner/LoadingSpinner';

import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set, update } from 'firebase/database';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';

import productStyle from './styles';

function EditCategory(props) {
    const uniqueId = uuid().slice(0, 8);
    const history = useHistory();
    const theme = useTheme();

    const { categoryId } = props.location.state;
    const { styles } = productStyle;

    const [categoryName, setCategoryName] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subProduct, setSubProduct] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productList, setProductList] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);

    useEffect(() => {
        getProductList();
    }, []);

    const getProductList = () => {
        try {
            const categoryDetail = ref(database, `/ADMIN/CATEGORY/${categoryId}`);
            onValue(categoryDetail, (snapShot1) => {
                setCategoryName(snapShot1.val()?.categoryName);
            });
            const refDetail = ref(database, `/ADMIN/CATEGORY/${categoryId}/PRODUCT`);
            onValue(refDetail, (snapShot) => {
                const arr = formateData(snapShot.val());
                arr.sort((a, b) => a.order - b.order);
                setProductList(arr);
                setTotalProduct(arr.length);
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
            fontSize: 14,
            backgroundColor: theme.color.BG
        }
    }))(TableCell);
    const StyledTableRow = withStyles(() => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.color.lightGrayishBlue
            }
        }
    }))(TableRow);

    const addProductInDatabase = async () => {
        try {
            subProduct.map(async (item, index) => {
                const uniqueId = uuid().slice(0, 8);
                const starCount = ref(
                    database,
                    `/ADMIN/CATEGORY/${categoryId}/PRODUCT/${uniqueId}`
                );
                await set(starCount, {
                    id: uniqueId,
                    productName: item?.name,
                    productPrice: item.price,
                    order: totalProduct + index + 1
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const editCategory = async () => {
        try {
            setLoading(true);
            if (categoryName) {
                const starCount = ref(database, `/ADMIN/CATEGORY/${categoryId}`);
                await update(starCount, {
                    categoryName: categoryName
                });
                addProductInDatabase();
                notify('Category has been successfully updated!', 1);
                setSubProduct([]);
                history.goBack();
            } else {
                if (!categoryName) notify('Please Fill The CategoryName', 2);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            {loading ? <LoadingSpinner /> : null}
            <text>Enter Category Name: </text>
            <br />
            <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                style={styles.inputStyle}
            />
            <br />
            <div style={styles.marginTopView}>
                <Button style={styles.btnStyle} onClick={() => setOpen(true)}>
                    ADD PRODUCT
                </Button>
                <Button
                    onClick={() => editCategory()}
                    style={{ ...styles.btnStyle1, marginBottom: 20 }}
                >
                    EDIT CATEGORY
                </Button>
                <br />
                {subProduct.length != 0 ? <text style={styles.title}>NEW PRODUCT LIST</text> : null}
                {subProduct.length != 0 ? (
                    <Table
                        aria-label='customized table'
                        style={{ ...styles.marginTopView, marginBottom: 50 }}
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>ProductName</StyledTableCell>
                                <StyledTableCell align='left'>ProductPrice</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subProduct &&
                                subProduct.map((item, index) => (
                                    <>
                                        <StyledTableRow align='left' key={item.id}>
                                            <StyledTableCell component='th' scope='row'>
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell component='th' scope='row'>
                                                {item?.name}
                                            </StyledTableCell>
                                            <StyledTableCell align='left'>
                                                $ {item.price ? item.price : '-'}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
                {productList.length != 0 ? <text style={styles.title}>PRODUCT LIST</text> : null}
                {productList.length != 0 ? (
                    <Table aria-label='customized table' style={styles.marginTopView}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>ProductName</StyledTableCell>
                                <StyledTableCell align='left'>ProductPrice</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productList &&
                                productList.map((item, index) => (
                                    <>
                                        <StyledTableRow align='left' key={item.id}>
                                            <StyledTableCell component='th' scope='row'>
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell component='th' scope='row'>
                                                {item.productName}
                                            </StyledTableCell>
                                            <StyledTableCell align='left'>
                                                $ {item.productPrice ? item.productPrice : '-'}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
                <br />
            </div>
            <ToastContainer />
            <Modal onClose={() => setOpen(false)} open={open} style={styles.modal}>
                <div style={styles.modalDiv}>
                    {loading ? <LoadingSpinner /> : null}
                    <Button onClick={() => setOpen(false)} style={styles.closeBtn}>
                        Close
                    </Button>
                    <div>
                        <text>Enter Product Name:</text>
                        <br />
                        <input
                            type='text'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            style={styles.inputStyle}
                        />
                    </div>
                    <br />
                    <div>
                        <text>Enter Product Price: </text>
                        <br />
                        <input
                            type='number'
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            style={styles.inputStyle}
                        />
                    </div>
                    <div style={{ marginTop: '4%' }}>
                        <Button
                            style={{
                                ...styles.btnStyle1
                            }}
                            onClick={() => {
                                if (productName && productPrice) {
                                    setSubProduct([
                                        ...subProduct,
                                        {
                                            id: uniqueId,
                                            name: productName,
                                            price: productPrice
                                        }
                                    ]);
                                    setProductName('');
                                    setProductPrice('');
                                    setOpen(false);
                                }
                            }}
                        >
                            {'ADD PRODUCT'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default EditCategory;
