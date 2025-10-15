import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, TrendingUp, X } from 'lucide-react';

type QuickFilterType = 'unsolved' | 'recent' | 'popular';

interface QuickFilter {
  id: QuickFilterType;
  label: string;
  icon: React.ReactNode;
}

const quickFilters: QuickFilter[] = [
  { id: 'unsolved', label: 'Unsolved', icon: <Star className="h-3 w-3" /> },
  { id: 'recent', label: 'Recently Added', icon: <Clock className="h-3 w-3" /> },
  { id: 'popular', label: 'Popular', icon: <TrendingUp className="h-3 w-3" /> },
];

interface QuickFiltersProps {
  activeFilters: QuickFilterType[];
  onChange: (filters: QuickFilterType[]) => void;
}

export function QuickFilters({ activeFilters, onChange }: QuickFiltersProps) {
  const toggleFilter = (filterId: QuickFilterType) => {
    if (activeFilters.includes(filterId)) {
      onChange(activeFilters.filter(f => f !== filterId));
    } else {
      onChange([...activeFilters, filterId]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Quick Filters:</span>
      {quickFilters.map((filter) => (
        <Badge
          key={filter.id}
          variant={activeFilters.includes(filter.id) ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary/90"
          onClick={() => toggleFilter(filter.id)}
        >
          {filter.icon}
          <span className="ml-1">{filter.label}</span>
        </Badge>
      ))}
      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-6 px-2"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}