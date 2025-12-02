import React from 'react';

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

    return (
        <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-sm cursor-pointer bg-background/50 hover:bg-primary/5 border-primary/20 hover:border-primary/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg className="w-8 h-8 mb-3 text-primary/40 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1"><span className="font-bold text-primary">Click to upload</span></p>
                    <p className="text-[10px] text-muted-foreground/60 font-mono">SVG, PNG, JPG or GIF</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
        </div>
    );
}

export default ImageUploader;
