"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Upload,
  Code,
  Quote,
  Minus,
} from "lucide-react";
import { useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe tu contenido aquí...",
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-primary underline hover:text-brand-primary/80",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addImageFromUrl = () => {
    const url = window.prompt("URL de la imagen:");
    if (url && editor) {
      // SECURITY: Validate URL to prevent SSRF and javascript: URIs
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          alert("URL no válida. Usa http:// o https://");
          return;
        }
        // Block internal/private IPs
        const hostname = parsed.hostname;
        if (
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname === "::1" ||
          hostname.startsWith("192.168.") ||
          hostname.startsWith("10.") ||
          hostname.startsWith("172.") ||
          hostname.endsWith(".local")
        ) {
          alert("URL no válida. No se permiten URLs internas.");
          return;
        }
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert("URL no válida");
      }
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  if (!editor) {
    return null;
  }

  const ToolButton = ({
    onClick,
    active = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? "bg-brand-primary text-white"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-border mx-1" />;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30">
        {/* Text Formatting */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrita (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Subrayado (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Tachado"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código"
        >
          <Code className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Resaltar"
        >
          <Highlighter className="w-4 h-4" />
        </ToolButton>

        <Divider />

        {/* Headings */}
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Título Grande (H1)"
        >
          <Heading1 className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Título Mediano (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Título Pequeño (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </ToolButton>

        <Divider />

        {/* Lists */}
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </ToolButton>

        <Divider />

        {/* Alignment */}
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Alinear izquierda"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Centrar"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Alinear derecha"
        >
          <AlignRight className="w-4 h-4" />
        </ToolButton>

        <Divider />

        {/* Insert */}
        <ToolButton onClick={setLink} active={editor.isActive("link")} title="Enlace">
          <LinkIcon className="w-4 h-4" />
        </ToolButton>
        <ToolButton onClick={addImageFromUrl} title="Insertar imagen por URL">
          <ImageIcon className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Subir imagen"
        >
          {uploading ? (
            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Línea horizontal"
        >
          <Minus className="w-4 h-4" />
        </ToolButton>

        <Divider />

        {/* Undo/Redo */}
        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer (Ctrl+Shift+Z)"
        >
          <Redo className="w-4 h-4" />
        </ToolButton>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:italic [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
