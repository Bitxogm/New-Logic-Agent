// ============================================
// src/pages/Exercises.tsx
// ============================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useIsAuthenticated } from '@/store/authStore';

export default function Exercises() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ejercicios</h1>
          <p className="text-gray-600 mt-2">
            Explora y practica con ejercicios de programación
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link to="/exercises/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Ejercicio
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ejercicios</CardTitle>
          <CardDescription>Filtros y búsqueda próximamente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Lista de ejercicios en construcción...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
