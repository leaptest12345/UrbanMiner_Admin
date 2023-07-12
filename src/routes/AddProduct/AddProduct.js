import React, { useEffect, useState } from 'react';

import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { set, onValue, ref, update } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { database } from 'configs/firebaseConfig';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';
import { Button } from '@material-ui/core';
import { useTheme } from 'react-jss';
import { withStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import { uploadProductImage } from 'util/uploadProductImage';
import { formateData } from 'util/formateData';

import LoadingSpinner from 'components/Spinner/LoadingSpinner';
import ImageModal from 'components/ImageModal/ImageModal';

import productStyle from './styles';

function AddProduct() {
    const [imgfile, setImageFile] = useState('');
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subProduct, setSubProduct] = useState([]);
    const [subProductName, setSubProductName] = useState('');
    const [subProductDesc, setSubProductDesc] = useState('');
    const [subImgFile, setSubImageFile] = useState('');
    const [productList, setProductList] = useState([]);
    const [isEditable, setIsEditable] = useState(false);
    const [productType, setProductType] = useState(0);
    const [productId, setProductId] = useState(null);
    const [productSubId, setProductSubId] = useState(null);
    const [isImageChange, setIsImageChange] = useState(false);
    const [addToDatabase, setAddToDatabase] = useState(false);
    const [item, setItem] = useState('');

    const { styles } = productStyle;
    const uniqueId = uuid().slice(0, 8);

    const imgFilehandler = (e) => {
        setImageFile(e.target.files[0]);
    };

    const imgFilehandler1 = (e) => {
        if (isEditable) {
            setIsImageChange(true);
            setSubImageFile(e.target.files[0]);
        } else setSubImageFile(e.target.files[0]);
    };

    useEffect(() => {
        getProduct();
    }, []);

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
            subProduct.map(async (item, index) => {
                if (item.img) {
                    const url = await uploadProductImage(item.img);
                    const starCount = ref(
                        database,
                        `/ADMIN/PRODUCT/${id}/SUB_PRODUCT/${index + 1}`
                    );
                    await set(starCount, {
                        id: index + 1,
                        productName: item.name,
                        productImage: url,
                        prodductDescription: item.description
                    });
                    onModalClose();
                } else {
                    const starCount = ref(
                        database,
                        `/ADMIN/PRODUCT/${id}/SUB_PRODUCT/${index + 1}`
                    );
                    await set(starCount, {
                        id: index + 1,
                        productName: item.name,
                        productImage: '',
                        prodductDescription: item.description
                    });
                    onModalClose();
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    const getProduct = () => {
        try {
            const refDetail = ref(database, `/ADMIN/PRODUCT`);
            onValue(refDetail, (snapShot) => {
                const arr = formateData(snapShot.val());
                setProductList(arr);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const createProduct = async (downloadURL) => {
        try {
            if (productName && productDesc && imgfile) {
                const id = uuid().slice(0, 8);
                const starCount = ref(database, `/ADMIN/PRODUCT/${id}`);
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
            fontSize: 14,
            backgroundColor: theme.color.BG
        }
    }))(TableCell);
    const StyledTableCell1 = withStyles(() => ({
        head: {
            backgroundColor: theme.color.veryDarkGrayishBlue,
            color: theme.color.white
        },
        body: {
            fontSize: 14,
            backgroundColor: theme.color.lightGrayishBlue
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
            return item.id != data.id;
        });
        setSubProduct(result);
    };
    const editProduct = (item) => {
        try {
            setIsEditable(true);
            setOpen(true);
            setSubProductName(item.productName);
            setSubProductDesc(item.prodductDescription);
            setSubImageFile(item.productImage);
        } catch (error) {
            console.log(error);
        }
    };
    const editProductDetail = async () => {
        try {
            setLoading(true);
            if (isImageChange) {
                const url = await uploadProductImage(subImgFile);
                const refDetail = ref(database, `ADMIN/PRODUCT/${productId}`);
                update(refDetail, {
                    productName: subProductName,
                    prodductDescription: subProductDesc,
                    productImage: url
                });
                notify('Product detail has been updated!', 2);
            } else {
                const refDetail = ref(database, `ADMIN/PRODUCT/${productId}`);
                update(refDetail, {
                    productName: subProductName,
                    prodductDescription: subProductDesc
                });
                notify('Product detail has been updated!', 2);
            }
            onModalClose();
            setLoading(false);
        } catch (error) {
            setOpen(false);
            console.log(error);
            setLoading(false);
        }
    };
    const editSubProductDetail = async () => {
        try {
            setLoading(true);
            if (isImageChange) {
                const url = await uploadProductImage(subImgFile);
                const refDetail = ref(
                    database,
                    `ADMIN/PRODUCT/${productId}/SUB_PRODUCT/${productSubId}`
                );
                update(refDetail, {
                    productName: subProductName,
                    prodductDescription: subProductDesc,
                    productImage: url
                });
                notify('Sub_Product detail has been updated!', 2);
            } else {
                const refDetail = ref(
                    database,
                    `ADMIN/PRODUCT/${productId}/SUB_PRODUCT/${productSubId}`
                );
                update(refDetail, {
                    productName: subProductName,
                    prodductDescription: subProductDesc
                });
                notify('Sub_Product detail has been updated!', 2);
            }
            onModalClose();
            setLoading(false);
        } catch (error) {
            setOpen(false);
            console.log(error);
            setLoading(false);
        }
    };
    const onModalClose = () => {
        setOpen(false);
        setIsEditable(false);
        setSubProductName('');
        setSubProductDesc('');
        setSubImageFile('');
        setIsImageChange(false);
        setAddToDatabase(false);
    };

    const deleteProduct = (productId, subProductId, type) => {
        if (type == 'product') {
            console.log('please delete produc here', productId);
            const refDetail = ref(database, `/ADMIN/PRODUCT/${productId}`);
            set(refDetail, null);
            notify('Product Successfully Deleted!', 0);
        } else {
            console.log('inside subproduct');
            const refDetail1 = ref(
                database,
                `/ADMIN/PRODUCT/${productId}/SUB_PRODUCT/${subProductId}`
            );
            set(refDetail1, null);
            notify('Sub_Product Successfully Deleted!', 0);
        }
    };

    const addSubProductInDatabase = async () => {
        try {
            if (subImgFile) {
                setLoading(true);
                const url = await uploadProductImage(subImgFile);
                const id = item.SUB_PRODUCT ? formateData(item.SUB_PRODUCT).length + 1 : 1;
                const starCount = ref(database, `/ADMIN/PRODUCT/${item.ID}/SUB_PRODUCT/${id}`);
                await set(starCount, {
                    id: id,
                    productName: subProductName,
                    productImage: url,
                    prodductDescription: subProductDesc
                });
                setOpen(false);
                setAddToDatabase(false);
                notify('Sub_Product Successfully Added', `1`);
                setLoading(false);
            } else {
                setLoading(true);
                const id = item.SUB_PRODUCT ? formateData(item.SUB_PRODUCT).length + 1 : 1;
                const starCount = ref(database, `/ADMIN/PRODUCT/${item.ID}/SUB_PRODUCT/${id}`);
                await set(starCount, {
                    id: id,
                    productName: subProductName,
                    productImage: '',
                    prodductDescription: subProductDesc
                });
                setOpen(false);
                setAddToDatabase(false);
                notify('Sub_Product Successfully Added', `1`);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            onModalClose();
            setLoading(false);
        }
    };

    const onEdit = () => {
        addToDatabase
            ? addSubProductInDatabase()
            : isEditable
            ? productType == 0
                ? editProductDetail()
                : editSubProductDetail()
            : addSubProduct();
    };
    const imageFileUrl = imgfile != '' ? window.URL.createObjectURL(imgfile) : '';

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
            <div style={styles.productDescView}>
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
            <input
                style={styles.marginTopView}
                type='file'
                accept='image/*'
                onChange={imgFilehandler}
            />

            {imgfile != '' ? (
                <>
                    <hr />
                    <div>
                        <h2>Preview</h2>
                        <span>
                            <ImageModal imageStyle={styles.imgStyle} url={imageFileUrl} />
                        </span>
                    </div>
                </>
            ) : null}
            <br />
            <div style={styles.marginTopView}>
                <Button style={styles.btnStyle} onClick={() => setOpen(true)}>
                    ADD SUB_PRODUCT
                </Button>
                <Button onClick={() => setProductDetail()} style={styles.btnStyle1}>
                    Upload Product
                </Button>
                <br />
                {subProduct.length != 0 ? <text style={styles.title}>SUB_PRODUCT LIST</text> : null}
                {subProduct.length != 0 ? (
                    <Table aria-label='customized table' style={styles.marginTopView}>
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
                                    <>
                                        <StyledTableRow align='left' key={item.id}>
                                            <StyledTableCell component='th' scope='row'>
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align='left'>
                                                {item.img ? (
                                                    <ImageModal
                                                        imageStyle={styles.img}
                                                        url={
                                                            item.img != ''
                                                                ? window.URL.createObjectURL(
                                                                      item.img
                                                                  )
                                                                : ''
                                                        }
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
                                                <Delete
                                                    onClick={() => deleteSubProduct(item)}
                                                ></Delete>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
                <br />
                {productList.length != 0 ? <text style={styles.title}>PRODUCT_LIST</text> : null}
                {productList.length != 0 ? (
                    <Table aria-label='customized table' style={{ marginTop: '20px' }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left' style={styles.width10}>
                                    No.
                                </StyledTableCell>
                                <StyledTableCell align='left' style={{ width: '20%' }}>
                                    Photo
                                </StyledTableCell>
                                <StyledTableCell align='left' style={{ width: '20%' }}>
                                    ProductName
                                </StyledTableCell>
                                <StyledTableCell align='left' style={{ width: '40%' }}>
                                    ProductDescription
                                </StyledTableCell>
                                <StyledTableCell align='left' style={styles.width10}>
                                    Actions
                                </StyledTableCell>
                                <StyledTableCell align='left' style={styles.width10}>
                                    Delete
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productList &&
                                productList.map((item, index) => (
                                    <>
                                        <StyledTableRow align='left' key={item.id}>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={styles.width10}
                                            >
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell align='left' style={{ width: '20%' }}>
                                                {item.productImage ? (
                                                    <ImageModal
                                                        url={item.productImage}
                                                        style={styles.productImage}
                                                    />
                                                ) : (
                                                    <div style={styles.img}>-</div>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={styles.width10}
                                            >
                                                {item.productName}
                                            </StyledTableCell>
                                            <StyledTableCell align='left' style={{ width: '35%' }}>
                                                {item.prodductDescription
                                                    ? item.prodductDescription
                                                    : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell align='left' style={styles.width10}>
                                                <Button
                                                    style={styles.dangerBtn}
                                                    onClick={() =>
                                                        setProductId(item.ID) + editProduct(item)
                                                    }
                                                >
                                                    EDIT
                                                </Button>
                                                <Button
                                                    style={styles.btnStyle1}
                                                    onClick={() =>
                                                        setItem(item) +
                                                        setAddToDatabase(true) +
                                                        setOpen(true)
                                                    }
                                                >
                                                    ADD SUB_PRODUCT
                                                </Button>
                                            </StyledTableCell>
                                            <StyledTableCell align='left' style={styles.width10}>
                                                <Delete
                                                    onClick={() => {
                                                        console.log(
                                                            'before deleting product',
                                                            item
                                                        );
                                                        setProductType(0);
                                                        setProductId(item.ID);
                                                        deleteProduct(item.ID, null, 'product');
                                                    }}
                                                ></Delete>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        {item.SUB_PRODUCT
                                            ? formateData(item.SUB_PRODUCT).map((item1, index1) => {
                                                  return (
                                                      <StyledTableRow align='left' key={item1.id}>
                                                          <StyledTableCell1
                                                              component='th'
                                                              scope='row'
                                                              style={styles.width10}
                                                          >
                                                              {index + 1 + '.' + (index1 + 1)}
                                                          </StyledTableCell1>
                                                          <StyledTableCell1
                                                              align='left'
                                                              style={{ width: '20%' }}
                                                          >
                                                              {item1.productImage ? (
                                                                  <ImageModal
                                                                      url={item1.productImage}
                                                                      style={styles.productImage}
                                                                  />
                                                              ) : (
                                                                  <div style={styles.img}>-</div>
                                                              )}
                                                          </StyledTableCell1>
                                                          <StyledTableCell1
                                                              component='th'
                                                              scope='row'
                                                              style={styles.width10}
                                                          >
                                                              {item1.productName}
                                                          </StyledTableCell1>
                                                          <StyledTableCell1
                                                              align='left'
                                                              style={{ width: '35%' }}
                                                          >
                                                              {item1.prodductDescription
                                                                  ? item1.prodductDescription
                                                                  : '-'}
                                                          </StyledTableCell1>
                                                          <StyledTableCell1
                                                              align='left'
                                                              style={styles.width10}
                                                          >
                                                              <Button
                                                                  style={styles.dangerBtn}
                                                                  onClick={() => {
                                                                      setProductId(item.ID);
                                                                      setProductSubId(item1.id);
                                                                      editProduct(item1);
                                                                      setProductType(1);
                                                                  }}
                                                              >
                                                                  EDIT
                                                              </Button>
                                                          </StyledTableCell1>
                                                          <StyledTableCell1
                                                              align='left'
                                                              style={styles.width10}
                                                          >
                                                              <Delete
                                                                  onClick={() => {
                                                                      console.log(
                                                                          'before deleting sub product',
                                                                          item
                                                                      );
                                                                      setProductType(1);
                                                                      deleteProduct(
                                                                          item.ID,
                                                                          item1.id,
                                                                          1
                                                                      );
                                                                  }}
                                                              ></Delete>
                                                          </StyledTableCell1>
                                                      </StyledTableRow>
                                                  );
                                              })
                                            : null}
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
            </div>
            <ToastContainer />
            <Modal onClose={() => setOpen(false)} open={open} style={styles.modal}>
                <div style={styles.modalDiv}>
                    {loading ? <LoadingSpinner /> : null}
                    <Button style={styles.closeBtn} onClick={() => onModalClose()}>
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
                            <input type='file' onChange={imgFilehandler1} accept='image/*' />
                        </div>
                        <div>
                            {subImgFile != '' ? (
                                <span>
                                    <ImageModal
                                        url={
                                            addToDatabase
                                                ? window.URL.createObjectURL(subImgFile)
                                                : isEditable
                                                ? isImageChange
                                                    ? window.URL.createObjectURL(subImgFile)
                                                    : subImgFile
                                                : window.URL.createObjectURL(subImgFile)
                                        }
                                        imageStyle={styles.imgStyle1}
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
                            onClick={() =>
                                addToDatabase
                                    ? addSubProductInDatabase()
                                    : isEditable
                                    ? productType == 0
                                        ? editProductDetail()
                                        : editSubProductDetail()
                                    : addSubProduct()
                            }
                        >
                            {isEditable ? 'Edit Product' : 'ADD SUBPRODUCT'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default AddProduct;
