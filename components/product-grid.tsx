"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ProductGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      {/* Cambio grid-cols-1 a grid-cols-2 para móviles */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onViewDetails={() => setSelectedProduct(product)} />
        ))}
      </div>

      {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}

function ProductCard({ product, onViewDetails }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
      {/* Reducimos altura en móvil */}
      <div className="relative h-40 sm:h-64 overflow-hidden">
        <Image
          src={product.images[currentImage] || "/placeholder.svg"}
          alt={product.model}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {product.sold && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium z-10">
            Vendido
          </div>
        )}

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
          {product.images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="text-base sm:text-xl font-semibold text-[#0F1A3D] truncate">{product.model}</h3>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-3">
          <div>
            <p className="text-xs sm:text-sm text-[#6B7280]">Año: {product.year}</p>
            <p className="text-[#0F1A3D] font-bold text-sm sm:text-lg mt-1">${product.price.toLocaleString()}</p>
          </div>
          <Button size="sm" onClick={onViewDetails} className="mt-2 sm:mt-0 text-xs sm:text-sm px-2 sm:px-4 py-1 w-full sm:w-auto">
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductDetailsModal({ product, onClose }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  // Función para abrir WhatsApp con un mensaje predefinido
  const openWhatsApp = () => {
    // Cambia este número por el número de WhatsApp real de tu gestoría
    const phoneNumber = "+5493442472412"; 
    // Crea un mensaje con información del producto
    const message = `Hola, estoy interesado en el ${product.model} (${product.year}) que vi en su sitio web. Precio: $${product.price.toLocaleString()}. ¿Podría darme más información?`;
    
    // Codifica el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crea la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abre la URL en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{product.model}</DialogTitle>
          <DialogDescription>
            Año: {product.year} | Categoría: {product.category === "automotor" ? "Automotor" : "Náutica"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative h-60 sm:h-80 md:h-96">
            <Image
              src={product.images[currentImage] || "/placeholder.svg"}
              alt={product.model}
              fill
              className="object-cover rounded-md"
            />

            <button
              onClick={prevImage}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 sm:p-3 rounded-full hover:bg-black/60 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 sm:p-3 rounded-full hover:bg-black/60 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="p-2">
            <h3 className="text-lg sm:text-xl font-semibold text-[#0F1A3D] mb-2 sm:mb-3">Descripción</h3>
            <p className="text-sm sm:text-base text-[#6B7280] mb-4 sm:mb-6">{product.description}</p>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-[#6B7280]">Modelo:</span>
                <span className="text-sm sm:text-base font-medium">{product.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-[#6B7280]">Año:</span>
                <span className="text-sm sm:text-base font-medium">{product.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-[#6B7280]">Categoría:</span>
                <span className="text-sm sm:text-base font-medium">{product.category === "automotor" ? "Automotor" : "Náutica"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm sm:text-base text-[#6B7280]">Estado:</span>
                <span className={`text-sm sm:text-base font-medium ${product.sold ? "text-red-500" : "text-green-500"}`}>
                  {product.sold ? "Vendido" : "Disponible"}
                </span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8">
              <p className="text-xl sm:text-3xl font-bold text-[#0F1A3D]">${product.price.toLocaleString()}</p>

              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <Button 
                  className="flex-1 py-2 sm:py-6 text-sm bg-green-600 hover:bg-green-700" 
                  disabled={product.sold}
                  onClick={product.sold ? undefined : openWhatsApp}
                >
                  {product.sold ? "No disponible" : "Consultar por WhatsApp"}
                </Button>
                <Button variant="outline" onClick={onClose} className="py-2 sm:py-6 text-sm block">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}