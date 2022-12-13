import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const uploadProductImage = async (imgfile) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `ProductImages/${imgfile.name}`);
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
