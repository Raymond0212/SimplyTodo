import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { VscodeSplitLayout } from "@vscode-elements/react-elements";

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
