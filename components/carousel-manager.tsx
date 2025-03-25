"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, Plus, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import lancha1 from ".././styles/lancha1.jpg"
import lancha2 from ".././styles/lancha2.jpg"
import lancha3 from ".././styles/lancha3.jpg"
// Datos de ejemplo para el carrusel
const initialSlides = [
  {
    id: 1,
    image: lancha1,
    title: "Vende o compra tu próximo vehículo",
    subtitle: "La mejor selección de autos y embarcaciones",
  },
  {
    id: 2,
    image: lancha2,
    title: "Embarcaciones de lujo",
    subtitle: "Descubre nuestra colección exclusiva",
  },
  {
    id: 3,
    image: lancha1,
    title: "Vehículos premium",
    subtitle: "Calidad y confort garantizados",
  },
]

export default function CarouselManager() {
  const [slides, setSlides] = useState(initialSlides)
  const [editingSlide, setEditingSlide] = useState(null)

  const handleAddSlide = () => {
    const newSlide = {
      id: Math.max(...slides.map((s) => s.id)) + 1,
      image: "/placeholder.svg?height=600&width=1600",
      title: "Nuevo slide",
      subtitle: "Descripción del nuevo slide",
    }
    setSlides([...slides, newSlide])
    setEditingSlide(newSlide)
  }

  const handleEditSlide = (slide) => {
    setEditingSlide({ ...slide })
  }

  const handleDeleteSlide = (id) => {
    setSlides(slides.filter((slide) => slide.id !== id))
    if (editingSlide && editingSlide.id === id) {
      setEditingSlide(null)
    }
  }

  const handleSaveSlide = () => {
    if (editingSlide) {
      setSlides(slides.map((slide) => (slide.id === editingSlide.id ? editingSlide : slide)))
      setEditingSlide(null)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditingSlide((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    // En un caso real, aquí se procesaría el archivo
    // Para este ejemplo, simplemente mantenemos el placeholder
    if (e.target.files && e.target.files.length > 0) {
      setEditingSlide((prev) => ({ ...prev, image: "/placeholder.svg?height=600&width=1600" }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#0F1A3D]">Gestión del Carrusel</h2>
        <Button onClick={handleAddSlide} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-[#0F1A3D]">Slides Actuales</h3>

          <div className="space-y-4">
            {slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-12 rounded overflow-hidden">
                  <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#0F1A3D] truncate">{slide.title}</h4>
                  <p className="text-sm text-[#6B7280] truncate">{slide.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditSlide(slide)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSlide(slide.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingSlide && (
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-[#0F1A3D]">Editar Slide</h3>

            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" value={editingSlide.title} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Textarea id="subtitle" name="subtitle" value={editingSlide.subtitle} onChange={handleChange} rows={2} />
            </div>

            <div>
              <Label htmlFor="image">Imagen</Label>
              <div className="mt-2 space-y-4">
                <div className="relative h-40 rounded overflow-hidden">
                  <Image
                    src={editingSlide.image || "/placeholder.svg"}
                    alt={editingSlide.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image").click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar imagen
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingSlide(null)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveSlide}>
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

