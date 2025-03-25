"use client"

import { useState, useEffect } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    category: "automotor",
    images: [],
    description: "",
    sold: false,
  })

  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        id: null,
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        category: "automotor",
        images: [],
        description: "",
        sold: false,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    // En un caso real, aquí se procesarían los archivos
    // Para este ejemplo, simplemente agregamos placeholders
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = [...formData.images]
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (newImages.length < 5) {
          // Limitamos a 5 imágenes
          newImages.push("/placeholder.svg?height=300&width=500")
        }
      }
      setFormData((prev) => ({ ...prev, images: newImages }))
    }
  }

  const handleFileInput = (e) => {
    // En un caso real, aquí se procesarían los archivos
    // Para este ejemplo, simplemente agregamos placeholders
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...formData.images]
      for (let i = 0; i < e.target.files.length; i++) {
        if (newImages.length < 5) {
          // Limitamos a 5 imágenes
          newImages.push("/placeholder.svg?height=300&width=500")
        }
      }
      setFormData((prev) => ({ ...prev, images: newImages }))
    }
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border rounded-lg p-6">
      <h2 className="text-xl font-bold text-[#0F1A3D] mb-4">{product ? "Editar Producto" : "Nuevo Producto"}</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1000"
              value={formData.price}
              onChange={handleNumberChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automotor">Automotor</SelectItem>
              <SelectItem value="nautica">Náutica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div>
          <Label>Estado</Label>
          <div className="flex items-center gap-2 mt-2">
            <Switch checked={formData.sold} onCheckedChange={(checked) => handleSwitchChange("sold", checked)} />
            <span>{formData.sold ? "Vendido" : "Disponible"}</span>
          </div>
        </div>

        <div>
          <Label>Imágenes</Label>
          <div
            className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Arrastra y suelta imágenes aquí, o</p>
            <Input id="images" type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />
            <Button type="button" variant="outline" onClick={() => document.getElementById("images").click()}>
              Seleccionar archivos
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Imagen ${index + 1}`}
                    className="h-20 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Actualizar" : "Guardar"}</Button>
      </div>
    </form>
  )
}

