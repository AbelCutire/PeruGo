import SectionExplorar from '@/components/SectionExplorar';

export const metadata = {
  title: "Explorar Destinos | PeruGo",
};

export default function ExplorarPage() {
  return (
    <main>
      {/* El Header viene del layout global */}
      <SectionExplorar />
    </main>
  );
}
