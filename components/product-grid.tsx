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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.images[currentImage] || "/placeholder.svg"}
          alt={product.model}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {product.sold && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
            Vendido
          </div>
        )}

        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {product.images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#0F1A3D]">{product.model}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-[#6B7280]">Año: {product.year}</p>
            <p className="text-[#0F1A3D] font-bold mt-1">${product.price.toLocaleString()}</p>
          </div>
          <Button size="sm" onClick={onViewDetails}>
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.model}</DialogTitle>
          <DialogDescription>
            Año: {product.year} | Categoría: {product.category === "automotor" ? "Automotor" : "Náutica"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-64 md:h-full">
            <Image
              src={product.images[currentImage] || "/placeholder.svg"}
              alt={product.model}
              fill
              className="object-cover rounded-md"
            />

            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#0F1A3D] mb-2">Descripción</h3>
            <p className="text-[#6B7280] mb-4">{product.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Modelo:</span>
                <span className="font-medium">{product.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Año:</span>
                <span className="font-medium">{product.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Categoría:</span>
                <span className="font-medium">{product.category === "automotor" ? "Automotor" : "Náutica"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Estado:</span>
                <span className={`font-medium ${product.sold ? "text-red-500" : "text-green-500"}`}>
                  {product.sold ? "Vendido" : "Disponible"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-2xl font-bold text-[#0F1A3D]">${product.price.toLocaleString()}</p>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1" disabled={product.sold}>
                  {product.sold ? "No disponible" : "Consultar"}
                </Button>
                <Button variant="outline" onClick={onClose}>
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

