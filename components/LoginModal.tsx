'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Icons } from '@/components/icons';

export function LoginModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Inicio de sesión normal
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Creación de cuenta
        await createUserWithEmailAndPassword(auth, email, password);
        // Aquí puedes agregar el nombre a la base de datos si lo necesitas
      }
      onOpenChange(false);
    } catch (err: any) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      onOpenChange(false);
    } catch (err: any) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const getFirebaseError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Credenciales incorrectas';
      case 'auth/email-already-in-use':
        return 'El email ya está en uso';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intente más tarde';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de autenticación';
      default:
        return 'Error al autenticar. Intente nuevamente';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin ? 'Ingresa tus credenciales' : 'Completa el formulario para registrarte'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Continuar con Google
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">O</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isLogin ? "••••••••" : "Mínimo 6 caracteres"}
                minLength={isLogin ? undefined : 6}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive text-center">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Button
            variant="link"
            className="px-2 text-sm"
            onClick={toggleAuthMode}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}