"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  available: boolean;
  featured: boolean;
  order: number;
}

const categories = ["sandwiches", "desayunos", "bebidas", "postres"];

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "sandwiches",
    image: "",
    available: true,
    featured: false,
    order: "0",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      const data = await res.json();
      if (data.success) {
        return data.url;
      } else {
        alert(data.error || "Error al subir imagen");
        return null;
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Error al subir imagen");
      return null;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen");
      return;
    }

    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
    }
    setUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const body = editingProduct
        ? { ...formData, id: editingProduct.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        alert(data.error || "Error al guardar producto");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error al guardar producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
      available: product.available,
      featured: product.featured,
      order: product.order.toString(),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "sandwiches",
      image: "",
      available: true,
      featured: false,
      order: "0",
    });
  };

  const openNew = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Productos
        </h1>
        <Button onClick={openNew} className="bg-brand-primary hover:bg-brand-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Producto
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Categoría
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Precio
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        {product.featured && (
                          <span className="text-xs text-brand-accent">⭐ Popular</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    S/. {product.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.available ? "Disponible" : "Agotado"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos registrados.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display font-bold">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (S/.) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Imagen del producto</Label>

                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? "border-brand-primary bg-brand-primary/5"
                        : "border-border hover:border-brand-primary/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
                        <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Arrastra una imagen o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          JPG, PNG, WebP o GIF (máx. 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Disponible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
