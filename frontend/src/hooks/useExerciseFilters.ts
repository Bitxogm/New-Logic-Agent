import { useState, useCallback } from 'react';
import { ExerciseFilters, ExerciseCategory, Difficulty } from '@/types';

export function useExerciseFilters() {
  const [filters, setFilters] = useState<ExerciseFilters>({
    search: '',
    language: undefined,
    difficulty: undefined,
    category: undefined,
    page: 1,
    limit: 12,
  });

  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const updateLanguage = useCallback((language: string | undefined) => {
    setFilters(prev => ({ ...prev, language, page: 1 }));
  }, []);

  const updateDifficulty = useCallback((difficulty: Difficulty | undefined) => {
    setFilters(prev => ({ ...prev, difficulty, page: 1 }));
  }, []);

  const updateCategory = useCallback((category: ExerciseCategory | undefined) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  }, []);

  const updatePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      language: undefined,
      difficulty: undefined,
      category: undefined,
      page: 1,
      limit: 12,
    });
  }, []);

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.language !== undefined || 
    filters.difficulty !== undefined ||
    filters.category !== undefined;

  return {
    filters,
    updateSearch,
    updateLanguage,
    updateDifficulty,
    updateCategory,
    updatePage,
    resetFilters,
    hasActiveFilters,
  };
}