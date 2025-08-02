export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
      <h1 style={{ fontSize: '4rem', color: '#e53e3e', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>Page non trouvée</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Oups, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <a href="/" style={{ color: '#3182ce', textDecoration: 'underline', fontSize: '1.2rem' }}>Retour à l'accueil</a>
    </div>
  );
}
