import ImagePicker from 'components/ImagePicker';
import React, { useState } from 'react';

const ImagePickerWithLabel = ({ onChange }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageSelected = (file) => {
        setSelectedFile(file);
        onChange(file);
    };

    return (
        <div>
            <h1>Image Picker Example</h1>
            <ImagePicker onChange={handleImageSelected} />
            {selectedFile && (
                <div>
                    <h2>Selected Image</h2>
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt='Selected'
                        style={{ maxWidth: '300px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImagePickerWithLabel;
