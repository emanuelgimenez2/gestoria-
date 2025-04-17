"use client"
import { useState, useEffect, useRef } from "react"
import { Search, Plus, Upload, X } from "lucide-react"
import ProductGrid from "@/components/product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { db, app } from "../../lib/firebase"

const storage = getStorage(app)

export default function Catalogo() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newProduct, setNewProduct] = useState({
    model: "",
    year: "",
    price: "",
    category: "automotor",
    description: "",
    sold: false,
  })
  const [images, setImages] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
    } catch (error) {
      console.error("Error al obtener productos:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "all" || product.category === category
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({
      ...prev,
      [name]: name === "year" || name === "price" ? Number(value) : value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (images.length === 0) {
      alert("Debes subir al menos una imagen")
      return
    }

    setIsUploading(true)

    try {
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
          await uploadBytes(storageRef, file)
          return await getDownloadURL(storageRef)
        })
      )

      const productData = {
        ...newProduct,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sold: false
      }

      await addDoc(collection(db, "products"), productData)

      setNewProduct({
        model: "",
        year: "",
        price: "",
        category: "automotor",
        description: "",
        sold: false,
      })
      setImages([])

      await fetchProducts()

      alert("Producto guardado exitosamente!")
    } catch (error) {
      console.error("Error al guardar el producto:", error.message)
      alert("Hubo un error al guardar el producto")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-[#0F1A3D] mb-8">Nuestro Catálogo</h1>


      {/* Filtros y búsqueda */}
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

      {/* Lista de productos */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando productos...</p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  )
}