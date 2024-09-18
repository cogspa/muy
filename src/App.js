// In src/App.js

import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageCanvas from './components/ImageCanvas';

function App() {
    const [imageSrc, setImageSrc] = useState(null);
    const [gridSize, setGridSize] = useState({ horizontal: 5, vertical: 5 });
    const [selectedArea, setSelectedArea] = useState(null);  // This manages the selected area

    return (
        <div className="App">
            <h1>Image Grid Analyzer</h1>
            <ImageUploader onImageLoad={setImageSrc} />
            {imageSrc && (
                <>
                    <label>Horizontal Boxes:
                        <input
                            type="number"
                            value={gridSize.horizontal}
                            onChange={e => setGridSize({ ...gridSize, horizontal: parseInt(e.target.value) })}
                        />
                    </label>
                    <label>Vertical Boxes:
                        <input
                            type="number"
                            value={gridSize.vertical}
                            onChange={e => setGridSize({ ...gridSize, vertical: parseInt(e.target.value) })}
                        />
                    </label>
                    <ImageCanvas
                        imageSrc={imageSrc}
                        gridSize={gridSize}
                        selectedArea={selectedArea}  // Pass selectedArea as a prop
                        setSelectedArea={setSelectedArea}  // Pass setSelectedArea function as a prop
                    />
                </>
            )}
        </div>
    );
}

export default App;
