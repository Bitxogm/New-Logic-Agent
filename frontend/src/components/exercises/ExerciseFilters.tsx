import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Difficulty, ExerciseFilters as FilterType } from '@/types';

interface ExerciseFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

/**
 * Filtros para ejercicios
 * Lenguaje, dificultad y búsqueda
 */
export default function ExerciseFilters({ filters, onFilterChange }: ExerciseFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleLanguageChange = (value: string) => {
    onFilterChange({
      ...filters,
      language: value === 'all' ? undefined : value,
      page: 1, // Reset page
    });
  };

  const handleDifficultyChange = (value: string) => {
    onFilterChange({
      ...filters,
      difficulty: value === 'all' ? undefined : (value as Difficulty),
      page: 1,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      search: searchInput || undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      page: 1,
      limit: 12,
    });
  };

  const hasActiveFilters = filters.language || filters.difficulty || filters.search;

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-950 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              type="text"
              placeholder="Buscar por título..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lenguaje */}
        <div className="space-y-2">
          <Label htmlFor="language">Lenguaje</Label>
          <Select
            value={filters.language || 'all'}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Todos los lenguajes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los lenguajes</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dificultad */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">Dificultad</Label>
          <Select
            value={filters.difficulty || 'all'}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Todas las dificultades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las dificultades</SelectItem>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  );
}