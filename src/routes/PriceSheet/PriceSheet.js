import React, { useEffect, useRef, useState } from 'react';

import { v4 as uuid } from 'uuid';
import { ToastContainer } from 'react-toastify';
import { useTheme } from 'react-jss';
import { onValue, ref, set, update } from 'firebase/database';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';

import productStyle from './styles';

import LoadingSpinner from 'components/Spinner/LoadingSpinner';
import ImageModal from 'components/ImageModal/ImageModal';

import { convertSlugToUrl } from 'resources/utilities';
import SLUGS from 'resources/slugs';

import { database } from 'configs/firebaseConfig';

import { formateData } from 'util/formateData';
import { uploadProductImage } from 'util/uploadProductImage';
import { notify } from 'util/notify';
import { ConfirmationCard } from 'components/ConfirmationCard';

function PriceSheet() {
    const { styles } = productStyle;
    const { push } = useHistory();
    const uniqueId = uuid().slice(0, 8);
    const theme = useTheme();

    const dragItem = useRef();
    const dragOverItem = useRef();
    const containerRef = useRef(null);
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
    const [productImage, setProductImage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [productType, setProductType] = useState(null);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        try {
            const refDetail = ref(database, `/ADMIN/CATEGORY`);
            onValue(refDetail, (snapShot) => {
                const arr = formateData(snapShot.val());
                arr.sort((a, b) => a?.order - b?.order);
                setCategoryList(arr);
                setTotalCategory(arr.length);
            });
        } catch (error) {}
    };

    const imgFilehandler = (e) => {
        setImagesFile(formateData(e.target.files));
    };
    const imgFilehandler1 = (e) => {
        setProductImage(e.target.files[0]);
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

    const addProductInDatabase = async (id) => {
        try {
            subProduct.map(async (item, index) => {
                const uniqueId = uuid().slice(0, 10);
                const starCount = ref(database, `/ADMIN/CATEGORY/${id}/PRODUCT/${uniqueId}`);
                let url = '';
                if (item.image) {
                    url = await uploadProductImage(item.image);
                }
                await set(starCount, {
                    id: uniqueId,
                    productName: item.name,
                    productPrice: item.price,
                    order: index + 1,
                    image: url
                });
            });
        } catch (error) {}
    };

    const createCategory = async () => {
        try {
            const id = uuid().slice(0, 10);
            setLoading(true);
            if (imagesFile.length != 0) {
                imagesFile.map(async (item, index) => {
                    const uniqueId = uuid().slice(0, 8);
                    const url = await uploadProductImage(item);
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
        }
    };

    const deleteCategory = () => {
        setIsVisible(false);

        const refDetail = ref(database, `/ADMIN/CATEGORY/${categoryId}`);
        const imageRef = ref(database, `ADMIN/CATEGORY_PHOTOS/${categoryId}`);
        const refDetail1 = ref(database, `/ADMIN/CATEGORY/${categoryId}/PRODUCT/${productId}`);

        try {
            if (productType == 0) {
                set(refDetail, null);
                notify('Category Successfully Deleted!', 0);
            } else {
                set(refDetail1, null);
                notify('Category Product Successfully Deleted!', 0);
            }
            setCategoryId(null);
            setProductId(null);
            productType(null);
        } catch (error) {}
    };

    const onModalClose = () => {
        setOpen(false);
        setOpenEditCategory(false);
        setIsEditable(false);
        setProductName('');
        setProductPrice('');
    };

    const onProductEdit = async () => {
        setLoading(true);

        const refDetail = ref(database, `ADMIN/CATEGORY/${categoryId}/PRODUCT/${productId}`);

        if (typeof productImage == 'object') {
            const url = await uploadProductImage(productImage);
            update(refDetail, {
                productName: productName,
                productPrice: productPrice,
                image: url ?? ''
            });
        } else {
            update(refDetail, {
                productName: productName,
                productPrice: productPrice
            });
        }

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
        }
    };

    const dragStart = (e, position) => {
        dragItem.current = position;
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const drop = (e) => {
        const FirstItemRef = ref(database, `/ADMIN/CATEGORY/${categoryList[dragItem.current].ID}`);
        update(FirstItemRef, {
            order: categoryList[dragOverItem.current]?.order
        });
        const SecondItemRef = ref(
            database,
            `/ADMIN/CATEGORY/${categoryList[dragOverItem.current].ID}`
        );
        update(SecondItemRef, {
            order: categoryList[dragItem.current]?.order
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
        dragItem1.current = position;
    };

    const dragEnter1 = (e, position) => {
        dragOverItem1.current = position;
    };

    const drop1 = async (e, categoryItemId, categoryIndex) => {
        const parentNode = formateData(categoryList[dragItem.current]?.PRODUCT).sort(
            (a, b) => a?.order - b?.order
        );

        const FirstItem = parentNode[dragItem1.current];
        const secondItem = parentNode[dragOverItem1.current];

        if (FirstItem?.id != undefined && secondItem?.id != undefined) {
            const FirstItemRef = ref(
                database,
                `/ADMIN/CATEGORY/${categoryItemId}/PRODUCT/${FirstItem?.id}`
            );
            await update(FirstItemRef, {
                order: secondItem?.order
            });

            const SecondItemRef = ref(
                database,
                `/ADMIN/CATEGORY/${categoryItemId}/PRODUCT/${secondItem?.id}`
            );
            await update(SecondItemRef, {
                order: FirstItem?.order
            });
        }
        dragItem.current = null;
        dragOverItem.current = null;
        dragItem1.current = null;
        dragOverItem1.current = null;
    };

    function handleDrag(e) {
        const container = containerRef.current; // Get the scrollable container
        const scrollPosition = container.scrollTop;
        const containerHeight = container.clientHeight;
        const scrollThreshold = 50; // Set a threshold for scrolling

        const scrollUpAmount = Math.max(1, Math.ceil((scrollThreshold - e.clientY) / 10));
        const scrollDownAmount = Math.max(
            1,
            Math.ceil((e.clientY - (containerHeight - scrollThreshold)) / 10)
        );

        if (e.clientY < scrollThreshold && scrollPosition > 0) {
            // Scroll up if the drag position is near the top and there is room to scroll
            container.scrollTop -= scrollUpAmount;
        } else if (
            e.clientY > containerHeight - scrollThreshold &&
            scrollPosition + containerHeight < container.scrollHeight
        ) {
            // Scroll down if the drag position is near the bottom and there is room to scroll
            container.scrollTop += scrollDownAmount;
        }
    }

    const onClearProduct = () => {
        setProductName('');
        setProductPrice('');
        setProductImage('');
        setOpen(false);
    };

    return (
        <div ref={containerRef} style={{ height: '700px', overflow: 'auto' }}>
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => deleteCategory()}
                type={productType == 0 ? 'Category' : 'Product'}
            />
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
                                <StyledTableCell align='left'>ProductImage</StyledTableCell>
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
                                            <StyledTableCell align='left'>
                                                <ImageModal
                                                    imageStyle={styles.imgStyle2}
                                                    url={
                                                        item.image != ''
                                                            ? window.URL.createObjectURL(item.image)
                                                            : ''
                                                    }
                                                />
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </>
                                ))}
                        </TableBody>
                    </Table>
                ) : null}
                <br />
                <div>
                    {categoryList.length != 0 ? (
                        <text style={styles.title}>CATEGORY_LIST</text>
                    ) : null}
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
                                        ProductImage
                                    </StyledTableCell>
                                    <StyledTableCell align='left' style={{ width: '20%' }}>
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
                                                onDrag={(e) => handleDrag(e)}
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
                                                <StyledTableCell
                                                    align='left'
                                                    style={styles.width10}
                                                ></StyledTableCell>
                                                <StyledTableCell style={{ width: '20%' }}>
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
                                                <StyledTableCell
                                                    align='left'
                                                    style={styles.width10}
                                                >
                                                    <Delete
                                                        onClick={() => {
                                                            setCategoryId(item.ID);
                                                            setProductId(null);
                                                            setProductType(0);
                                                            setIsVisible(true);
                                                        }}
                                                    ></Delete>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            {item.PRODUCT
                                                ? formateData(item.PRODUCT)
                                                      .sort((a, b) => a?.order - b?.order)
                                                      .map((item1, index1) => {
                                                          return (
                                                              <StyledTableRow
                                                                  draggable
                                                                  onDragStart={(e) => {
                                                                      dragStart1(e, index1);
                                                                      dragStart(e, index);
                                                                  }}
                                                                  onDragEnter={(e) => {
                                                                      dragEnter1(e, index1);
                                                                      dragEnter(e, index);
                                                                  }}
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
                                                                      {index +
                                                                          1 +
                                                                          '.' +
                                                                          (index1 + 1)}
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
                                                                      style={{
                                                                          width: '35%'
                                                                      }}
                                                                  >
                                                                      {item1?.image ? (
                                                                          <ImageModal
                                                                              imageStyle={
                                                                                  styles.imgStyle2
                                                                              }
                                                                              url={item1?.image}
                                                                          />
                                                                      ) : (
                                                                          '-'
                                                                      )}
                                                                  </StyledTableCell1>

                                                                  <StyledTableCell1
                                                                      align='left'
                                                                      style={{ width: '20%' }}
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
                                                                              setProductImage(
                                                                                  item1.image
                                                                              );
                                                                              setProductId(
                                                                                  item1.id
                                                                              );
                                                                              setCategoryId(
                                                                                  item.ID
                                                                              );
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
                                                                          onClick={() => {
                                                                              setCategoryId(
                                                                                  item.ID
                                                                              );
                                                                              setProductId(
                                                                                  item1.id
                                                                              );
                                                                              setProductType(1);
                                                                              setIsVisible(true);
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
            </div>
            <ToastContainer />
            <Modal onClose={() => setOpen(false)} open={open} style={styles.modal}>
                <div style={styles.modalDiv}>
                    {loading ? <LoadingSpinner /> : null}
                    <Button
                        onClick={() => {
                            onClearProduct();
                            setOpen(false);
                        }}
                        style={styles.closeBtn}
                    >
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
                    <div>
                        <text>Select Product Image: </text>
                        <br />
                        <input
                            style={styles.marginTopView}
                            type='file'
                            accept='image/*'
                            onChange={imgFilehandler1}
                        />
                        {productImage ? (
                            <>
                                <hr />
                                <div>
                                    <h2>Preview</h2>
                                    <div style={styles.rowWrap}>
                                        <div
                                            style={{
                                                marginRight: 20
                                            }}
                                        >
                                            <ImageModal
                                                imageStyle={styles.imgStyle2}
                                                url={
                                                    typeof productImage === 'string'
                                                        ? productImage
                                                        : productImage != ''
                                                        ? window.URL.createObjectURL(productImage)
                                                        : ''
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
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
                                                price: productPrice,
                                                image: productImage
                                            }
                                        ]);
                                        onClearProduct();
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
