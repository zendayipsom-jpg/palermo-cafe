"use client";

import { useState, useEffect, useRef } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Cargando editor...</p>
    </div>
  ),
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  tags: string | null;
  metaTitle?: string | null;
  metaDesc?: string | null;
  createdAt: string;
  user?: { name: string | null; email: string } | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
    tags: "",
    metaTitle: "",
    metaDesc: "",
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
      const url = "/api/admin/blog";
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost
        ? { ...formData, id: editingPost.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingPost(null);
        resetForm();
        fetchPosts();
      } else {
        alert(data.error || "Error al guardar artículo");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error al guardar artículo");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        fetchPosts();
      } else {
        alert(data.error || "Error al eliminar artículo");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error al eliminar artículo");
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });

      const data = await res.json();
      if (data.success) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error toggling published:", error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      image: post.image || "",
      published: post.published,
      tags: post.tags || "",
      metaTitle: post.metaTitle || "",
      metaDesc: post.metaDesc || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      published: false,
      tags: "",
      metaTitle: "",
      metaDesc: "",
    });
  };

  const openNew = () => {
    setEditingPost(null);
    resetForm();
    setShowModal(true);
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
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
          Blog
        </h1>
        <Button
          onClick={openNew}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Título
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Autor
                </th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Fecha
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
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {post.image && (
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {post.user?.name || post.author}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("es-PE")}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        post.published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Publicado
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Borrador
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay artículos aún.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display font-bold">
                {editingPost ? "Editar Artículo" : "Nuevo Artículo"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del artículo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Ej: La historia del café peruano"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL amigable (slug)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="se-genera-automaticamente"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tu artículo estará en: /blog/{formData.slug || "slug"}
                  </p>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">
                  Extracto (aparece en la lista de artículos)
                </Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  rows={2}
                  placeholder="Una breve descripción del artículo..."
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Imagen de portada</Label>
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
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
                        <p className="text-sm text-muted-foreground">
                          Subiendo imagen...
                        </p>
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

              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Contenido del artículo *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                  placeholder="Escribe el contenido de tu artículo aquí. Puedes usar el botón de arriba para formato..."
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Etiquetas (separadas por coma)
                  </span>
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="gastronomía, Lima, tradición, café"
                />
              </div>

              {/* SEO */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-medium text-foreground">
                  🔍 SEO (Opcional - para posicionar en Google)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Título para Google</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, metaTitle: e.target.value })
                      }
                      placeholder="Si lo dejas vacío, usará el título del artículo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDesc">Descripción para Google</Label>
                    <Input
                      id="metaDesc"
                      value={formData.metaDesc}
                      onChange={(e) =>
                        setFormData({ ...formData, metaDesc: e.target.value })
                      }
                      placeholder="Si lo dejas vacío, usará el extracto"
                    />
                  </div>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        published: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                </label>
                <div>
                  <p className="font-medium text-foreground">
                    {formData.published ? "✅ Publicado" : "📝 Borrador"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.published
                      ? "Visible para todos los visitantes"
                      : "Solo tú puedes verlo"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
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
                  className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                >
                  {editingPost ? "Guardar Cambios" : "Crear Artículo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
