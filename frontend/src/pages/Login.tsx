// ============================================
// src/pages/Login.tsx
// ============================================
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <LoginForm />
    </div>
  );
}