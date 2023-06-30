import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { formateData } from 'util/formateData';
import styles from './styles';
import ImageModal from 'components/ImageModal/ImageModal';
import { Delete } from '@material-ui/icons';
import { deleteProductImage, uploadProductImage } from 'util/uploadProductImage';
import { Button } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

export default function CategoryImages(props) {
    const { categoryId } = props.location.state;

    const [imagesFile, setImagesFile] = useState([]);
    const [photoList, setPhotoList] = useState([]);
    useEffect(() => {
        getPhotos();
    }, []);

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
                    name: item.name,
                    url: url
                });
            });
            setImagesFile([]);
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
                multiple
                onChange={(e) => setImagesFile(formateData(e.target.files))}
            />
            {imagesFile.length != 0 ? (
                <>
                    <hr />
                    <div>
                        <h2>Preview</h2>
                        <div
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                flex: 1,
                                backgroundColor: 'red'
                            }}
                        >
                            {imagesFile.map((item) => {
                                return (
                                    <div
                                        style={{
                                            marginRight: 20,
                                            backgroundColor: 'blue',
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
            <div
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}
            >
                {photoList.map((item) => {
                    console.log('getted images', item);
                    return (
                        <div
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <ImageModal
                                imageStyle={styles.imgStyle}
                                url={item != '' ? item.url : ''}
                            />
                            <Delete onClick={() => deleteImage(item.ID, item.name)}></Delete>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
