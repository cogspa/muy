import React, { useState, useRef } from 'react';
import './styles/globals.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import ImageUploader from './components/ImageUploader';
import ImageCanvas from './components/ImageCanvas';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [gridSize, setGridSize] = useState({ horizontal: 3, vertical: 3 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [isCreatingGif, setIsCreatingGif] = useState(false);
  const canvasRef = useRef(null);

  const handleGenerateSequence = () => {
    if (canvasRef.current) {
      canvasRef.current.generateImageSequence();
    }
  };

  const handleCreateGif = () => {
    if (canvasRef.current) {
      setIsCreatingGif(true);
      canvasRef.current.createGif();
      // Reset loading state after a reasonable timeout
      setTimeout(() => setIsCreatingGif(false), 5000);
    }
  };

  const handleGenerateAnimation = () => {
    if (canvasRef.current) {
      canvasRef.current.generateAnimation();
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Muybridge Machine</h1>
        <div className="flex justify-center mb-8">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/7/73/The_Horse_in_Motion.jpg" 
            alt="The Horse in Motion by Eadweard Muybridge (1878)" 
            className="max-w-2xl w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          <p className="mb-2">Create your own motion studies inspired by Eadweard Muybridge:</p>
          <ol className="text-left list-decimal list-inside space-y-2">
            <li>Upload an image containing sequential motion</li>
            <li>Adjust the grid to divide your image into frames</li>
            <li>Generate an animation sequence or create a GIF</li>
            <li>Download your animation to share or study</li>
          </ol>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select an image to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader onImageLoad={setImageSrc} />
            </CardContent>
          </Card>

          {imageSrc && (
            <Card>
              <CardHeader>
                <CardTitle>Grid Settings</CardTitle>
                <CardDescription>Adjust the grid dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Horizontal Boxes</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={gridSize.horizontal}
                    onChange={e => setGridSize({ ...gridSize, horizontal: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Vertical Boxes</label>
                  <input
                    type="number"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={gridSize.vertical}
                    onChange={e => setGridSize({ ...gridSize, vertical: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {imageSrc && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
                <CardDescription>View and analyze the image with grid overlay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto">
                  <ImageCanvas
                    ref={canvasRef}
                    imageSrc={imageSrc}
                    gridSize={gridSize}
                    selectedArea={selectedArea}
                    setSelectedArea={setSelectedArea}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button onClick={handleGenerateSequence} variant="outline">
                  Generate Image Sequence
                </Button>
                <Button 
                  onClick={handleCreateGif} 
                  variant="secondary"
                  disabled={isCreatingGif}
                >
                  {isCreatingGif ? 'Creating GIF...' : 'Create GIF'}
                </Button>
                <Button onClick={handleGenerateAnimation}>
                  Generate Animation
                </Button>
                {selectedArea && (
                  <Button onClick={() => setSelectedArea(null)} variant="destructive">
                    Clear Selection
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
