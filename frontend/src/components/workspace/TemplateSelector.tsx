import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { FileCode, Code2, Box, Repeat, List, FileText } from 'lucide-react';
import { getTemplatesByLanguage, CodeTemplate } from '@/data/codeTemplates';
import { toast } from 'sonner';

interface TemplateSelectorProps {
  language: string;
  onSelectTemplate: (code: string) => void;
}

const categoryIcons = {
  function: Code2,
  class: Box,
  loop: Repeat,
  array: List,
  string: FileText,
  other: FileCode,
};

export function TemplateSelector({ language, onSelectTemplate }: TemplateSelectorProps) {
  const templates = getTemplatesByLanguage(language);

  if (templates.length === 0) {
    return null;
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, CodeTemplate[]>);

  const handleSelectTemplate = (template: CodeTemplate) => {
    onSelectTemplate(template.code);
    toast.success(`Template "${template.name}" inserted`, {
      description: template.description,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileCode className="mr-2 h-4 w-4" />
          Insert Template
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Code Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <DropdownMenuSub key={category}>
              <DropdownMenuSubTrigger>
                <Icon className="mr-2 h-4 w-4" />
                <span className="capitalize">{category}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                {categoryTemplates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}