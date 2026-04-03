import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import favicon from "./imagenes/images.jpg";

const setFavicon = (href) => {
  const existing =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]');

  const link = existing || document.createElement("link");
  link.rel = "icon";
  link.type = "image/jpeg";
  link.href = href;

  if (!existing) {
    document.head.appendChild(link);
  }
};

const rootElement = document.getElementById("root");

if (rootElement) {
  setFavicon(favicon);
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
