'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      }
    });
    
    return () => unsubscribe();
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}