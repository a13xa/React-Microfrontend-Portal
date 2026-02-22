import React from 'react';
import { createRoot } from 'react-dom/client';
import NotificationsModule from './NotificationsModule';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <NotificationsModule />
    </React.StrictMode>
  );
}
