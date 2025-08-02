import React from 'react';

export default function Error400() {
  return (
    <div style={{ background: 'var(--midnight-blue, rgb(0,70,144))', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>400 - Requête incorrecte</h1>
      <p>La requête envoyée au serveur est invalide.</p>
    </div>
  );
}
