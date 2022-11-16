import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { database } from 'configs/firebaseConfig';
import { set,ref as dataRef } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';
import { Button } from '@material-ui/core';
import LoadingSpinner from 'components/Spinner/LoadingSpinner';
import { useTheme } from 'react-jss';
function AddProduct() {
  const [imgfile, setImageFile] = useState('')
  const [progress,setProgress]=useState(0)
  const [productName,setProductName]=useState('')
  const [productDesc,setProductDesc]=useState('')
  const [loading,setLoading]=useState(false)
  const imgFilehandler = (e) => {
    console.log(e.target.files)
        setImageFile(e.target.files[0])
  }
   const createProduct=async(downloadURL)=>{
    try{
       if(productName&&productDesc&&imgfile)
       {
        const id=uuid().slice(0,8)
        const starCount=dataRef(database,`/ADMIN/PRODUCT/${id}`)
        await set(starCount,{
          ID: id,
          productName:productName,
          productImage:downloadURL,
          prodductDescription:productDesc
        })
        notify("Product has been successfully created!",1)
        setProductName('')
        setProductDesc('')
        setImageFile('')
       }
       else{
        notify('All Field Are Mendatory!',0)
       }
       setLoading(false)

    }
    catch(error)
    {
       setLoading(false)

         console.log(error)
    }
   }
   const uploadProductImage = async () => {
    setLoading(true)

    try{
    const storage=getStorage()
    const storageRef = ref(storage, `ProductImages/${imgfile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgfile);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setProgress(progress)
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
       setLoading(false)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          createProduct(downloadURL)

        });
      }
    );
    }
    catch(error)
    {
        console.log(error)
    }
  };
  const theme=useTheme()
const inputStyle={
    height:'45px',
    width:'40vw',
    borderRadius:10,
    outline:'none',
    paddingInline:"10px",
    border:'2px solid black',
    marginTop:'10px'
  }
  const textareaStyle={
    ...inputStyle,
    height:'100px',
    padding:'10px',
    width:'70vw'
  }
  const btnStyle={
        background:theme.color.veryDarkGrayishBlue,
        color:'white',
        position:'absolute',
        right:'15%',
        padding:'1em',
        top:'14%'
  }
  const imgStyle={
    height:'30vh',
    width:'20vw', 
    borderRadius:10,
    marginTop:'20px'
}
    const textStyle={
    }
  return (
      <div>
        {
            loading?<LoadingSpinner/>:null
        }
       <Button 
       onClick={()=>uploadProductImage()}
       style={btnStyle}>Upload Product</Button>
        <text>Enter Product Name: </text>
             <br/>
              <input
              value={productName}
              onChange={e=>setProductName(e.target.value)}
              style={inputStyle}/>
             <div style={{marginTop:"20px",marginBottom:'20px'}}>
             <text>Enter Product Description: </text>
             <br/>
              <textarea
              value={productDesc}
              onChange={e=>setProductDesc(e.target.value)}
              style={textareaStyle}
              />
             </div>
          <h2>Upload</h2>
          <input style={{marginTop:'20px'}} type="file" onChange={imgFilehandler} />
          <hr />
         <div>
         <h2>Preview</h2>
              <span>
                <img src={imgfile!=''?URL.createObjectURL(imgfile):''}
                style={imgStyle}
                alt="Photo" />
              </span>
          </div>
              <ToastContainer/>

      </div>
  );
}
export default AddProduct;