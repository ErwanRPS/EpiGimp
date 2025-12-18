function Header() {
  return (
    <header
      style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: '1.8rem',
          fontWeight: 600,
        }}
      >
        EpiGimp
      </h1>
      <p
        style={{
          margin: '0.3rem 0 0 0',
          fontSize: '0.9rem',
          opacity: 0.8,
        }}
      >
        Éditeur d'images simplifié
      </p>
    </header>
  );
}

export default Header;
