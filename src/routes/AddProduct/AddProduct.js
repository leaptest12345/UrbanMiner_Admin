import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { database } from 'configs/firebaseConfig';
import { set, ref as dataRef } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';
import { Button } from '@material-ui/core';
import LoadingSpinner from 'components/Spinner/LoadingSpinner';
import { useTheme } from 'react-jss';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import { uploadProductImage } from 'util/uploadProductImage';
import productStyle from './styles';
function AddProduct() {
    const [imgfile, setImageFile] = useState('');
    const [progress, setProgress] = useState(0);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subProduct, setSubProduct] = useState([]);
    const [subProductName, setSubProductName] = useState('');
    const [subProductDesc, setSubProductDesc] = useState('');
    const [subImgFile, setSubImageFile] = useState('');
    const { styles } = productStyle;
    const uniqueId = uuid().slice(0, 8);
    const imgFilehandler = (e) => {
        console.log(e.target.files);
        setImageFile(e.target.files[0]);
    };
    const setProductDetail = async () => {
        try {
            setLoading(true);
            const url = await uploadProductImage(imgfile);
            createProduct(url);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const addSubProductDatabase = async (id) => {
        try {
            const uniqueId = uuid().slice(0, 8);
            subProduct.map(async (item, index) => {
                if (item.img) {
                    const url = await uploadProductImage(item.img);
                    const starCount = dataRef(
                        database,
                        `/ADMIN/PRODUCT/${id}/SUB_PRODUCT/${uniqueId}/${index + 1}`
                    );
                    await set(starCount, {
                        id: index + 1,
                        productName: item.name,
                        productImage: url,
                        prodductDescription: item.description
                    });
                } else {
                    const starCount = dataRef(
                        database,
                        `/ADMIN/PRODUCT/${id}/SUB_PRODUCT/${uniqueId}/${index + 1}`
                    );
                    await set(starCount, {
                        id: index + 1,
                        productName: item.name,
                        productImage: '',
                        prodductDescription: item.description
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const createProduct = async (downloadURL) => {
        try {
            if (productName && productDesc && imgfile) {
                const id = uuid().slice(0, 8);
                const starCount = dataRef(database, `/ADMIN/PRODUCT/${id}`);
                await set(starCount, {
                    ID: id,
                    productName: productName,
                    productImage: downloadURL,
                    prodductDescription: productDesc
                });
                notify('Product has been successfully created!', 1);
                addSubProductDatabase(id);
                setSubProductName('');
                setSubProductDesc('');
                setSubImageFile('');
                setProductName('');
                setProductDesc('');
                setImageFile('');
                setSubProduct([]);
            } else {
                if (!productName) notify('Please Fill The ProductName', 2);
                else if (!productDesc) notify('Please Fill The ProductDescription', 2);
                else notify('Product Image Is Mendatory!', 2);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);

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
    const theme = useTheme();

    const addSubProduct = () => {
        if (!subProductName) notify('Please Fill The Product Name!', 2);
        else if (!subProductDesc) notify('Please Fill The Product Description', 2);
        else {
            setSubProduct([
                ...subProduct,
                { id: uniqueId, name: subProductName, description: subProductDesc, img: subImgFile }
            ]);
            setSubProductName('');
            setSubProductDesc('');
            setSubImageFile('');
            setOpen(false);
        }
    };
    const deleteSubProduct = (data) => {
        const result = subProduct.filter((item) => {
            console.log(item.id, data.id);
            return item.id != data.id;
        });
        setSubProduct(result);
        console.log('after delete', subProduct, result);
    };
    return (
        <div>
            {loading ? <LoadingSpinner /> : null}

            <text>Enter Product Name: </text>
            <br />
            <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={styles.inputStyle}
            />
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <br />
                <text>Enter Product Description: </text>
                <br />
                <textarea
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    style={styles.textareaStyle}
                />
            </div>
            <h2>Upload</h2>
            <input style={{ marginTop: '20px' }} type='file' onChange={imgFilehandler} />

            {imgfile != '' ? (
                <>
                    <hr />
                    <div>
                        <h2>Preview</h2>
                        <span>
                            <img
                                src={imgfile != '' ? URL.createObjectURL(imgfile) : ''}
                                style={styles.imgStyle}
                                alt='Photo'
                            />
                        </span>
                    </div>
                </>
            ) : null}
            <br />
            <div style={{ marginTop: '20px' }}>
                <Button style={styles.btnStyle} onClick={() => setOpen(true)}>
                    ADD SUB_PRODUCT
                </Button>
                <Button onClick={() => setProductDetail()} style={styles.btnStyle1}>
                    Upload Product
                </Button>
                {subProduct.length != 0 ? (
                    <Table aria-label='customized table'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>Photo</StyledTableCell>
                                <StyledTableCell align='left'>Sub_ProductName</StyledTableCell>
                                <StyledTableCell align='left'>
                                    Sub_ProductDescription
                                </StyledTableCell>
                                <StyledTableCell align='left'>Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subProduct &&
                                subProduct.map((item, index) => (
                                    <StyledTableRow align='left' key={item.id}>
                                        <StyledTableCell component='th' scope='row'>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align='left'>
                                            {item.img ? (
                                                <img
                                                    src={
                                                        item.img != ''
                                                            ? window.URL.createObjectURL(item.img)
                                                            : ''
                                                    }
                                                    loading='lazy'
                                                    style={styles.img}
                                                />
                                            ) : (
                                                <div style={styles.img}>-</div>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.name}
                                        </StyledTableCell>
                                        <StyledTableCell align='left'>
                                            {item.description ? item.description : '-'}
                                        </StyledTableCell>
                                        <StyledTableCell align='left'>
                                            <Delete onClick={() => deleteSubProduct(item)}></Delete>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
            </div>
            <ToastContainer />
            <Modal onClose={() => setOpen(false)} open={open} style={styles.modal}>
                <div style={styles.modalDiv}>
                    <Button style={styles.closeBtn} onClick={() => setOpen(false)}>
                        Close
                    </Button>
                    <div>
                        <text>Enter Sub_product name</text>
                        <br />
                        <input
                            value={subProductName}
                            onChange={(e) => setSubProductName(e.target.value)}
                            style={styles.inputStyle}
                        />
                    </div>
                    <br />
                    <div>
                        <text>Enter Sub_Product Description: </text>
                        <br />
                        <textarea
                            value={subProductDesc}
                            onChange={(e) => setSubProductDesc(e.target.value)}
                            style={styles.textareaStyle}
                        />
                    </div>
                    <div style={styles.rowDiv}>
                        <div>
                            <h4>Upload Sub_Product Image (Optional)</h4>
                            <input
                                type='file'
                                onChange={(e) => setSubImageFile(e.target.files[0])}
                            />
                        </div>
                        <div>
                            {subImgFile != '' ? (
                                <span>
                                    <img
                                        src={window.URL.createObjectURL(subImgFile)}
                                        style={styles.imgStyle1}
                                        alt='Photo'
                                    />
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <div style={{ marginTop: '0.5%' }}>
                        <Button
                            style={{
                                ...styles.btnStyle1
                            }}
                            onClick={() => addSubProduct()}
                        >
                            ADD SUBPRODUCT
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default AddProduct;
