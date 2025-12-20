import React, { useState, useRef } from 'react';
import './styles/globals.css';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import ImageUploader from './components/ImageUploader';
import ImageCanvas from './components/ImageCanvas';
import { Mail, Send, User, MessageSquare, Menu, X } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appStep, setAppStep] = useState('upload'); // upload, edit, preview
  const [imageSrc, setImageSrc] = useState(null);
  const [gridSize, setGridSize] = useState({ horizontal: 3, vertical: 3 });
  const [selectedArea, setSelectedArea] = useState(null);
  const [isCreatingGif, setIsCreatingGif] = useState(false);
  const [previewStyle, setPreviewStyle] = useState(null);
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error
  const canvasRef = useRef(null);

  const handleImageUpload = (src) => {
    setImageSrc(src);
    setAppStep('edit');
    setPreviewStyle(null);
    setSelectedArea(null);
  };

  const handleStartNew = () => {
    setImageSrc(null);
    setAppStep('upload');
    setPreviewStyle(null);
    setSelectedArea(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const myForm = e.target;
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => setFormStatus('success'))
      .catch((error) => {
        alert(error);
        setFormStatus('error');
      });
  };

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
      setAppStep('preview');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen bg-background text-foreground overflow-hidden font-serif selection:bg-primary selection:text-primary-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/95 backdrop-blur-sm z-30">
        <h1 className="text-xl font-bold tracking-widest text-primary font-serif">MUYBRIDGE MACHINE</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar Controls */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 w-80 md:relative md:w-96 border-r border-border bg-card/95 backdrop-blur-sm 
        flex flex-col z-20 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
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
                <ImageUploader onImageLoad={handleImageUpload} />
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
                <span className="w-2 h-2 bg-primary rounded-full"></span> Progress
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={handleStartNew}
                  variant="outline"
                  className="w-full justify-start font-mono text-xs h-10 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary"
                >
                  [0] Start New Study
                </Button>
                {imageSrc && appStep !== 'edit' && (
                  <Button
                    onClick={() => setAppStep('edit')}
                    variant="outline"
                    className="w-full justify-start font-mono text-xs h-10 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary"
                  >
                    [1] Adjust Selection
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
        <div className="flex-1 relative flex flex-col items-center justify-start md:justify-center p-4 md:p-12 overflow-y-auto">
          {/* Editor Step - Always mounted if image exists to preserve ref */}
          {imageSrc && (
            <div className={`${appStep === 'edit' ? 'flex' : 'hidden'} w-full flex-col items-center gap-8 animate-in zoom-in-95 duration-500 fade-in`}>
              <div className="relative max-w-full shadow-2xl">
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

              <Button
                onClick={handleGenerateAnimation}
                disabled={!selectedArea}
                className={`w-full max-w-sm font-mono text-sm uppercase tracking-widest h-14 shadow-xl transition-all duration-500 ${selectedArea
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
                  }`}
              >
                {selectedArea ? "Make GIF" : "Select Area to Continue"}
              </Button>
            </div>
          )}

          {/* Result Step */}
          {imageSrc && appStep === 'preview' && (
            <div className="text-center w-full max-w-4xl space-y-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="space-y-4">
                <h2 className="text-4xl font-serif text-white/90 tracking-wide">Study Result</h2>
                <p className="font-mono text-white/50 text-xs uppercase tracking-widest">Motion Cycle Extraction complete</p>
              </div>

              <div className="flex flex-col items-center gap-8">
                <Card className="bg-black/40 border-white/10 shadow-2xl overflow-hidden p-8 backdrop-blur-xl">
                  <div
                    className="border border-primary/20 rounded-sm bg-background shadow-inner mx-auto"
                    style={previewStyle}
                  />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  <Button
                    onClick={handleCreateGif}
                    disabled={isCreatingGif}
                    className="font-mono text-xs uppercase tracking-widest h-12 bg-primary text-primary-foreground"
                  >
                    [1] {isCreatingGif ? 'Processing...' : 'Download GIF'}
                  </Button>
                  <Button
                    onClick={handleGenerateSequence}
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-widest h-12 border-white/20 text-white/80 hover:bg-white/5"
                  >
                    [2] Download ZIP
                  </Button>
                  <Button
                    onClick={() => setAppStep('edit')}
                    variant="outline"
                    className="font-mono text-xs uppercase tracking-widest h-12 border-white/20 text-white/80 hover:bg-white/5"
                  >
                    [3] Adjust Grid
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Landing Step */}
          {appStep === 'upload' && (
            <div className="text-center max-w-2xl relative pt-4 md:pt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl -z-10"></div>

              <div className="space-y-6 mb-12">
                <h2 className="text-4xl md:text-5xl font-serif text-white/90 tracking-wide leading-tight">Begin Your<br />Motion Study</h2>
                <p className="font-mono text-white/50 text-sm max-w-md mx-auto leading-relaxed">
                  Upload a sequential image series to analyze movement patterns, generate frames, and create digital motion loops.
                </p>
              </div>

              <div className="max-w-md mx-auto mb-16">
                <ImageUploader onImageLoad={handleImageUpload} />
              </div>

              <div className="border-t border-white/10 pt-8 opacity-40 hover:opacity-100 transition-opacity">
                <h3 className="text-sm font-mono text-white/50 mb-4 uppercase tracking-widest">Historical Context</h3>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/73/The_Horse_in_Motion.jpg"
                  alt="The Horse in Motion"
                  className="w-full rounded-sm grayscale contrast-125 mb-8"
                />

                <div className="aspect-video w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-black/40 mb-8">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Nlbm3Os81_A"
                    title="Eadweard Muybridge: The Horse in Motion"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {/* Contact Section - Always visible at bottom of scroll area */}
          <div className="w-full max-w-2xl border-t border-white/10 pt-8 mt-16 pb-12">
            <h3 className="text-lg font-serif text-white/70 mb-6 tracking-wide flex items-center gap-2">
              <Mail className="w-4 h-4" /> Correspondence
            </h3>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                {formStatus === 'success' ? (
                  <div className="text-center py-8 space-y-4 animate-in fade-in duration-500">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-serif text-white/90">Dispatch Received</h3>
                    <p className="text-xs font-mono text-white/50">Your correspondence has been logged in the archives.</p>
                    <Button
                      onClick={() => setFormStatus('idle')}
                      variant="outline"
                      className="font-mono text-xs uppercase tracking-widest border-white/10 hover:bg-white/5 text-white/70"
                    >
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form
                    name="contact"
                    onSubmit={handleSubmit}
                    data-netlify="true"
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                            <User className="w-3 h-3" /> Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="E.g. Eadweard M."
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Electronic Mail
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="studio@example.com"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" /> Inquiry
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          placeholder="Regarding the motion studies..."
                          required
                          className="w-full bg-black/20 border border-white/10 rounded-sm px-3 py-2 text-sm font-mono text-white/90 placeholder:text-white/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={formStatus === 'submitting'}
                        className="w-full font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 h-10 gap-2"
                      >
                        {formStatus === 'submitting' ? (
                          'Transmitting...'
                        ) : (
                          <>
                            <Send className="w-3 h-3" /> Send Dispatch
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar / Footer */}
        <div className="h-12 border-t border-white/10 bg-[#1a1a1a] flex items-center px-6 justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <div className="truncate mr-2">System Ready</div>
          <div className="hidden sm:block">Canvas: {imageSrc ? 'Active' : 'Empty'}</div>
          <div>v1.0.0</div>
        </div>
      </main>
    </div>
  );
}

export default App;
