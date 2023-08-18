import React, { useRef, useState } from 'react';

const ImagePicker = ({ onChange, label, selectedImage }) => {
    const [localImage, setLocalImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            const imageURL = URL.createObjectURL(imageFile);
            setLocalImage(imageURL);
            onChange(imageFile); // Pass the selected image file back to parent component
        }
    };

    const image = selectedImage ? selectedImage : localImage;

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const buttonStyle = {
        width: '200px',
        height: '200px',
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        borderRadius: '10px'
    };

    const imageStyle = {
        maxHeight: '195px',
        maxWidth: '100%',
        borderRadius: '10px'
    };

    return (
        <div>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            <input
                type='file'
                accept='image/*'
                style={{
                    display: 'none'
                }}
                ref={fileInputRef}
                onChange={handleImageChange}
            />
            <div onClick={handleButtonClick} style={buttonStyle}>
                {image ? (
                    <img src={image} alt='Selected' style={imageStyle} />
                ) : (
                    <label>Select Image</label>
                )}
            </div>
        </div>
    );
};

export default ImagePicker;
