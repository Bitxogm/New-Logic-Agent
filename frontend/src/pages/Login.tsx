// ============================================
// src/pages/Login.tsx
// ============================================
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta de AgentLogic</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Formulario de login en construcción...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}