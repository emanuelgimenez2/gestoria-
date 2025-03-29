"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductTable from "@/components/product-table"
import ProductForm from "@/components/product-form"
import CarouselManager from "@/components/carousel-manager"
import { User, LogIn, Plus, LogOut } from "lucide-react"
import Image from "next/image"
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth"
import { initializeApp } from "firebase/app"

// Configuración de Firebase (deberás reemplazar esto con tu propia configuración)
const firebaseConfig = {
  // Reemplaza estos valores con los de tu proyecto Firebase
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Inicializa Firebase
let app
let auth
let provider

// Solo inicializa Firebase en el lado del cliente
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    provider = new GoogleAuthProvider()
  } catch (error) {
    console.error("Error initializing Firebase:", error)
  }
}

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
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar estado de autenticación al cargar la página
  useEffect(() => {
    if (typeof window !== "undefined" && auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setIsLoggedIn(false)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [])

  // Manejar inicio de sesión con Google
  const handleLogin = async () => {
    try {
      if (auth && provider) {
        setLoading(true)
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        setUser(user)
        setIsLoggedIn(true)
        console.log("Usuario logueado:", user)
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
    } finally {
      setLoading(false)
    }
  }

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
        setUser(null)
        setIsLoggedIn(false)
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setShowForm(true)
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
    setShowForm(false)
  }

  const handleNewProduct = () => {
    setSelectedProduct(null) // Reset any selected product
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setSelectedProduct(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center p-8 max-w-md mx-auto border rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-[#0F1A3D] mb-6">Panel de Administración</h1>
          <p className="text-gray-600 mb-8">Inicia sesión para acceder al panel de administración</p>
          <Button onClick={handleLogin} className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Acceder con Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
    <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-[#0F1A3D]">Panel de Administración</h1>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <span>Admin: {user?.displayName || "Usuario"}</span>
      </div>
     
    </div>
  </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 gap-8">
            {!showForm ? (
              <>
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={handleNewProduct} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Nuevo Producto
                  </Button>
                </div>
                <ProductTable
                  products={productList}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onToggleSold={handleToggleSold}
                />
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <ProductForm
                  product={selectedProduct}
                  onSave={handleSaveProduct}
                  onCancel={handleCancelForm}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}