import React, { useState } from 'react';
import Lightbox from 'react-modal-image/lib/Lightbox';

export default function ImageModal({ url, imageStyle, disable }) {
    const [openImage, setOpenImage] = useState(false);
    return (
        <div>
            <img
                src={url}
                loading='lazy'
                onClick={() => {
                    if (!disable) {
                        setOpenImage(true);
                    }
                }}
                style={imageStyle}
            />
            {openImage ? <Lightbox large={url} onClose={() => setOpenImage(false)} /> : null}
        </div>
    );
}
