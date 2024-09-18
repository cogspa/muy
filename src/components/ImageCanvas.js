import React, { useRef, useEffect, useState } from 'react';

const ImageCanvas = ({ imageSrc, gridSize }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [startPoint, setStartPoint] = useState(null);
    const [definingBox, setDefiningBox] = useState(null);
    const [drawMode, setDrawMode] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeCorner, setResizeCorner] = useState(null);
    const [imageSequence, setImageSequence] = useState([]); // Store the extracted frames
    const [keyframesStyle, setKeyframesStyle] = useState(null); // Store keyframes animation

    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 600;

    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imageRef.current = img;

            const aspectRatio = img.width / img.height;
            let scaledW = img.width;
            let scaledH = img.height;

            if (scaledW > MAX_WIDTH) {
                scaledW = MAX_WIDTH;
                scaledH = MAX_WIDTH / aspectRatio;
            }

            if (scaledH > MAX_HEIGHT) {
                scaledH = MAX_HEIGHT;
                scaledW = MAX_HEIGHT * aspectRatio;
            }

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
    };

    const handleMouseUp = () => {
        setStartPoint(null);
        setIsResizing(false);
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

    // Function to generate the image sequence from the grid
    const generateImageSequence = () => {
        if (!definingBox || !imageRef.current) return;

        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');

        const gridWidth = definingBox.width / gridSize.horizontal;
        const gridHeight = definingBox.height / gridSize.vertical;
        const sequence = [];

        for (let row = 0; row < gridSize.vertical; row++) {
            for (let col = 0; col < gridSize.horizontal; col++) {
                cropCanvas.width = gridWidth;
                cropCanvas.height = gridHeight;

                const sx = definingBox.x + col * gridWidth;
                const sy = definingBox.y + row * gridHeight;

                cropCtx.clearRect(0, 0, gridWidth, gridHeight);
                cropCtx.drawImage(
                    imageRef.current,
                    sx, sy, gridWidth, gridHeight,
                    0, 0, gridWidth, gridHeight
                );

                // Convert the canvas to a data URL and store it in the array
                sequence.push(cropCanvas.toDataURL());
            }
        }

        setImageSequence(sequence);  // Store the generated sequence
    };

    // Function to generate CSS keyframe animation
    const createKeyframeAnimation = () => {
        if (!imageSequence || imageSequence.length === 0) return;

        // Generate keyframe steps for each image in the sequence
        let keyframes = `@keyframes imageSequence {`;
        const step = 100 / imageSequence.length;

        imageSequence.forEach((image, index) => {
            keyframes += `
                ${step * index}% {
                    background-image: url(${image});
                }
            `;
        });

        keyframes += `
            100% {
                background-image: url(${imageSequence[0]});
            }
        `;

        keyframes += `}`;

        // Add the keyframes to the document head as a style element
        const styleElement = document.createElement('style');
        styleElement.innerHTML = keyframes;
        document.head.appendChild(styleElement);

        // Apply the animation to a div
        setKeyframesStyle({
            animation: 'imageSequence 2s steps(1) infinite',
            width: '200px',
            height: '200px',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        });
    };

    return (
        <div>
            <button onClick={toggleDrawMode}>{drawMode ? 'Finish Drawing Box' : 'Draw Box'}</button>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width: '100%', maxWidth: '800px', maxHeight: '600px', border: '1px solid black' }}
            />

            {/* Button to generate the image sequence */}
            <button onClick={generateImageSequence} disabled={!definingBox}>
                Generate Image Sequence
            </button>

            {/* Button to create the CSS animation */}
            <button onClick={createKeyframeAnimation} disabled={imageSequence.length === 0}>
                Generate Animation
            </button>

            {/* Display the animated image sequence */}
            {keyframesStyle && (
                <div style={keyframesStyle} className="animated-image-sequence">
                    {/* The CSS keyframe animation will be applied here */}
                </div>
            )}
        </div>
    );
};

export default ImageCanvas;
