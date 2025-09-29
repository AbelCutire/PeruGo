// src/helpers/globalFunctions.js

// Simulaciones básicas de las funciones del script original
export function initGlobals() {
  window.suggest = (text) => {
    console.log("suggest()", text);
    alert("Simulación: " + text);
  };

  window.pref = (opt) => {
    console.log("pref()", opt);
    alert("Simulación pref: " + opt);
  };

  window.savePlan = () => {
    console.log("savePlan()");
    alert("Plan guardado (simulado)");
  };

  window.share = () => {
    console.log("share()");
    alert("Compartir plan (simulado)");
  };

  window.exportPDF = () => {
    console.log("exportPDF()");
    alert("Exportar PDF (simulado)");
  };

  window.reserve = () => {
    console.log("reserve()");
    alert("Reserva simulada");
  };

  window.saveProfile = () => {
    console.log("saveProfile()");
    alert("Perfil guardado (simulado)");
  };

  window.resetProfile = () => {
    console.log("resetProfile()");
    alert("Preferencias restablecidas (simulado)");
  };
}
