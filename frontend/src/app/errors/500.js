import React from 'react';

export default function Error500() {
  return (
    <div style={{ background: 'var(--midnight-blue, rgb(0,70,144))', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>500 - Erreur serveur</h1>
      <p>Une erreur interne est survenue sur le serveur.</p>
    </div>
  );
}
