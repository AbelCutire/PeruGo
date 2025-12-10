"use client";

import Hero from "@/components/Hero";
import SectionDestinosPopulares from "@/components/SectionDestinosPopulares";

export default function Page() {
  return (
    <main>
      {/* El Header y el Chat ya están en layout.js */}
      
      <Hero />
      
      {/* Solo mostramos destacados en el Home, para explorar todo ir a /explorar */}
      <SectionDestinosPopulares />
      
    </main>
  );
}
