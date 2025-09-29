// src/App.jsx
import Header from "./components/Header";
import Hero from "./components/Hero";
import SectionExplorar from "./components/SectionExplorar";
import SectionPlanificador from "./components/SectionPlanificador";
import SectionDestino from "./components/SectionDestino";
import SectionReservas from "./components/SectionReservas";
import SectionPerfil from "./components/SectionPerfil";
import Chat from "./components/Chat";

function App() {
  return (
    <>
      <Header />
      <Hero />
      <SectionExplorar />
      <SectionPlanificador />
      <SectionDestino />
      <SectionReservas />
      <SectionPerfil />
      <Chat />
    </>
  );
}

export default App;
