import { useState } from 'react';

function Sidebar({ 
  onRotateLeft,
  onRotateRight,
  onFlipH,
  onFlipV,
  onApplyFilter,
  filters,
  onContrastChange,
  cropMode,
  onToggleCrop,
  onExport,
  onResize,
  currentWidth,
  currentHeight,
  onFreeRotation,
  freeRotation,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  drawingMode,
  onSetDrawingMode,
  brushColor,
  onBrushColorChange,
  brushSize,
  onBrushSizeChange
}) {
  const [activeSection, setActiveSection] = useState(null);
  const [resizeWidth, setResizeWidth] = useState(currentWidth || 800);
  const [resizeHeight, setResizeHeight] = useState(currentHeight || 600);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [exportFormat, setExportFormat] = useState('png');

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleResizeWidthChange = (e) => {
    const width = parseInt(e.target.value);
    setResizeWidth(width);
    if (keepAspectRatio && currentWidth && currentHeight) {
      const ratio = currentHeight / currentWidth;
      setResizeHeight(Math.round(width * ratio));
    }
  };

  const handleResizeHeightChange = (e) => {
    const height = parseInt(e.target.value);
    setResizeHeight(height);
    if (keepAspectRatio && currentWidth && currentHeight) {
      const ratio = currentWidth / currentHeight;
      setResizeWidth(Math.round(height * ratio));
    }
  };

  const applyResize = () => {
    if (onResize) {
      onResize(resizeWidth, resizeHeight);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(exportFormat);
    }
  };

  const buttonStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    width: '100%',
    marginBottom: '0.3rem',
  };

  const sectionButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#34495e',
    fontWeight: 600,
    marginBottom: '0.5rem',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
  };

  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#34495e',
      color: 'white',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          marginTop: 0,
          marginBottom: '1rem',
          fontSize: '1.1rem',
          borderBottom: '2px solid #2c3e50',
          paddingBottom: '0.5rem',
        }}>
          🛠️ Outils d'édition
        </h3>

        {/* Undo/Redo */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onUndo} disabled={!canUndo} style={{
              ...buttonStyle,
              opacity: canUndo ? 1 : 0.5,
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}>
              ↶ Annuler
            </button>
            <button onClick={onRedo} disabled={!canRedo} style={{
              ...buttonStyle,
              opacity: canRedo ? 1 : 0.5,
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}>
              ↷ Rétablir
            </button>
          </div>
        </div>

        {/* Rotation & Flip */}
        <button onClick={() => toggleSection('transform')} style={sectionButtonStyle}>
          {activeSection === 'transform' ? '▼' : '▶'} Rotation & Miroir
        </button>
        {activeSection === 'transform' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <button onClick={onRotateLeft} style={buttonStyle}>↶ Rotation Gauche</button>
            <button onClick={onRotateRight} style={buttonStyle}>↷ Rotation Droite</button>
            <button onClick={onFlipH} style={buttonStyle}>↔ Flip Horizontal</button>
            <button onClick={onFlipV} style={buttonStyle}>↕ Flip Vertical</button>
          </div>
        )}

        {/* Free Rotation */}
        <button onClick={() => toggleSection('freeRotation')} style={sectionButtonStyle}>
          {activeSection === 'freeRotation' ? '▼' : '▶'} Rotation Libre
        </button>
        {activeSection === 'freeRotation' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Angle: {freeRotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={freeRotation || 0}
                onChange={(e) => onFreeRotation(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
            <button onClick={() => onFreeRotation(0)} style={buttonStyle}>Réinitialiser</button>
          </div>
        )}

        {/* Filters */}
        <button onClick={() => toggleSection('filters')} style={sectionButtonStyle}>
          {activeSection === 'filters' ? '▼' : '▶'} Filtres
        </button>
        {activeSection === 'filters' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <button 
              onClick={() => onApplyFilter('grayscale')} 
              style={filters?.grayscale ? activeButtonStyle : buttonStyle}
            >
              ⬛ Noir & Blanc
            </button>
            <button 
              onClick={() => onApplyFilter('sepia')} 
              style={filters?.sepia ? activeButtonStyle : buttonStyle}
            >
              🟫 Sépia
            </button>
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Contraste: {filters?.contrast || 0}</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={filters?.contrast || 0}
                onChange={(e) => onContrastChange(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '0.3rem' }}
              />
            </div>
          </div>
        )}

        {/* Crop */}
        <button onClick={() => toggleSection('crop')} style={sectionButtonStyle}>
          {activeSection === 'crop' ? '▼' : '▶'} Découpage
        </button>
        {activeSection === 'crop' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <button 
              onClick={onToggleCrop} 
              style={cropMode ? activeButtonStyle : buttonStyle}
            >
              ✂️ {cropMode ? 'Annuler Sélection' : 'Activer Découpage'}
            </button>
            {cropMode && (
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
                Faites glisser sur l'image pour sélectionner la zone à découper
              </p>
            )}
          </div>
        )}

        {/* Resize */}
        <button onClick={() => toggleSection('resize')} style={sectionButtonStyle}>
          {activeSection === 'resize' ? '▼' : '▶'} Redimensionner
        </button>
        {activeSection === 'resize' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Largeur</label>
              <input
                type="number"
                value={resizeWidth}
                onChange={handleResizeWidthChange}
                style={{
                  width: '100%',
                  padding: '0.3rem',
                  marginTop: '0.2rem',
                  borderRadius: '3px',
                  border: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Hauteur</label>
              <input
                type="number"
                value={resizeHeight}
                onChange={handleResizeHeightChange}
                style={{
                  width: '100%',
                  padding: '0.3rem',
                  marginTop: '0.2rem',
                  borderRadius: '3px',
                  border: 'none',
                }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Conserver les proportions
            </label>
            <button onClick={applyResize} style={{...buttonStyle, backgroundColor: '#27ae60'}}>
              Appliquer
            </button>
          </div>
        )}

        {/* Drawing Tools */}
        <button onClick={() => toggleSection('drawing')} style={sectionButtonStyle}>
          {activeSection === 'drawing' ? '▼' : '▶'} Dessin
        </button>
        {activeSection === 'drawing' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <button 
              onClick={() => onSetDrawingMode(drawingMode === 'brush' ? 'none' : 'brush')}
              style={drawingMode === 'brush' ? activeButtonStyle : buttonStyle}
            >
              🖌️ Pinceau
            </button>
            <button 
              onClick={() => onSetDrawingMode(drawingMode === 'eraser' ? 'none' : 'eraser')}
              style={drawingMode === 'eraser' ? activeButtonStyle : buttonStyle}
            >
              🧹 Gomme
            </button>
            
            {drawingMode !== 'none' && (
              <>
                {drawingMode === 'brush' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem' }}>Couleur</label>
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => onBrushColorChange(e.target.value)}
                      style={{ width: '100%', height: '30px', marginTop: '0.2rem', cursor: 'pointer' }}
                    />
                  </div>
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem' }}>Taille: {brushSize}px</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                    style={{ width: '100%', marginTop: '0.3rem' }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Export */}
        <button onClick={() => toggleSection('export')} style={sectionButtonStyle}>
          {activeSection === 'export' ? '▼' : '▶'} Exporter
        </button>
        {activeSection === 'export' && (
          <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem' }}>Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.3rem',
                  marginTop: '0.2rem',
                  borderRadius: '3px',
                  border: 'none',
                }}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <button onClick={handleExport} style={{...buttonStyle, backgroundColor: '#e74c3c'}}>
              💾 Télécharger
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
