import React, { useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';

import { Delete } from '@material-ui/icons';
import { Button } from '@material-ui/core';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

import ImageModal from 'components/ImageModal/ImageModal';

import { deleteProductImage, uploadProductImage } from 'util/uploadProductImage';
import { formateData } from 'util/formateData';

import styles from './styles';

export default function CategoryImages(props) {
    const { categoryId } = props.location.state;

    const [imagesFile, setImagesFile] = useState([]);
    const [photoList, setPhotoList] = useState([]);

    useEffect(() => {
        getPhotos();
    }, []);

    const history = useHistory();

    const getPhotos = () => {
        try {
            const refDetail = ref(database, `/ADMIN/CATEGORY_PHOTOS/${categoryId}`);
            onValue(refDetail, (snapShot) => {
                const arr = formateData(snapShot.val());
                setPhotoList(arr);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteImage = (id, name) => {
        deleteProductImage(name);
        const refDetail = ref(database, `/ADMIN/CATEGORY_PHOTOS/${categoryId}/${id}`);
        set(refDetail, null);
    };

    const onAddNewImage = async () => {
        if (imagesFile.length != 0) {
            imagesFile.map(async (item) => {
                const uniqueId = uuid().slice(0, 8);
                const url = await uploadProductImage(item);
                const refDetail = ref(database, `/ADMIN/CATEGORY_PHOTOS/${categoryId}/${uniqueId}`);
                set(refDetail, {
                    ID: uniqueId,
                    name: item?.name,
                    url: url
                });
            });
            setImagesFile([]);
            history.goBack();
        }
    };

    return (
        <div
            style={{
                flex: 1
            }}
        >
            <h2
                style={{
                    marginBottom: 30
                }}
            >
                Add New Image For This Category
            </h2>
            <input
                style={styles.marginTopView}
                type='file'
                accept='image/*'
                multiple
                onChange={(e) => setImagesFile(formateData(e.target.files))}
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
            <Button style={styles.btnStyle} onClick={() => onAddNewImage()}>
                ADD IMAGE
            </Button>
            <br />
            <div style={styles.rowWrap}>
                {photoList.map((item) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 20
                            }}
                        >
                            <ImageModal
                                imageStyle={styles.imgStyle}
                                url={item != '' ? item.url : ''}
                            />
                            <Delete
                                style={{ margin: 10 }}
                                onClick={() => deleteImage(item.ID, item?.name)}
                            ></Delete>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
