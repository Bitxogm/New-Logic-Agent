import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

/**
 * Footer de la aplicación
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">AgentLogic</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plataforma educativa potenciada por IA para aprender programación
            </p>
          </div>

          {/* Enlaces de navegación */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/exercises"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Ejercicios
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/Bitxogm/New-Logic-Agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Documentación
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Bitxogm/New-Logic-Agent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} AgentLogic. Desarrollado con ❤️ usando React, TypeScript y Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}