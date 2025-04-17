"use client"

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db, serverTimestamp } from "@/lib/firebase";

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    model: "",
    year: new Date().getFullYear(),
    price: "",  // Cambiado a string vacío para evitar el cero inicial
    currency: "ARS",
    category: "automotor",
    images: [],
    description: "",
    sold: false,
  });

  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    if (product) {
      // Si el producto existe pero no tiene moneda definida, asignar ARS por defecto
      setFormData({
        ...product,
        currency: product.currency || "ARS",
        // Convertir precio a string si existe para la edición
        price: product.price ? String(product.price) : ""
      });
    } else {
      setFormData({
        id: null,
        model: "",
        year: new Date().getFullYear(),
        price: "",
        currency: "ARS",
        category: "automotor",
        images: [],
        description: "",
        sold: false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    // Para el precio, guardamos el valor como string sin ceros iniciales innecesarios
    if (name === "price") {
      // Eliminar ceros iniciales excepto si es solo "0"
      const cleanedValue = value === "0" ? "0" : value.replace(/^0+/, '');
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Función para convertir archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        // Optimizar imagen antes de convertir a base64
        const img = new Image();
        img.src = reader.result;
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          
          // Calcular nuevas dimensiones para la imagen
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a base64 con calidad reducida
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(base64);
        };
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const processFile = async (file, index, totalFiles) => {
    try {
      // Validación del archivo
      if (!file.type.match('image.*')) {
        throw new Error('Solo se permiten archivos de imagen (JPEG, PNG, etc.)');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('El archivo es demasiado grande (máximo 5MB)');
      }

      setCurrentFileIndex(index + 1);
      setTotalFiles(totalFiles);
      
      // Calcular el progreso simulado
      const updateProgress = (progress) => {
        setUploadProgress(progress);
      };
      
      // Simular progreso de carga
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
        updateProgress(progress);
      }, 50);
      
      // Convertir a base64
      const base64Image = await convertToBase64(file);
      
      // Limpiar el intervalo y establecer progreso completado
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return base64Image;
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      throw error;
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsLoading(true);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        const files = Array.from(e.dataTransfer.files)
          .slice(0, 5 - formData.images.length); // Limitar a 5 imágenes
        
        const newImageUrls = [];
        
        // Procesar archivos uno por uno para mostrar el progreso
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const base64Image = await processFile(file, i, files.length);
          newImageUrls.push(base64Image);
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImageUrls]
        }));
        
        // Resetear el progreso
        setUploadProgress(0);
        setCurrentFileIndex(0);
        setTotalFiles(0);
      } catch (error) {
        setUploadError(error.message || "Error al subir imágenes");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleFileInput = async (e) => {
    setIsLoading(true);
    setUploadError(null);

    if (e.target.files && e.target.files.length > 0) {
      try {
        const files = Array.from(e.target.files)
          .slice(0, 5 - formData.images.length); // Limitar a 5 imágenes
        
        const newImageUrls = [];
        
        // Procesar archivos uno por uno para mostrar el progreso
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const base64Image = await processFile(file, i, files.length);
          newImageUrls.push(base64Image);
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImageUrls]
        }));
        
        // Resetear el progreso
        setUploadProgress(0);
        setCurrentFileIndex(0);
        setTotalFiles(0);
      } catch (error) {
        setUploadError(error.message || "Error al subir imágenes");
      } finally {
        setIsLoading(false);
        e.target.value = ''; // Resetear el input para permitir reselección
      }
    } else {
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) {
      console.log("Operación en curso, esperando...");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validación básica del formulario
      if (!formData.model.trim()) {
        throw new Error("El modelo es requerido");
      }
      
      // Convertir precio a número para la validación y el guardado
      const numericPrice = Number(formData.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("El precio debe ser un número mayor a cero");
      }

      const productData = {
        ...formData,
        price: numericPrice, // Asegurar que el precio se guarde como número
        updatedAt: serverTimestamp(),
      };
      
      if (!productData.id) {
        // Producto nuevo
        productData.createdAt = serverTimestamp();
        delete productData.id;
        
        const docRef = await addDoc(collection(db, "products"), productData);
        console.log("Producto creado con ID:", docRef.id);
        onSave({ ...formData, id: docRef.id, price: numericPrice });
      } else {
        // Actualización
        const productId = productData.id;
        delete productData.id;
        
        await updateDoc(doc(db, "products", productId), productData);
        console.log("Producto actualizado con ID:", productId);
        onSave({ ...formData, price: numericPrice });
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setUploadError(error.message || "Error al guardar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener el símbolo de la moneda
  const getCurrencySymbol = (currency) => {
    return currency === "USD" ? "US$" : "$";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
      <h2 className="text-xl font-bold text-[#0F1A3D] mb-4">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Primera columna */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="model">Modelo *</Label>
            <Input 
              id="model" 
              name="model" 
              value={formData.model}
              onChange={handleChange}
              required 
              disabled={isLoading}
              placeholder="Ingrese el modelo"
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="year">Año *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleNumberChange}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automotor">Automotor</SelectItem>
                <SelectItem value="nautica">Náutica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Estado</Label>
            <div className="flex items-center gap-2 mt-2">
              <Switch 
                checked={formData.sold} 
                onCheckedChange={(checked) => handleSwitchChange("sold", checked)}
                disabled={isLoading}
              />
              <span>{formData.sold ? "Vendido" : "Disponible"}</span>
            </div>
          </div>
        </div>

        {/* Segunda columna */}
        <div className="space-y-4">
          {/* Sección de Precio con selección de moneda */}
          <div>
            <Label htmlFor="price">Precio *</Label>
            <div className="flex gap-2">
            <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{getCurrencySymbol(formData.currency)}</span>
            </div>
            <Input
              id="price"
              name="price"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.price}
              onChange={handleNumberChange}
              required
              disabled={isLoading}
              className={`${formData.currency === "USD" ? "pl-12" : "pl-8"} w-full`}
              placeholder="Ingrese el precio"
            />
          </div>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleSelectChange("currency", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="currency" className="w-24">
                  <SelectValue placeholder="Moneda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              disabled={isLoading}
              placeholder="Ingrese una descripción detallada del producto"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Sección de imágenes (ocupa todo el ancho) */}
      <div className="mt-4">
        <Label>Imágenes {formData.images.length > 0 && `(${formData.images.length}/5)`}</Label>
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Arrastra y suelta imágenes aquí (máx. 5), o
          </p>
          <Input 
            id="images" 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            onChange={handleFileInput} 
            disabled={isLoading || formData.images.length >= 5}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById("images").click()}
            disabled={isLoading || formData.images.length >= 5}
          >
            Seleccionar archivos
          </Button>
          
          {isLoading && (
            <div className="mt-2">
              <p className="text-sm text-blue-500">
                Procesando imagen {currentFileIndex} de {totalFiles}...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(uploadProgress)}%</p>
            </div>
          )}
          
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
          
          {formData.images.length >= 5 && (
            <p className="mt-2 text-sm text-yellow-600">
              Has alcanzado el límite de 5 imágenes
            </p>
          )}
        </div>

        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Imagen ${index + 1} del producto`}
                  className="h-20 w-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  disabled={isLoading}
                  aria-label="Eliminar imagen"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadError && (
        <div className="text-red-500 text-sm">{uploadError}</div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {product ? "Actualizando..." : "Guardando..."}
            </span>
          ) : product ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}