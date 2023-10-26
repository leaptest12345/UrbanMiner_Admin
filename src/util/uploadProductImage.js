import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from 'firebase/storage';

export const uploadLicences = async (imgfile) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `Licences/${imgfile?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imgfile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

export const uploadBlogVideo = async (videoFile) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${videoFile?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        // Handle paused state if needed
                        break;
                    case 'running':
                        // Handle running state if needed
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

export const uploadBlogImages = async (imgfile) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `Blog/${imgfile?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imgfile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

export const uploadProductImage = async (imgfile) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `ProductImages/${imgfile?.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imgfile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};

export const deleteProductImage = (imgfile) => {
    const storage = getStorage();
    const storageRef = ref(storage, `ProductImages/${imgfile}`);
    deleteObject(storageRef)
        .then(() => {
            console.log('succesfully deleted');
        })
        .catch((error) => {
            console.log('while uploading iamge', error);
        });
};
