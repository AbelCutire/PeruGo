import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGlobals } from "./helpers/globalFunctions";

// Inicializar las funciones globales
initGlobals();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
