import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useUser, useIsAuthenticated } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Code2, User, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Header de la aplicación
 * Incluye navegación y menú de usuario
 */
export default function Header() {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo y nombre */}
        <Link to="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">AgentLogic</span>
        </Link>

        {/* Navegación central */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/exercises"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
          >
            Ejercicios
          </Link>
          
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                to="/exercises/create"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
              >
                Crear Ejercicio
              </Link>
            </>
          )}
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/exercises/create')}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Ejercicio
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}