import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const uploadProductImage = async (imgfile) => {
  console.log("file :::",imgfile)
  return new Promise((resolve,reject)=>{
    const storage=getStorage()
    const storageRef = ref(storage, `ProductImages/${imgfile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgfile);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        reject(error)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL)
        });
      }
    );
  })

  };