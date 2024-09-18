// src/components/ImageUploader.js

import React, { useState } from 'react';

function ImageUploader({ onImageLoad }) {
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageLoad(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return <input type="file" accept="image/*" onChange={handleImageChange} />;
}

export default ImageUploader;
