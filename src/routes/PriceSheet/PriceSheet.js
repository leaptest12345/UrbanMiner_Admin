import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
import productStyle from './styles';
import ImageModal from 'components/ImageModal/ImageModal';
import { notify } from 'util/notify';
import { database } from 'configs/firebaseConfig';
import { onValue, ref, set, update } from 'firebase/database';
import { formateData } from 'util/formateData';
import { uploadProductImage } from 'util/uploadProductImage';
import { useHistory } from 'react-router-dom';
import { convertSlugToUrl } from 'resources/utilities';
import SLUGS from 'resources/slugs';

function PriceSheet() {
    const dragItem = useRef();
    const dragOverItem = useRef();

    const dragItem1 = useRef();
    const dragOverItem1 = useRef();

    const [imgfile, setImageFile] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [imagesFile, setImagesFile] = useState([]);

    const [open, setOpen] = useState(false);
    const [openEditCategory, setOpenEditCategory] = useState(false);
    const [loading, setLoading] = useState(false);

    const [subProduct, setSubProduct] = useState([]);

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');

    const [categoryList, setCategoryList] = useState([]);
    const [isEditable, setIsEditable] = useState(false);

    const [categoryId, setCategoryId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [totalCategory, setTotalCategory] = useState(0);
    const [ModalType, setModalType] = useState(0);
    const { styles } = productStyle;
    const uniqueId = uuid().slice(0, 8);

    const { push } = useHistory();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        try {
            const refDetail = ref(database, `/ADMIN/CATEGORY`);
            onValue(refDetail, (snapShot) => {
                const arr = formateData(snapShot.val());
                arr.sort((a, b) => a.order - b.order);
                setCategoryList(arr);
                setTotalCategory(arr.length);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const imgFilehandler = (e) => {
        setImagesFile(formateData(e.target.files));
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

    const addProductInDatabase = async (id) => {
        try {
            subProduct.map(async (item, index) => {
                const uniqueId = uuid().slice(0, 10);
                const starCount = ref(database, `/ADMIN/CATEGORY/${id}/PRODUCT/${uniqueId}`);
                await set(starCount, {
                    id: uniqueId,
                    productName: item.name,
                    productPrice: item.price,
                    order: index + 1
                });
            });
        } catch (error) {
            console.log(error);
        }
    };
    const createCategory = async () => {
        try {
            const id = uuid().slice(0, 10);
            setLoading(true);
            if (imagesFile.length != 0) {
                imagesFile.map(async (item, index) => {
                    const uniqueId = uuid().slice(0, 8);
                    const url = await uploadProductImage(item);
                    console.log('uplaodded url', url);
                    const starCount = ref(database, `/ADMIN/CATEGORY_PHOTOS/${id}/${uniqueId}`);
                    await set(starCount, {
                        ID: uniqueId,
                        name: item.name,
                        url: url
                    });
                });
            }
            if (categoryName) {
                const starCount = ref(database, `/ADMIN/CATEGORY/${id}`);
                await set(starCount, {
                    ID: id,
                    categoryName: categoryName,
                    order: totalCategory + 1
                });
                notify('Category has been successfully created!', 1);
                addProductInDatabase(id);
                setCategoryName('');
                setSubProduct([]);
                setImagesFile([]);
            } else {
                if (!categoryName) notify('Please Fill The CategoryName', 2);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);

            console.log(error);
        }
    };

    const deleteCategory = (categoryId, productId, productType) => {
        const refDetail = ref(database, `/ADMIN/CATEGORY/${categoryId}`);
        const imageRef = ref(database, `ADMIN/CATEGORY_PHOTOS/${categoryId}`);
        const refDetail1 = ref(database, `/ADMIN/CATEGORY/${categoryId}/PRODUCT/${productId}`);

        try {
            // onValue(imageRef, (snapShot) => {
            //     const images = formateData(snapShot.val());
            //     console.log('toatal iamges', snapShot.val());
            //     images.map(async (item) => {
            //         await deleteProductImage(item.name);
            //     });
            // });
            if (productType == 0) {
                set(refDetail, null);
                notify('Category Successfully Deleted!', 0);
            } else {
                set(refDetail1, null);
                notify('Category Product Successfully Deleted!', 0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onModalClose = () => {
        setOpen(false);
        setOpenEditCategory(false);
        setIsEditable(false);
        setProductName('');
        setProductPrice('');
    };

    const onProductEdit = () => {
        setLoading(true);

        const refDetail = ref(database, `ADMIN/CATEGORY/${categoryId}/PRODUCT/${productId}`);
        update(refDetail, {
            productName: productName,
            productPrice: productPrice
        });
        setLoading(false);
        notify('Product detail has been updated!', 2);
        onModalClose();
    };

    const onEditCategory = async () => {
        try {
            setLoading(true);
            const starCount = ref(database, `/ADMIN/CATEGORY/${categoryId}`);
            await update(starCount, {
                categoryName: editCategoryName
            });
            notify('Category has been successfully Edited!', 1);
            setLoading(false);
            onModalClose();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const dragStart = (e, position) => {
        dragItem.current = position;
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const drop = (e) => {
        console.log(categoryList[dragItem.current], categoryList[dragOverItem.current]);

        const FirstItemRef = ref(database, `/ADMIN/CATEGORY/${categoryList[dragItem.current].ID}`);
        update(FirstItemRef, {
            order: categoryList[dragOverItem.current].order
        });
        const SecondItemRef = ref(
            database,
            `/ADMIN/CATEGORY/${categoryList[dragOverItem.current].ID}`
        );
        update(SecondItemRef, {
            order: categoryList[dragItem.current].order
        });

        const copyListItems = [...categoryList];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);

        dragItem.current = null;
        dragOverItem.current = null;
        setCategoryList(copyListItems);
    };

    const dragStart1 = (e, position) => {
        console.log('dragStart', position);
        dragItem1.current = position;
    };

    const dragEnter1 = (e, position) => {
        console.log('dragEnter', position);
        dragOverItem1.current = position;
    };

    const drop1 = (e, categoryItemId, categoryIndex) => {
        const parentNode = formateData(categoryList[categoryIndex - 1].PRODUCT).sort(
            (a, b) => a.order - b.order
        );
        const FirstItem = parentNode[dragItem1.current];
        const secondItem = parentNode[dragOverItem1.current];

        const FirstItemRef = ref(
            database,
            `/ADMIN/CATEGORY/${categoryItemId}/PRODUCT/${FirstItem.id}`
        );
        update(FirstItemRef, {
            order: secondItem.order
        });

        const SecondItemRef = ref(
            database,
            `/ADMIN/CATEGORY/${categoryItemId}/PRODUCT/${secondItem.id}`
        );
        update(SecondItemRef, {
            order: FirstItem.order
        });
        dragOverItem1.current = null;
        dragOverItem1.current = null;
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
            <h2
                style={{
                    marginTop: 30
                }}
            >
                Upload
            </h2>
            <input
                style={styles.marginTopView}
                type='file'
                accept='image/*'
                multiple={true}
                onChange={imgFilehandler}
            />

            {imagesFile.length != 0 ? (
                <>
                    <hr />
                    <div>
                        <h2>Preview</h2>
                        <div style={styles.rowWrap}>
                            {imagesFile.map((item) => {
                                return (
                                    <div
                                        style={{
                                            marginRight: 20,
                                            width: '20vw'
                                        }}
                                    >
                                        <ImageModal
                                            imageStyle={styles.imgStyle}
                                            url={item != '' ? window.URL.createObjectURL(item) : ''}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            ) : null}
            <br />
            <div style={styles.marginTopView}>
                <Button style={styles.btnStyle} onClick={() => setOpen(true)}>
                    ADD PRODUCT
                </Button>
                <Button
                    onClick={() => createCategory()}
                    style={{ ...styles.btnStyle1, marginBottom: 50 }}
                >
                    UPLOAD CATEGORY
                </Button>
                <br />
                {subProduct.length != 0 ? <text style={styles.title}>PRODUCT LIST</text> : null}
                {subProduct.length != 0 ? (
                    <Table aria-label='customized table' style={styles.marginTopView}>
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
                                                {item.name}
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
                <br />
                {categoryList.length != 0 ? <text style={styles.title}>CATEGORY_LIST</text> : null}
                {categoryList.length != 0 ? (
                    <Table aria-label='customized table' style={{ marginTop: '20px' }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left' style={styles.width10}>
                                    No.
                                </StyledTableCell>
                                <StyledTableCell align='left' style={{ width: '20%' }}>
                                    categoryName
                                </StyledTableCell>
                                <StyledTableCell align='left' style={styles.width10}>
                                    ProductPrice
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
                            {categoryList &&
                                categoryList.map((item, index) => (
                                    <>
                                        <StyledTableRow
                                            draggable
                                            onDragStart={(e) => dragStart(e, index)}
                                            onDragEnter={(e) => dragEnter(e, index)}
                                            onDragEnd={drop}
                                            align='left'
                                            key={item.id}
                                        >
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={styles.width10}
                                            >
                                                {index + 1}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component='th'
                                                scope='row'
                                                style={styles.width10}
                                            >
                                                {item.categoryName}
                                            </StyledTableCell>
                                            <StyledTableCell
                                                align='left'
                                                style={styles.width10}
                                            ></StyledTableCell>
                                            <StyledTableCell style={{ ...styles.width10 }}>
                                                <Button
                                                    style={styles.dangerBtn1}
                                                    onClick={() => {
                                                        push({
                                                            pathname: convertSlugToUrl(
                                                                SLUGS.categoryImages,
                                                                {}
                                                            ),
                                                            state: { categoryId: item.ID }
                                                        });
                                                    }}
                                                >
                                                    SEE IMAGES
                                                </Button>
                                                <Button
                                                    style={styles.dangerBtn}
                                                    onClick={() => {
                                                        // setEditCategoryName(item.categoryName);
                                                        // setOpenEditCategory(true);
                                                        // setCategoryId(item.ID);
                                                        push({
                                                            pathname: convertSlugToUrl(
                                                                SLUGS.EditCategory,
                                                                {}
                                                            ),
                                                            state: { categoryId: item.ID }
                                                        });
                                                    }}
                                                >
                                                    EDIT
                                                </Button>
                                            </StyledTableCell>
                                            <StyledTableCell align='left' style={styles.width10}>
                                                <Delete
                                                    onClick={() => deleteCategory(item.ID, null, 0)}
                                                ></Delete>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                        {item.PRODUCT
                                            ? formateData(item.PRODUCT)
                                                  .sort((a, b) => a.order - b.order)
                                                  .map((item1, index1) => {
                                                      return (
                                                          <StyledTableRow
                                                              draggable
                                                              onDragStart={(e) =>
                                                                  dragStart1(e, index1)
                                                              }
                                                              onDragEnter={(e) =>
                                                                  dragEnter1(e, index1)
                                                              }
                                                              onDragEnd={(e) =>
                                                                  drop1(e, item.ID, item.order)
                                                              }
                                                              align='left'
                                                              key={item1.id}
                                                          >
                                                              <StyledTableCell1
                                                                  component='th'
                                                                  scope='row'
                                                                  style={styles.width10}
                                                              >
                                                                  {index + 1 + '.' + (index1 + 1)}
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
                                                                  $ {item1.productPrice}
                                                              </StyledTableCell1>
                                                              <StyledTableCell1
                                                                  align='left'
                                                                  style={styles.width10}
                                                              >
                                                                  <Button
                                                                      style={styles.dangerBtn}
                                                                      onClick={() => {
                                                                          setOpen(true);
                                                                          setIsEditable(true);
                                                                          setProductName(
                                                                              item1.productName
                                                                          );
                                                                          setProductPrice(
                                                                              item1.productPrice
                                                                          );
                                                                          setProductId(item1.id);
                                                                          setCategoryId(item.ID);
                                                                      }}
                                                                      //   onClick={() => {
                                                                      //       setProductId(item.ID);
                                                                      //       setProductSubId(item1.id);
                                                                      //       editProduct(item1);
                                                                      //       setProductType(1);
                                                                      //   }}
                                                                  >
                                                                      EDIT
                                                                  </Button>
                                                              </StyledTableCell1>
                                                              <StyledTableCell1
                                                                  align='left'
                                                                  style={styles.width10}
                                                              >
                                                                  <Delete
                                                                      onClick={() =>
                                                                          deleteCategory(
                                                                              item.ID,
                                                                              item1.id,
                                                                              1
                                                                          )
                                                                      }
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
                                if (isEditable) {
                                    onProductEdit();
                                } else {
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
                                }
                            }}
                        >
                            {isEditable ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                onClose={() => setOpenEditCategory(false)}
                open={openEditCategory}
                style={styles.modal1}
            >
                <div style={styles.modalDiv1}>
                    {loading ? <LoadingSpinner /> : null}
                    <Button onClick={() => setOpenEditCategory(false)} style={styles.closeBtn}>
                        Close
                    </Button>
                    <div>
                        <text>Category Name:</text>
                        <br />
                        <input
                            type='text'
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            style={styles.inputStyle}
                        />
                    </div>
                    <br />
                    <div style={{ marginTop: '4%' }}>
                        <Button
                            style={{
                                ...styles.btnStyle1
                            }}
                            onClick={() => onEditCategory()}
                        >
                            {'EDIT CATEGORY'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default PriceSheet;