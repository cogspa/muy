import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import gifshot from 'gifshot';
import JSZip from 'jszip';

const ImageCanvas = forwardRef(({ imageSrc, gridSize, selectedArea, setSelectedArea }, ref) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [startPoint, setStartPoint] = useState(null);
    const [definingBox, setDefiningBox] = useState(null);
    const [drawMode, setDrawMode] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeCorner, setResizeCorner] = useState(null);
    const [imageSequence, setImageSequence] = useState([]); // Store the extracted frames
    const [keyframesStyle, setKeyframesStyle] = useState(null); // Store keyframes animation
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // Image size
    const [gridSizeDisplay, setGridSizeDisplay] = useState({ width: 0, height: 0 }); // Grid rectangle size
    const [redBoxSize, setRedBoxSize] = useState({ width: 0, height: 0 }); // Red box size
    const [dpiMessage, setDpiMessage] = useState(''); // DPI message
    const [gifLoading, setGifLoading] = useState(false);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [scaleFactor, setScaleFactor] = useState(1);

    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 600;
    const TARGET_DPI = 72;

    useImperativeHandle(ref, () => ({
        generateImageSequence: () => {
            if (!definingBox || !imageRef.current) return;
            
            const sequence = [];
            // Calculate original coordinates and dimensions
            const originalX = definingBox.x * scaleFactor;
            const originalY = definingBox.y * scaleFactor;
            const originalWidth = definingBox.width * scaleFactor;
            const originalHeight = definingBox.height * scaleFactor;
            const originalGridWidth = originalWidth / gridSize.horizontal;
            const originalGridHeight = originalHeight / gridSize.vertical;
            
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            // Use original resolution for output
            tempCanvas.width = originalGridWidth;
            tempCanvas.height = originalGridHeight;
            
            for (let i = 0; i < gridSize.vertical; i++) {
                for (let j = 0; j < gridSize.horizontal; j++) {
                    tempCtx.clearRect(0, 0, originalGridWidth, originalGridHeight);
                    tempCtx.drawImage(
                        imageRef.current,
                        originalX + j * originalGridWidth,
                        originalY + i * originalGridHeight,
                        originalGridWidth,
                        originalGridHeight,
                        0,
                        0,
                        originalGridWidth,
                        originalGridHeight
                    );
                    sequence.push(tempCanvas.toDataURL());
                }
            }
            
            // Create a zip file containing all images at original resolution
            const zip = new JSZip();
            sequence.forEach((dataUrl, index) => {
                const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
                zip.file(`frame_${index + 1}.png`, base64Data, { base64: true });
            });
            
            zip.generateAsync({ type: "blob" }).then(function(content) {
                const url = window.URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.download = "image_sequence.zip";
                link.click();
            });
        },
        createGif: () => {
            if (!definingBox || !imageRef.current) return;
            
            setGifLoading(true);
            const sequence = [];
            // Calculate original coordinates and dimensions
            const originalX = definingBox.x * scaleFactor;
            const originalY = definingBox.y * scaleFactor;
            const originalWidth = definingBox.width * scaleFactor;
            const originalHeight = definingBox.height * scaleFactor;
            const originalGridWidth = originalWidth / gridSize.horizontal;
            const originalGridHeight = originalHeight / gridSize.vertical;
            
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            // Use original resolution for output
            tempCanvas.width = originalGridWidth;
            tempCanvas.height = originalGridHeight;
            
            for (let i = 0; i < gridSize.vertical; i++) {
                for (let j = 0; j < gridSize.horizontal; j++) {
                    tempCtx.clearRect(0, 0, originalGridWidth, originalGridHeight);
                    tempCtx.drawImage(
                        imageRef.current,
                        originalX + j * originalGridWidth,
                        originalY + i * originalGridHeight,
                        originalGridWidth,
                        originalGridHeight,
                        0,
                        0,
                        originalGridWidth,
                        originalGridHeight
                    );
                    sequence.push(tempCanvas.toDataURL());
                }
            }
            
            gifshot.createGIF({
                images: sequence,
                gifWidth: originalGridWidth,
                gifHeight: originalGridHeight,
                interval: 0.2,
                numFrames: sequence.length,
                frameDuration: 1,
                sampleInterval: 10,
                numWorkers: 2
            }, function(obj) {
                setGifLoading(false);
                if(!obj.error) {
                    const image = obj.image;
                    const link = document.createElement('a');
                    link.href = image;
                    link.download = 'animation.gif';
                    link.click();
                } else {
                    console.error('Error creating GIF:', obj.errorMsg);
                }
            });
        },
        generateAnimation: () => {
            if (!definingBox || !imageRef.current) return;
            
            const sequence = [];
            // Calculate original coordinates and dimensions
            const originalX = definingBox.x * scaleFactor;
            const originalY = definingBox.y * scaleFactor;
            const originalWidth = definingBox.width * scaleFactor;
            const originalHeight = definingBox.height * scaleFactor;
            const originalGridWidth = originalWidth / gridSize.horizontal;
            const originalGridHeight = originalHeight / gridSize.vertical;
            
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = originalGridWidth;
            tempCanvas.height = originalGridHeight;
            
            for (let i = 0; i < gridSize.vertical; i++) {
                for (let j = 0; j < gridSize.horizontal; j++) {
                    tempCtx.clearRect(0, 0, originalGridWidth, originalGridHeight);
                    tempCtx.drawImage(
                        imageRef.current,
                        originalX + j * originalGridWidth,
                        originalY + i * originalGridHeight,
                        originalGridWidth,
                        originalGridHeight,
                        0,
                        0,
                        originalGridWidth,
                        originalGridHeight
                    );
                    sequence.push(tempCanvas.toDataURL());
                }
            }
            
            setImageSequence(sequence);
            createAnimationKeyframes(sequence);
        }
    }));

    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imageRef.current = img;
            
            // Store original dimensions
            setOriginalSize({ width: img.width, height: img.height });

            const assumedDPI = img.width > MAX_WIDTH ? 300 : 72;
            let scaledW = img.width;
            let scaledH = img.height;

            let dpiMessage = `Original DPI assumed: ${assumedDPI} DPI. `;
            if (assumedDPI !== TARGET_DPI) {
                const dpiFactor = assumedDPI / TARGET_DPI;
                scaledW = Math.round(img.width / dpiFactor);
                scaledH = Math.round(img.height / dpiFactor);
                setScaleFactor(dpiFactor);
                dpiMessage += `Converted to 72 DPI. New size: ${scaledW}px x ${scaledH}px.`;
            } else {
                dpiMessage += `Image is already 72 DPI.`;
                setScaleFactor(1);
            }
            setDpiMessage(dpiMessage);

            const aspectRatio = scaledW / scaledH;
            if (scaledW > MAX_WIDTH) {
                scaledW = MAX_WIDTH;
                scaledH = MAX_WIDTH / aspectRatio;
            }
            if (scaledH > MAX_HEIGHT) {
                scaledH = MAX_HEIGHT;
                scaledW = MAX_HEIGHT * aspectRatio;
            }

            setImageSize({ width: scaledW, height: scaledH });

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = scaledW;
            canvas.height = scaledH;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, scaledW, scaledH);

            if (definingBox) {
                drawDefiningBoxAndGrid(ctx);
            }
        };
    }, [imageSrc, definingBox, gridSize]);

    const toggleDrawMode = () => {
        setDrawMode(!drawMode);
        if (!drawMode) setDefiningBox(null);
    };

    const handleMouseDown = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (isInResizeHandle(mouseX, mouseY)) {
            setIsResizing(true);
            return;
        }

        if (!drawMode) return;

        setStartPoint({
            x: mouseX,
            y: mouseY
        });
        setDefiningBox({ x: mouseX, y: mouseY, width: 0, height: 0 });
    };

    const handleMouseMove = (event) => {
        if (!drawMode && !isResizing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;

        if (isResizing && definingBox) {
            const newBox = { ...definingBox };
            if (resizeCorner === 'bottom-right') {
                newBox.width = Math.min(currentX - definingBox.x, canvasRef.current.width - definingBox.x);
                newBox.height = Math.min(currentY - definingBox.y, canvasRef.current.height - definingBox.y);
            } else if (resizeCorner === 'top-left') {
                newBox.width = Math.min(definingBox.x + definingBox.width - currentX, definingBox.x);
                newBox.height = Math.min(definingBox.y + definingBox.height - currentY, definingBox.y);
                newBox.x = Math.max(currentX, 0);
                newBox.y = Math.max(currentY, 0);
            }
            setDefiningBox(newBox);
            return;
        }

        if (!startPoint) return;

        setDefiningBox({
            x: Math.max(0, Math.min(startPoint.x, currentX)),
            y: Math.max(0, Math.min(startPoint.y, currentY)),
            width: Math.abs(currentX - startPoint.x),
            height: Math.abs(currentY - startPoint.y)
        });

        // Update red box size in real-time
        setRedBoxSize({
            width: Math.abs(currentX - startPoint.x),
            height: Math.abs(currentY - startPoint.y)
        });
    };

    const handleMouseUp = () => {
        setStartPoint(null);
        setIsResizing(false);

        // Calculate the grid size (width and height of each rectangle)
        if (definingBox) {
            const gridWidth = definingBox.width / gridSize.horizontal;
            const gridHeight = definingBox.height / gridSize.vertical;
            setGridSizeDisplay({ width: gridWidth, height: gridHeight });
        }
    };

    const isInResizeHandle = (mouseX, mouseY) => {
        if (!definingBox) return false;
        const { x, y, width, height } = definingBox;
        const handleSize = 10;

        if (
            Math.abs(mouseX - (x + width)) < handleSize &&
            Math.abs(mouseY - (y + height)) < handleSize
        ) {
            setResizeCorner('bottom-right');
            return true;
        } else if (
            Math.abs(mouseX - x) < handleSize &&
            Math.abs(mouseY - y) < handleSize
        ) {
            setResizeCorner('top-left');
            return true;
        }

        return false;
    };

    const drawDefiningBoxAndGrid = (ctx) => {
        if (!imageRef.current) return; // Ensure image is fully loaded before drawing

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(imageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (!definingBox) return;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.strokeRect(definingBox.x, definingBox.y, definingBox.width, definingBox.height);

        const gridWidth = definingBox.width / gridSize.horizontal;
        const gridHeight = definingBox.height / gridSize.vertical;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize.horizontal; i++) {
            ctx.beginPath();
            ctx.moveTo(definingBox.x + i * gridWidth, definingBox.y);
            ctx.lineTo(definingBox.x + i * gridWidth, definingBox.y + definingBox.height);
            ctx.stroke();
        }
        for (let j = 0; j <= gridSize.vertical; j++) {
            ctx.beginPath();
            ctx.moveTo(definingBox.x, definingBox.y + j * gridHeight);
            ctx.lineTo(definingBox.x + definingBox.width, definingBox.y + j * gridHeight);
            ctx.stroke();
        }
    };

    const generateImageSequence = () => {
        if (!definingBox || !imageRef.current) return;
    
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
    
        // Determine the scale factor between the natural size of the image and its displayed size
        const scaleX = imageRef.current.naturalWidth / canvasRef.current.width;
        const scaleY = imageRef.current.naturalHeight / canvasRef.current.height;
    
        const gridWidth = definingBox.width / gridSize.horizontal;
        const gridHeight = definingBox.height / gridSize.vertical;
        const sequence = [];
    
        for (let row = 0; row < gridSize.vertical; row++) {
            for (let col = 0; col < gridSize.horizontal; col++) {
                cropCanvas.width = gridWidth;
                cropCanvas.height = gridHeight;
    
                // Adjust cropping coordinates based on scale
                const sx = (definingBox.x + col * gridWidth) * scaleX;
                const sy = (definingBox.y + row * gridHeight) * scaleY;
                const sWidth = gridWidth * scaleX;
                const sHeight = gridHeight * scaleY;
    
                cropCtx.clearRect(0, 0, gridWidth, gridHeight);
                cropCtx.drawImage(
                    imageRef.current,
                    sx, sy, sWidth, sHeight,
                    0, 0, gridWidth, gridHeight
                );
    
                // Convert the canvas to a data URL and store it in the array
                sequence.push(cropCanvas.toDataURL());
            }
        }
    
        setImageSequence(sequence);  // Store the generated sequence
    };
    
    const downloadImages = () => {
        imageSequence.forEach((imgSrc, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = imgSrc;
                link.download = `Image_${index + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 100); // Delay each download by 100ms
        });
    };
    

    const createAnimationKeyframes = (sequence) => {
        if (!sequence.length) return;

        // Create a style element for the keyframes
        const styleSheet = document.createElement('style');
        let keyframesRule = '@keyframes sequenceAnimation {';
        
        sequence.forEach((_, index) => {
            const percentage = (index / (sequence.length - 1)) * 100;
            keyframesRule += `
                ${percentage}% {
                    background-image: url('${sequence[index]}');
                }
            `;
        });
        
        keyframesRule += '}';
        styleSheet.textContent = keyframesRule;
        document.head.appendChild(styleSheet);

        // Set the animation style
        setKeyframesStyle({
            width: `${gridSizeDisplay.width}px`,
            height: `${gridSizeDisplay.height}px`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            animation: `sequenceAnimation ${sequence.length * 0.2}s steps(1) infinite`
        });
    };

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: drawMode ? 'crosshair' : 'default' }}
            />
            {dpiMessage && (
                <div className="mt-2 text-sm text-gray-600">
                    {dpiMessage}
                </div>
            )}
            {imageSize.width > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Image Size: {imageSize.width}px x {imageSize.height}px
                </div>
            )}
            {definingBox && (
                <div className="mt-2 text-sm text-gray-600">
                    Selected Area: {Math.round(redBoxSize.width)}px x {Math.round(redBoxSize.height)}px
                </div>
            )}
            {gridSizeDisplay.width > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    Grid Cell Size: {Math.round(gridSizeDisplay.width)}px x {Math.round(gridSizeDisplay.height)}px
                </div>
            )}
            {keyframesStyle && (
                <div 
                    className="mt-4 border rounded"
                    style={keyframesStyle}
                />
            )}
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={toggleDrawMode}
            >
                {drawMode ? 'Cancel Selection' : 'Select Area'}
            </button>
        </div>
    );
});

export default ImageCanvas;
