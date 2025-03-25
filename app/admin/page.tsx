"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductTable from "@/components/product-table"
import ProductForm from "@/components/product-form"
import CarouselManager from "@/components/carousel-manager"
import { User, LogIn } from "lucide-react"

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

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [productList, setProductList] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleLogin = () => {
    // Simulación de login con Google
    setIsLoggedIn(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
  }

  const handleDeleteProduct = (id) => {
    setProductList(productList.filter((product) => product.id !== id))
  }

  const handleToggleSold = (id) => {
    setProductList(productList.map((product) => (product.id === id ? { ...product, sold: !product.sold } : product)))
  }

  const handleSaveProduct = (product) => {
    if (product.id) {
      // Actualizar producto existente
      setProductList(productList.map((p) => (p.id === product.id ? product : p)))
    } else {
      // Agregar nuevo producto
      const newProduct = {
        ...product,
        id: Math.max(...productList.map((p) => p.id)) + 1,
      }
      setProductList([...productList, newProduct])
    }
    setSelectedProduct(null)
  }

  // if (!isLoggedIn) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[80vh]">
  //       <div className="text-center p-8 max-w-md mx-auto border rounded-lg shadow-lg">
  //         <h1 className="text-2xl font-bold text-[#0F1A3D] mb-6">Panel de Administración</h1>
  //         <p className="text-gray-600 mb-8">Inicia sesión para acceder al panel de administración</p>
  //         <Button onClick={handleLogin} className="flex items-center gap-2">
  //           <LogIn className="h-5 w-5" />
  //           Acceder con Google
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0F1A3D]">Panel de Administración</h1>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>Admin</span>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="carousel">Carrusel</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProductTable
                products={productList}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleSold={handleToggleSold}
              />
            </div>
            <div>
              <ProductForm
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={() => setSelectedProduct(null)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="carousel">
          <CarouselManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

