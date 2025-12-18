function Sidebar() {
  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: '#34495e',
        color: 'white',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: '1rem',
            fontSize: '1.2rem',
            borderBottom: '2px solid #2c3e50',
            paddingBottom: '0.5rem',
          }}
        >
          Outils
        </h3>
        <p
          style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            fontStyle: 'italic',
          }}
        >
          Les outils seront ajoutés prochainement
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
