import { Link } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            fontWeight: 700,
          }}
        >
          Bienvenue sur EpiGimp
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            marginBottom: '2rem',
            opacity: 0.95,
          }}
        >
              Editeur simple d'image
        </p>
        <Link
          to="/editor"
          style={{
            display: 'inline-block',
            backgroundColor: 'white',
            color: '#667eea',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '50px',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          Commencer l'édition
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '4rem',
          }}
        >
          <div
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: hoveredCard === 1 ? 'translateY(-10px)' : 'translateY(0)',
              boxShadow: hoveredCard === 1 ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              📁
            </span>
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '0.5rem',
              }}
            >
              Import facile
            </h3>
            <p
              style={{
                opacity: 0.9,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Importez vos images PNG et JPG en quelques clics
            </p>
          </div>
          <div
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: hoveredCard === 2 ? 'translateY(-10px)' : 'translateY(0)',
              boxShadow: hoveredCard === 2 ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              🔍
            </span>
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '0.5rem',
              }}
            >
              Zoom précis
            </h3>
            <p
              style={{
                opacity: 0.9,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Ajustez le zoom pour travailler dans les moindres détails
            </p>
          </div>
          <div
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: hoveredCard === 3 ? 'translateY(-10px)' : 'translateY(0)',
              boxShadow: hoveredCard === 3 ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              ✨
            </span>
            <h3
              style={{
                fontSize: '1.3rem',
                marginBottom: '0.5rem',
              }}
            >
              Interface simple
            </h3>
            <p
              style={{
                opacity: 0.9,
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              Une interface intuitive pour une prise en main rapide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
