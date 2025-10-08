// ============================================
// src/pages/CreateExercise.tsx
// ============================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateExercise() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Ejercicio</h1>
        <p className="text-gray-600 mt-2">
          Añade un nuevo ejercicio a la plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de Ejercicio</CardTitle>
          <CardDescription>Completa los campos para crear el ejercicio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Formulario en construcción...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}