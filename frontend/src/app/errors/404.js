import React from 'react';

export default function Error404() {
  return (
    <div style={{ background: 'var(--midnight-blue, rgb(0,70,144))', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
    </div>
  );
}
