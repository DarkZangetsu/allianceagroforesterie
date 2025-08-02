import React from 'react';

export default function Error401() {
  return (
    <div style={{ background: 'var(--midnight-blue, rgb(0,70,144))', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>401 - Non autorisé</h1>
      <p>Vous n'avez pas l'autorisation d'accéder à cette ressource.</p>
    </div>
  );
}
