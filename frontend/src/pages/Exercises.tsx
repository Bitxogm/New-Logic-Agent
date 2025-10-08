import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useIsAuthenticated } from '@/store/authStore';
import { ExerciseFilters as FilterType } from '@/types';
import ExerciseList from '@/components/exercises/ExerciseList';
import ExerciseFilters from '@/components/exercises/ExerciseFilters';

/**
 * Página de ejercicios
 * Lista todos los ejercicios con filtros
 */
export default function Exercises() {
  const isAuthenticated = useIsAuthenticated();
  
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 12,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ejercicios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
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

      {/* Filtros y Lista */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar de filtros */}
        <div className="lg:col-span-1">
          <ExerciseFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Lista de ejercicios */}
        <div className="lg:col-span-3">
          <ExerciseList filters={filters} />
        </div>
      </div>
    </div>
  );
}