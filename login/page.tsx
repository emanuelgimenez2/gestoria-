'use client'

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await signInWithPopup(auth, googleProvider);
      
      // Guardar usuario en Firestore si no existe
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          isAdmin: false // Por defecto no es admin
        });
      }
      
      router.push("/");
    } catch (err) {
      setError("Error al iniciar sesión con Google");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>
        
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}
        
        <Button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Cargando..." : "Continuar con Google"}
        </Button>
        
        <p className="mt-4 text-sm text-gray-600 text-center">
          Solo usuarios autorizados pueden acceder al sistema.
        </p>
      </div>
    </div>
  );
}