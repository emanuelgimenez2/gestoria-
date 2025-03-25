"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para el carrusel
const slides = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1600",
    title: "Vende o compra tu próximo vehículo",
    subtitle: "La mejor selección de autos y embarcaciones",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=600&width=1600",
    title: "Embarcaciones de lujo",
    subtitle: "Descubre nuestra colección exclusiva",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=600&width=1600",
    title: "Vehículos premium",
    subtitle: "Calidad y confort garantizados",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Auto-avance del carrusel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">{slide.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalogo">
                  <Button size="lg" className="min-w-[150px]">
                    Ver catálogo
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[150px] bg-transparent text-white border-white hover:bg-white/20"
                  >
                    Contacto
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

