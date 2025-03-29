'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LoginModal } from "./LoginModal";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleServicesClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const servicesSection = document.getElementById("servicios");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-30">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="relative h-20 w-20">
                <Image
                  src="/logo2.png"
                  alt="Logo Gestoría"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 64px, 64px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#0F1A3D] hidden sm:inline">
                  Gestoría Náutica y del Automotor
                </span>
                <span className="text-xl font-bold text-[#0F1A3D] sm:hidden">
                  Gestoría
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2">
                Inicio
              </Link>
              
              <a href="/#servicios" onClick={handleServicesClick} className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2 cursor-pointer">
                Servicios
              </a>
              
              <Link href="/catalogo" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2">
                Catálogo
              </Link>
              
              <Link href="/contacto" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2">
                Contacto
              </Link>
              
              {user?.isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="ml-2">
                    Admin
                  </Button>
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Foto de perfil"
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={() => setLoginOpen(true)} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Acceder</span>
                </Button>
              )}
            </nav>

            <button 
              className="md:hidden p-2 rounded-md text-[#0F1A3D] hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg animate-fadeIn">
              <div className="container mx-auto px-4 py-3 space-y-2">
                <Link href="/" className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Inicio
                </Link>
                
                <a href="/#servicios" onClick={handleServicesClick} className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors cursor-pointer">
                  Servicios
                </a>
                
                <Link href="/catalogo" className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Catálogo
                </Link>
                
                <Link href="/contacto" className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Contacto
                </Link>
                
                {user?.isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full mt-2">
                      Admin
                    </Button>
                  </Link>
                )}
                
                {user ? (
                  <>
                    <div className="flex items-center gap-2 p-2">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="Foto de perfil"
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        ) : (
                          <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{user.displayName || user.email}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }} 
                      className="w-full flex items-center gap-2 justify-start"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setLoginOpen(true);
                      setIsMenuOpen(false);
                    }} 
                    className="w-full flex items-center gap-2 justify-start"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Acceder</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}