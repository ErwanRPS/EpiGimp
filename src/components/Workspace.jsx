import { useState, useRef, useEffect } from 'react';

function Workspace({ 
  onImageLoad,
  rotation,
  flipH,
  flipV,
  filters,
  cropMode,
  onCropComplete,
  resizeWidth,
  resizeHeight,
  freeRotation,
  drawingMode,
  brushColor,
  brushSize,
  canvasState,
  onCanvasUpdate
}) {
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(100);
  
  const mainCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  
  // Crop state
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);

  // Load image to canvas
  useEffect(() => {
    if (canvasState && mainCanvasRef.current) {
      const canvas = mainCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = resizeWidth || img.width;
        canvas.height = resizeHeight || img.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Free rotation
        if (freeRotation !== undefined && freeRotation !== 0) {
          ctx.rotate((freeRotation * Math.PI) / 180);
        }
        
        // Rotation (90° steps)
        if (rotation) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        
        // Flip
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // Apply filters
        if (filters) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          if (filters.grayscale) {
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              data[i] = avg;
              data[i + 1] = avg;
              data[i + 2] = avg;
            }
          }
          
          if (filters.sepia) {
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
              data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
              data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
            }
          }
          
          if (filters.contrast !== undefined && filters.contrast !== 0) {
            const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
            for (let i = 0; i < data.length; i += 4) {
              data[i] = factor * (data[i] - 128) + 128;
              data[i + 1] = factor * (data[i + 1] - 128) + 128;
              data[i + 2] = factor * (data[i + 2] - 128) + 128;
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
      };
      img.src = canvasState;
    }
  }, [canvasState, rotation, flipH, flipV, filters, resizeWidth, resizeHeight, freeRotation]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Veuillez importer une image PNG ou JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (onImageLoad) {
          onImageLoad(event.target.result, img.width, img.height);
        }
      };
      img.src = event.target.result;
      setError('');
      setZoom(100);
    };
    reader.onerror = () => {
      setError("Erreur lors du chargement de l'image.");
    };
    reader.readAsDataURL(file);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 10));
  const handleFitToScreen = () => setZoom(100);
  const triggerFileInput = () => document.getElementById('file-input').click();

  // Crop handlers
  const handleMouseDownCrop = (e) => {
    if (!cropMode || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({ x, y });
    setCropEnd({ x, y });
    setIsCropping(true);
  };

  const handleMouseMoveCrop = (e) => {
    if (!isCropping || !mainCanvasRef.current) return;
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropEnd({ x, y });
  };

  const handleMouseUpCrop = () => {
    if (!isCropping) return;
    setIsCropping(false);
    
    if (cropStart && cropEnd && onCropComplete && mainCanvasRef.current) {
      const canvas = mainCanvasRef.current;
      const scaleX = canvas.width / canvas.offsetWidth;
      const scaleY = canvas.height / canvas.offsetHeight;
      
      const x = Math.min(cropStart.x, cropEnd.x) * scaleX;
      const y = Math.min(cropStart.y, cropEnd.y) * scaleY;
      const width = Math.abs(cropEnd.x - cropStart.x) * scaleX;
      const height = Math.abs(cropEnd.y - cropStart.y) * scaleY;
      
      if (width > 10 && height > 10) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(x, y, width, height);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        onCropComplete(tempCanvas.toDataURL(), width, height);
      }
      
      setCropStart(null);
      setCropEnd(null);
    }
  };

  // Drawing handlers
  const handleMouseDownDraw = (e) => {
    if (drawingMode === 'none' || !drawingCanvasRef.current) return;
    const rect = drawingCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const handleMouseMoveDraw = (e) => {
    if (!isDrawing || !drawingCanvasRef.current) return;
    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x * scaleX, lastPos.y * scaleY);
    ctx.lineTo(x * scaleX, y * scaleY);
    
    if (drawingMode === 'brush') {
      ctx.strokeStyle = brushColor || '#000000';
      ctx.globalCompositeOperation = 'source-over';
    } else if (drawingMode === 'eraser') {
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.globalCompositeOperation = 'destination-out';
    }
    
    ctx.lineWidth = (brushSize || 5) * scaleX;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const handleMouseUpDraw = () => {
    setIsDrawing(false);
    setLastPos(null);
    
    if (drawingCanvasRef.current && onCanvasUpdate) {
      onCanvasUpdate();
    }
  };

  useEffect(() => {
    if (drawingCanvasRef.current && mainCanvasRef.current) {
      const drawingCanvas = drawingCanvasRef.current;
      const mainCanvas = mainCanvasRef.current;
      drawingCanvas.width = mainCanvas.width;
      drawingCanvas.height = mainCanvas.height;
    }
  }, [canvasState]);

  const getCursor = () => {
    if (cropMode) return 'crosshair';
    if (drawingMode === 'brush') return 'crosshair';
    if (drawingMode === 'eraser') return 'cell';
    return 'default';
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ecf0f1',
      overflow: 'hidden',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <button onClick={triggerFileInput} style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          📁 Importer
        </button>

        {canvasState && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginLeft: 'auto',
          }}>
            <button onClick={handleZoomOut} disabled={zoom <= 10} style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: zoom <= 10 ? 'not-allowed' : 'pointer',
              opacity: zoom <= 10 ? 0.5 : 1,
            }}>➖</button>
            <span style={{ fontWeight: 600, minWidth: '50px', textAlign: 'center' }}>
              {zoom}%
            </span>
            <button onClick={handleZoomIn} disabled={zoom >= 200} style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: zoom >= 200 ? 'not-allowed' : 'pointer',
              opacity: zoom >= 200 ? 0.5 : 1,
            }}>➕</button>
            <button onClick={handleFitToScreen} style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>Ajuster</button>
          </div>
        )}

        <input
          id="file-input"
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        padding: '2rem',
        position: 'relative',
      }}>
        {error && (
          <div style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '4px',
            textAlign: 'center',
          }}>⚠️ {error}</div>
        )}

        {!canvasState && !error && (
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            <p style={{ fontSize: '1.2rem' }}>Aucune image importée</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Cliquez sur "Importer" pour commencer
            </p>
          </div>
        )}

        {canvasState && !error && (
          <div style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
          }}>
            <canvas
              ref={mainCanvasRef}
              style={{
                maxWidth: `${zoom}%`,
                maxHeight: `${zoom}%`,
                display: 'block',
                border: cropMode ? '2px dashed #3498db' : 'none',
              }}
            />
            <canvas
              ref={drawingCanvasRef}
              onMouseDown={drawingMode !== 'none' ? handleMouseDownDraw : cropMode ? handleMouseDownCrop : undefined}
              onMouseMove={drawingMode !== 'none' ? handleMouseMoveDraw : cropMode ? handleMouseMoveCrop : undefined}
              onMouseUp={drawingMode !== 'none' ? handleMouseUpDraw : cropMode ? handleMouseUpCrop : undefined}
              onMouseLeave={drawingMode !== 'none' ? handleMouseUpDraw : undefined}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                maxWidth: `${zoom}%`,
                maxHeight: `${zoom}%`,
                cursor: getCursor(),
                pointerEvents: (cropMode || drawingMode !== 'none') ? 'auto' : 'none',
              }}
            />
            {cropStart && cropEnd && (
              <div style={{
                position: 'absolute',
                left: Math.min(cropStart.x, cropEnd.x),
                top: Math.min(cropStart.y, cropEnd.y),
                width: Math.abs(cropEnd.x - cropStart.x),
                height: Math.abs(cropEnd.y - cropStart.y),
                border: '2px solid #3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                pointerEvents: 'none',
              }}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workspace;
