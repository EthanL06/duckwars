import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TailwindIndicator } from "./components/tailwind-indicator.tsx";
import { GameProvider } from "./context/GameContext.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameProvider>
        <App />
        <TailwindIndicator />
      </GameProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
