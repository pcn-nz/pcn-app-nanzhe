import React from "react";
import ReactDOM from "react-dom/client";
import PlayerPage from "./player";
import { BrowserRouter } from "react-router-dom";

document.addEventListener('contextmenu', e => e.preventDefault())

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerPage />
    </BrowserRouter>
  </React.StrictMode>,
);
