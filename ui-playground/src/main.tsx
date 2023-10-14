import React from "react";
import ReactDOM from "react-dom/client";
import Frame from "react-frame-component";
import App from "./App";
import { ColorModeProvider } from "./components/color-mode/provider";
import './root.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Frame style={{ width: "100vw", height: "100vh", display: "flex", margin: 0 }}>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </Frame>
  </React.StrictMode>
);
