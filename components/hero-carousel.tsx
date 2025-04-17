"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Asegúrate de que estos nombres coincidan exactamente con tus archivos en la carpeta public
const slides = [
  {
    id: 1,
    image: "/fondo1.JPG", // Reemplaza con el nombre real de tu primera imagen
    title: "Publique Aqui su Embarcacion",
    subtitle: "La mejor selección de embarcaciones",
  },
  {
    id: 2,
    image: "/lancha2.jpg", // Reemplaza con el nombre real de tu segunda imagen
    title: "Embarcaciones Deportivas",
    subtitle: "Descubre nuestra colección",
  },
  {
    id: 3,
    image: "/lancha3.webp", // Reemplaza con el nombre real de tu tercera imagen
    title: "Vehículos y Motos",
    subtitle: "Calidad y confort garantizados",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Resetea el timer cuando cambia el slide manualmente
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(nextSlide, 5000)
  }

  // Configuración del intervalo para cambio automático
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 5000)
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Manejo de carga de imágenes
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative overflow-hidden h-[600px] w-full">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 z-10 transform-none" 
                : "opacity-0 z-0 translate-x-full"
            }`}
          >
            {/* Imagen de fondo */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={index === 0 || index === currentSlide}
                style={{ 
                  objectFit: "cover",
                  objectPosition: "center"
                }}
                onLoad={handleImageLoad}
                className="brightness-75"
              />
            </div>
            
            {/* Overlay con texto */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-black/30 to-black/60">
              <div className="max-w-4xl text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl mb-8 drop-shadow">
                  {slide.subtitle}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/catalogo">
                    <Button 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 text-lg"
                    >
                      Ver catálogo
                    </Button>
                  </Link>
                  <Link href="/contacto">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 text-lg"
                    >
                      Contacto
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles - Botones de navegación */}
      <button
        onClick={() => {
          prevSlide()
          resetTimer()
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white z-20 transition-all duration-300 shadow-lg"
        aria-label="Anterior slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => {
          nextSlide()
          resetTimer()
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white z-20 transition-all duration-300 shadow-lg"
        aria-label="Siguiente slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              resetTimer()
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-8" 
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}