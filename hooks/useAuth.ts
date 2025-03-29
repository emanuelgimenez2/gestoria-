import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Guardar/actualizar usuario en Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            photoURL: firebaseUser.photoURL || null,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isAdmin: false // Por defecto no es admin
          });
        } else {
          // Actualizar última conexión
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }

        // Obtener datos actualizados
        const updatedDoc = await getDoc(userRef);
        setUser({
          ...firebaseUser,
          ...updatedDoc.data()
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}