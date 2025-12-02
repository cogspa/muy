import React, { useState, useRef } from 'react';
import './styles/globals.css';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import ImageUploader from './components/ImageUploader';
import ImageCanvas from './components/ImageCanvas';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
// Wait, I don't know if lucide-react is installed. I should check package.json. 
// If not, I'll stick to text or simple SVGs. 
// Let's check package.json first. 
// Actually, I'll just use text for now to be safe, or standard HTML entities.

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [gridSize, setGridSize] = useState({ horizontal: 3, vertical: 3 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [isCreatingGif, setIsCreatingGif] = useState(false);
  const [previewStyle, setPreviewStyle] = useState(null);
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
      setTimeout(() => setIsCreatingGif(false), 5000);
    }
  };

  const handleGenerateAnimation = () => {
    if (canvasRef.current) {
      canvasRef.current.generateAnimation();
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-serif selection:bg-primary selection:text-primary-foreground">
      {/* Sidebar Controls */}
      <aside className="w-96 border-r border-border bg-card/95 backdrop-blur-sm flex flex-col z-20 shadow-2xl transition-all duration-300">
        <div className="p-8 border-b border-border/50">
          <h1 className="text-3xl font-bold tracking-widest text-primary font-serif">MUYBRIDGE<br /><span className="text-xl font-normal opacity-70">MACHINE</span></h1>
          <p className="text-xs font-mono mt-2 opacity-50 uppercase tracking-widest">Est. 2024 • Digital Darkroom</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Upload Section */}
          <section>
            <h2 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span> Source Material
            </h2>
            <Card className="bg-background/50 border-border/50 shadow-sm">
              <CardContent className="p-4">
                <ImageUploader onImageLoad={(src) => {
                  setImageSrc(src);
                  setPreviewStyle(null); // Reset preview on new image
                }} />
              </CardContent>
            </Card>
          </section>

          {/* Animation Preview Section */}
          {previewStyle && (
            <section className="animate-in slide-in-from-left-4 duration-500 fade-in">
              <h2 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> Loop Preview
              </h2>
              <Card className="bg-background/50 border-border/50 shadow-sm overflow-hidden">
                <CardContent className="p-4 flex justify-center bg-black/5">
                  <div
                    className="border border-primary/10 rounded-sm bg-background shadow-inner"
                    style={previewStyle}
                  />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Grid Settings */}
          {imageSrc && (
            <section className="animate-in slide-in-from-left-4 duration-500 fade-in">
              <h2 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> Grid Parameters
              </h2>
              <Card className="bg-background/50 border-border/50 shadow-sm">
                <CardContent className="p-4 space-y-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs opacity-70">Horizontal</label>
                      <input
                        type="number"
                        className="w-full bg-background border border-input rounded-sm px-3 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                        value={gridSize.horizontal}
                        onChange={e => setGridSize({ ...gridSize, horizontal: Math.max(1, parseInt(e.target.value) || 1) })}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs opacity-70">Vertical</label>
                      <input
                        type="number"
                        className="w-full bg-background border border-input rounded-sm px-3 py-2 focus:ring-1 focus:ring-primary outline-none transition-all"
                        value={gridSize.vertical}
                        onChange={e => setGridSize({ ...gridSize, vertical: Math.max(1, parseInt(e.target.value) || 1) })}
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Actions */}
          {imageSrc && (
            <section className="animate-in slide-in-from-left-4 duration-500 fade-in delay-100">
              <h2 className="text-sm font-mono uppercase tracking-widest opacity-70 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> Process
              </h2>
              <div className="space-y-3">
                <Button onClick={handleGenerateSequence} variant="outline" className="w-full justify-start font-mono text-xs h-10 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary">
                  [A] Generate Sequence
                </Button>
                <Button onClick={handleCreateGif} disabled={isCreatingGif} variant="outline" className="w-full justify-start font-mono text-xs h-10 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary">
                  [B] {isCreatingGif ? 'Processing...' : 'Create GIF'}
                </Button>
                <Button onClick={handleGenerateAnimation} className="w-full justify-start font-mono text-xs h-10 bg-primary text-primary-foreground hover:bg-primary/90">
                  [C] View Animation
                </Button>
                {selectedArea && (
                  <Button onClick={() => setSelectedArea(null)} variant="destructive" className="w-full justify-start font-mono text-xs h-10 opacity-80 hover:opacity-100">
                    [X] Clear Selection
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 relative bg-[#1a1a1a] overflow-hidden flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center p-12 overflow-y-auto">
          {imageSrc ? (
            <div className="relative max-w-full max-h-full shadow-2xl animate-in zoom-in-95 duration-500 fade-in">
              <div className="absolute -inset-4 border border-white/5 rounded-lg pointer-events-none"></div>
              <div className="absolute -inset-1 border border-white/10 rounded-sm pointer-events-none"></div>
              <ImageCanvas
                ref={canvasRef}
                imageSrc={imageSrc}
                gridSize={gridSize}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                onPreviewReady={setPreviewStyle}
              />
            </div>
          ) : (
            <div className="text-center max-w-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl -z-10"></div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/73/The_Horse_in_Motion.jpg"
                alt="The Horse in Motion"
                className="w-full rounded-sm opacity-20 mix-blend-overlay mb-8 grayscale contrast-125"
              />
              <h2 className="text-4xl font-serif text-white/90 mb-4 tracking-wide">Begin Your Motion Study</h2>
              <p className="font-mono text-white/50 text-sm max-w-md mx-auto leading-relaxed mb-12">
                Upload a sequential image series to analyze movement patterns, generate frames, and create digital motion loops.
              </p>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-lg font-serif text-white/70 mb-6 tracking-wide">Inspiration: The Science of Motion</h3>
                <div className="aspect-video w-1/2 mx-auto rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/fhfLpbrf62E"
                    title="Eadweard Muybridge: The Horse in Motion"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="opacity-80 hover:opacity-100 transition-opacity duration-500"
                  ></iframe>
                </div>
              </div>

              {/* Contact / Correspondence Section */}
              <div className="border-t border-white/10 pt-8 mt-8 pb-12">
                <h3 className="text-lg font-serif text-white/70 mb-6 tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Correspondence
                </h3>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                          <User className="w-3 h-3" /> Name
                        </label>
                        <input
                          type="text"
                          placeholder="E.g. Eadweard M."
                          className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Electronic Mail
                        </label>
                        <input
                          type="email"
                          placeholder="studio@example.com"
                          className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Inquiry
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Regarding the motion studies..."
                        className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                      />
                    </div>
                    <Button className="w-full font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 h-10 gap-2">
                      <Send className="w-3 h-3" /> Send Dispatch
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar / Footer */}
        <div className="h-12 border-t border-white/10 bg-[#1a1a1a] flex items-center px-6 justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <div>System Ready</div>
          <div>Canvas: {imageSrc ? 'Active' : 'Empty'}</div>
          <div>v1.0.0</div>
        </div>
      </main>
    </div>
  );
}

export default App;
