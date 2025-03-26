"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'shadow-sm py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo con imagen y título - ahora más grande */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative h-16 w-16">
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

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2"
            >
              Inicio
            </Link>
            
            <Link 
              href="/servicios" 
              className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2"
            >
              Servicios
            </Link>
            
            <Link 
              href="/catalogo" 
              className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2"
            >
              Catálogo
            </Link>
            
            <Link 
              href="/contacto" 
              className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors font-medium px-3 py-2"
            >
              Contacto
            </Link>
            
            <Link href="/admin">
              <Button variant="outline" className="ml-2">
                Admin
              </Button>
            </Link>
          </nav>

          {/* Botón Menú Mobile */}
          <button 
            className="md:hidden p-2 rounded-md text-[#0F1A3D] hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg animate-fadeIn">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <Link
                href="/"
                className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              
              <Link
                href="/servicios"
                className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              
              <Link
                href="/catalogo"
                className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              
              <Link
                href="/contacto"
                className="block py-3 px-2 text-[#6B7280] hover:text-[#0F1A3D] hover:bg-gray-50 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              
              <Link 
                href="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                <Button variant="outline" className="w-full mt-2">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}