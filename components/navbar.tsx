"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#0F1A3D]">
            Concesionario
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors">
              Inicio
            </Link>
            <Link href="/catalogo" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors">
              Catálogo
            </Link>
            <Link href="/contacto" className="text-[#6B7280] hover:text-[#0F1A3D] transition-colors">
              Contacto
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-[#0F1A3D]" /> : <Menu className="h-6 w-6 text-[#0F1A3D]" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-[#6B7280] hover:text-[#0F1A3D] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block text-[#6B7280] hover:text-[#0F1A3D] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="/contacto"
              className="block text-[#6B7280] hover:text-[#0F1A3D] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

