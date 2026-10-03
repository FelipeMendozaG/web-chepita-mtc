import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Simulacro MTC Perú | Examen de Reglas de Tránsito - Chepita',
  description:
    'Practica con el simulacro oficial de reglas de tránsito del MTC Perú. 40 preguntas cronometradas, banco de preguntas actualizado, foro comunitario y consejos de conducción.',
  keywords: [
    'Simulacro MTC',
    'Examen de reglas MTC',
    'Licencia de conducir Perú',
    'Brevete A-I',
    'Reglamento de tránsito',
    'Chepita MTC',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
