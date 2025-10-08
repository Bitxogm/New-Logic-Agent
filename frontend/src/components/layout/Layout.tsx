import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación
 * Incluye Header, contenido y Footer
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header fijo en la parte superior */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Espacio para chatbot flotante (Fase 5) */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Aquí irá el chatbot después */}
        {/* <AIChatbot /> */}
      </div>
    </div>
  );
}