"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

// Componente principal
export default function ProductTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    model: "",
    year: "",
    price: "",
    category: "",
    description: "",
    sold: false,
    images: []
  })

  // Categorías disponibles (puedes obtenerlas de tu base de datos también)
  const categories = [
    "Nautica",
    "Automotor",
    
  ]

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products")
        const productSnapshot = await getDocs(productsCollection)
        const productsList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products: ", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los productos",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Manejar edición
  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      model: product.model || "",
      year: product.year?.toString() || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      description: product.description || "",
      sold: product.sold || false,
      images: product.images || []
    })
  }

  // Actualizar producto
  const handleUpdate = async () => {
    if (!editingProduct) return

    try {
      const productRef = doc(db, "products", editingProduct.id)
      await updateDoc(productRef, {
        model: formData.model,
        year: parseInt(formData.year) || 0,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        description: formData.description,
        sold: formData.sold,
        images: formData.images
      })
      
      // Actualizar estado local
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { 
          ...p, 
          model: formData.model,
          year: parseInt(formData.year) || 0,
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          description: formData.description,
          sold: formData.sold,
          images: formData.images
        } : p
      ))
      
      setEditingProduct(null)
      
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })
    } catch (error) {
      console.error("Error updating product: ", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el producto",
      })
    }
  }

  // Eliminar producto
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId))
      setProducts(products.filter(product => product.id !== productId))
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting product: ", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto",
      })
    }
  }

  // Cambiar estado de vendido
  const handleToggleSold = async (productId) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return

      const productRef = doc(db, "products", productId)
      await updateDoc(productRef, {
        sold: !product.sold
      })

      setProducts(products.map(p => 
        p.id === productId ? { ...p, sold: !p.sold } : p
      ))
    } catch (error) {
      console.error("Error updating product status: ", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado del producto",
      })
    }
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Loading state
  if (loading) {
    return <div className="text-center py-4">Cargando productos...</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Tabla responsive - se convierte en cards en móviles */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay productos disponibles.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-16 h-12 rounded overflow-hidden">
                      <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                        alt={product.model || "Producto"}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.model}</TableCell>
                  <TableCell>{product.year}</TableCell>
                  <TableCell>${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={product.sold} 
                        onCheckedChange={() => handleToggleSold(product.id)} 
                      />
                      <span className={product.sold ? "text-red-500" : "text-green-500"}>
                        {product.sold ? "Vendido" : "Disponible"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Versión móvil - Cards */}
      <div className="md:hidden space-y-4 p-4">
        {products.length === 0 ? (
          <div className="text-center py-4">No hay productos disponibles.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-16 rounded overflow-hidden">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"}
                    alt={product.model || "Producto"}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{product.model}</h3>
                  <p className="text-sm text-gray-500">{product.category} • {product.year}</p>
                  <p className="font-semibold">${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${product.sold ? "text-red-500" : "text-green-500"}`}>
                    {product.sold ? "Vendido" : "Disponible"}
                  </span>
                  <Switch 
                    checked={product.sold} 
                    onCheckedChange={() => handleToggleSold(product.id)} 
                    className="h-4 w-8"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="h-8 px-2"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  <span className="sr-only md:not-sr-only">Editar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  <span className="sr-only md:not-sr-only">Eliminar</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición - Responsive */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        {editingProduct && (
          <DialogContent className="max-h-[90vh] sm:max-w-[600px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="grid gap-4 py-4">
                {/* Modelo */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="sm:text-right">
                    Modelo
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="sm:col-span-3"
                    placeholder="Nombre del modelo"
                  />
                </div>
                
                {/* Año y Precio en la misma fila en desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="sm:text-right">
                      Año
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      className="sm:col-span-3"
                      placeholder="Año del producto"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="sm:text-right">
                      Precio
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      className="sm:col-span-3"
                      placeholder="Precio en dólares"
                    />
                  </div>
                </div>
                
                {/* Categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="sm:text-right">
                    Categoría
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger className="sm:col-span-3">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Descripción */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="sm:text-right mt-2">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="sm:col-span-3"
                    placeholder="Descripción detallada del producto"
                    rows={4}
                  />
                </div>
                
                {/* Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="sold" className="sm:text-right">
                    Estado
                  </Label>
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <Switch
                      id="sold"
                      checked={formData.sold}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({...prev, sold: checked}))
                      }
                    />
                    <span>{formData.sold ? "Vendido" : "Disponible"}</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setEditingProduct(null)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdate}
                className="w-full sm:w-auto"
              >
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}