import { useState } from 'react';

function Workspace() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(100);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Veuillez importer une image PNG ou JPG.');
      setImage(null);
      return;
    }

    // Charger l'image
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setError('');
      setZoom(100);
    };
    reader.onerror = () => {
      setError("Erreur lors du chargement de l'image.");
      setImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 10, 10));
  };

  const handleFitToScreen = () => {
    setZoom(100);
  };

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ecf0f1',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={triggerFileInput}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          📁 Importer une image
        </button>

        {image && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginLeft: 'auto',
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 10}
              style={{
                backgroundColor: zoom <= 10 ? '#95a5a6' : '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: zoom <= 10 ? 'not-allowed' : 'pointer',
                opacity: zoom <= 10 ? 0.5 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              ➖
            </button>
            <span
              style={{
                fontWeight: 600,
                minWidth: '50px',
                textAlign: 'center',
              }}
            >
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              style={{
                backgroundColor: zoom >= 200 ? '#95a5a6' : '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: zoom >= 200 ? 'not-allowed' : 'pointer',
                opacity: zoom >= 200 ? 0.5 : 1,
                transition: 'background-color 0.3s',
              }}
            >
              ➕
            </button>
            <button
              onClick={handleFitToScreen}
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '0.4rem 0.8rem',
                fontSize: '0.9rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              Ajuster
            </button>
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

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '2rem',
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '4px',
              fontSize: '1rem',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {!image && !error && (
          <div
            style={{
              textAlign: 'center',
              color: '#7f8c8d',
            }}
          >
            <p
              style={{
                margin: '0.5rem 0',
                fontSize: '1.2rem',
              }}
            >
              Aucune image importée
            </p>
            <p
              style={{
                margin: '0.5rem 0',
                fontSize: '0.9rem',
                opacity: 0.8,
              }}
            >
              Cliquez sur "Importer une image" pour commencer
            </p>
          </div>
        )}

        {image && !error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <img
              src={image}
              alt="Image importée"
              style={{
                maxWidth: `${zoom}%`,
                maxHeight: `${zoom}%`,
                objectFit: 'contain',
                display: 'block',
                transition: 'all 0.3s ease',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Workspace;
