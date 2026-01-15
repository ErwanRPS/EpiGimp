import { useState, useEffect, useRef } from 'react';
import Workspace from '../components/Workspace';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function Editor() {
  const [canvasState, setCanvasState] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageHeight, setImageHeight] = useState(null);
  
  // Transformations
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [freeRotation, setFreeRotation] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    grayscale: false,
    sepia: false,
    contrast: 0,
  });
  
  // Crop
  const [cropMode, setCropMode] = useState(false);
  
  // Resize
  const [resizeWidth, setResizeWidth] = useState(null);
  const [resizeHeight, setResizeHeight] = useState(null);
  
  // Drawing
  const [drawingMode, setDrawingMode] = useState('none');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  // History (Undo/Redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 20;

  const handleImageLoad = (imageData, width, height) => {
    setOriginalImage(imageData);
    setCanvasState(imageData);
    setImageWidth(width);
    setImageHeight(height);
    setResizeWidth(width);
    setResizeHeight(height);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFreeRotation(0);
    setFilters({ grayscale: false, sepia: false, contrast: 0 });
    
    // Initialize history
    saveToHistory(imageData);
  };

  const saveToHistory = (state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      canvasState: state || canvasState,
      rotation,
      flipH,
      flipV,
      freeRotation,
      filters: {...filters},
      resizeWidth,
      resizeHeight,
    });
    
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      
      setCanvasState(prevState.canvasState);
      setRotation(prevState.rotation);
      setFlipH(prevState.flipH);
      setFlipV(prevState.flipV);
      setFreeRotation(prevState.freeRotation);
      setFilters(prevState.filters);
      setResizeWidth(prevState.resizeWidth);
      setResizeHeight(prevState.resizeHeight);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      setCanvasState(nextState.canvasState);
      setRotation(nextState.rotation);
      setFlipH(nextState.flipH);
      setFlipV(nextState.flipV);
      setFreeRotation(nextState.freeRotation);
      setFilters(nextState.filters);
      setResizeWidth(nextState.resizeWidth);
      setResizeHeight(nextState.resizeHeight);
      setHistoryIndex(newIndex);
    }
  };

  const handleRotateLeft = () => {
    const newRotation = (rotation - 90) % 360;
    setRotation(newRotation);
    saveToHistory();
  };

  const handleRotateRight = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    saveToHistory();
  };

  const handleFlipH = () => {
    setFlipH(!flipH);
    saveToHistory();
  };

  const handleFlipV = () => {
    setFlipV(!flipV);
    saveToHistory();
  };

  const handleApplyFilter = (filterType) => {
    const newFilters = { ...filters };
    
    if (filterType === 'grayscale') {
      newFilters.grayscale = !newFilters.grayscale;
      if (newFilters.grayscale) newFilters.sepia = false;
    } else if (filterType === 'sepia') {
      newFilters.sepia = !newFilters.sepia;
      if (newFilters.sepia) newFilters.grayscale = false;
    }
    
    setFilters(newFilters);
    saveToHistory();
  };

  const handleContrastChange = (value) => {
    setFilters({ ...filters, contrast: value });
  };

  const handleToggleCrop = () => {
    setCropMode(!cropMode);
    setDrawingMode('none');
  };

  const handleCropComplete = (croppedImage, width, height) => {
    setCanvasState(croppedImage);
    setImageWidth(width);
    setImageHeight(height);
    setResizeWidth(width);
    setResizeHeight(height);
    setCropMode(false);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setFreeRotation(0);
    saveToHistory(croppedImage);
  };

  const handleResize = (width, height) => {
    setResizeWidth(width);
    setResizeHeight(height);
    saveToHistory();
  };

  const handleFreeRotation = (angle) => {
    setFreeRotation(angle);
  };

  const handleSetDrawingMode = (mode) => {
    setDrawingMode(mode);
    setCropMode(false);
  };

  const handleCanvasUpdate = () => {
    // Save drawing state
    saveToHistory();
  };

  const handleExport = (format) => {
    // Get the main canvas
    const mainCanvas = document.querySelector('canvas');
    if (!mainCanvas) return;
    
    // Create export canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = mainCanvas.width;
    exportCanvas.height = mainCanvas.height;
    const ctx = exportCanvas.getContext('2d');
    
    // Draw main canvas
    ctx.drawImage(mainCanvas, 0, 0);
    
    // Draw drawing layer if exists
    const drawingCanvas = document.querySelectorAll('canvas')[1];
    if (drawingCanvas) {
      ctx.drawImage(drawingCanvas, 0, 0);
    }
    
    // Export
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `epigimp-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mimeType);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Header />
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        <Sidebar
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onFlipH={handleFlipH}
          onFlipV={handleFlipV}
          onApplyFilter={handleApplyFilter}
          filters={filters}
          onContrastChange={handleContrastChange}
          cropMode={cropMode}
          onToggleCrop={handleToggleCrop}
          onExport={handleExport}
          onResize={handleResize}
          currentWidth={resizeWidth}
          currentHeight={resizeHeight}
          onFreeRotation={handleFreeRotation}
          freeRotation={freeRotation}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          drawingMode={drawingMode}
          onSetDrawingMode={handleSetDrawingMode}
          brushColor={brushColor}
          onBrushColorChange={setBrushColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
        />
        <Workspace
          onImageLoad={handleImageLoad}
          rotation={rotation}
          flipH={flipH}
          flipV={flipV}
          filters={filters}
          cropMode={cropMode}
          onCropComplete={handleCropComplete}
          resizeWidth={resizeWidth}
          resizeHeight={resizeHeight}
          freeRotation={freeRotation}
          drawingMode={drawingMode}
          brushColor={brushColor}
          brushSize={brushSize}
          canvasState={canvasState}
          onCanvasUpdate={handleCanvasUpdate}
        />
      </div>
    </div>
  );
}

export default Editor;
