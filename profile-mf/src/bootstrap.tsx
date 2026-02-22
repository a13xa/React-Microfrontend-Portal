import React from 'react';
import { createRoot } from 'react-dom/client';
import ProfileModule from './ProfileModule';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ProfileModule />
    </React.StrictMode>
  );
}
