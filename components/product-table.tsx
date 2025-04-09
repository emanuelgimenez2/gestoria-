"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase" // Asegúrate de tener tu configuración de Firebase correcta

export default function ProductTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleEdit = (product) => {
    // Implementar la lógica de edición
    console.log("Editar producto:", product)
    // Aquí podrías abrir un modal o navegar a una página de edición
  }

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId))
      // Actualizar el estado para eliminar el producto de la lista
      setProducts(products.filter(product => product.id !== productId))
    } catch (error) {
      console.error("Error deleting product: ", error)
    }
  }

  const handleToggleSold = async (productId) => {
    try {
      // Encontrar el producto actual
      const product = products.find(p => p.id === productId)
      if (!product) return

      // Actualizar en Firestore
      const productRef = doc(db, "products", productId)
      await updateDoc(productRef, {
        sold: !product.sold
      })

      // Actualizar el estado local
      setProducts(products.map(p => 
        p.id === productId ? { ...p, sold: !p.sold } : p
      ))
    } catch (error) {
      console.error("Error updating product status: ", error)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando productos...</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
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
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.model}</TableCell>
                <TableCell>${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={product.sold} onCheckedChange={() => handleToggleSold(product.id)} />
                    <span className={product.sold ? "text-red-500" : "text-green-500"}>
                      {product.sold ? "Vendido" : "Disponible"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
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
  )
}