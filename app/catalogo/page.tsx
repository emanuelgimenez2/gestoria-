"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import ProductGrid from "@/components/product-grid"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo
const products = [
  {
    id: 1,
    model: "Yacht 320",
    year: 2022,
    price: 320000,
    category: "nautica",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    description: "Lujoso yate con 3 camarotes, cocina completa y sala de estar.",
    sold: false,
  },
  {
    id: 2,
    model: "SUV Premium",
    year: 2023,
    price: 45000,
    category: "automotor",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    description: "SUV de lujo con interior en cuero, techo panorámico y sistema de navegación avanzado.",
    sold: true,
  },
  {
    id: 3,
    model: "Lancha Deportiva",
    year: 2021,
    price: 85000,
    category: "nautica",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    description: "Lancha deportiva con motor de alta potencia, ideal para deportes acuáticos.",
    sold: false,
  },
  {
    id: 4,
    model: "Sedan Ejecutivo",
    year: 2022,
    price: 38000,
    category: "automotor",
    images: [
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
      "/placeholder.svg?height=300&width=500",
    ],
    description: "Sedan ejecutivo con acabados de lujo y tecnología de punta.",
    sold: false,
  },
]

export default function Catalogo() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || product.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-[#0F1A3D] mb-8">Nuestro Catálogo</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar por modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="automotor">Automotor</SelectItem>
            <SelectItem value="nautica">Náutica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  )
}

