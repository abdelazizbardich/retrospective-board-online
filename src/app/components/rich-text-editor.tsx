"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Minus, Undo, Redo, Link2, Link2Off, ImageIcon,
  Type, FileCode,
} from "lucide-react";

type EditorMode = "text" | "code";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Used to organize uploaded content images in blob storage. */
  uploadSlug?: string;
}

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`flex size-7 items-center justify-center rounded-md text-sm transition-colors
        ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}
        disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  uploadSlug = "content",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<EditorMode>("text");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const insertPosRef = useRef<number | null>(null);
  const isCodeMode = mode === "code";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline hover:opacity-80", rel: "noopener noreferrer" } }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full h-auto my-4" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed || mode !== "text") return;
    const current = editor.getHTML();
    if (value === current) return;
    // TipTap normalizes an empty doc to <p></p>; avoid resetting while typing.
    if (!value && (current === "<p></p>" || current === "<p><br></p>")) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value, mode]);

  const switchToTextMode = () => {
    if (!editor || mode === "text") return;
    editor.commands.setContent(value || "", { emitUpdate: false });
    setMode("text");
  };

  const switchToCodeMode = () => {
    if (!editor || mode === "code") return;
    onChange(editor.getHTML());
    setMode("code");
  };

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImage = (src: string, alt = "") => {
    const pos = insertPosRef.current ?? editor.state.selection.from;
    editor
      .chain()
      .focus()
      .setTextSelection(pos)
      .setImage({ src, alt: alt || undefined })
      .run();
    insertPosRef.current = null;
  };

  const rememberInsertPosition = () => {
    insertPosRef.current = editor.state.selection.from;
  };

  const addImage = async () => {
    rememberInsertPosition();

    const wantGenerate = window.confirm(
      "Generate an image from a description?\n\nClick OK to describe the image, or Cancel to upload a file or paste a URL.",
    );

    if (wantGenerate) {
      const description = window.prompt("Describe the image you want to generate");
      if (!description?.trim()) {
        insertPosRef.current = null;
        return;
      }

      setImageGenerating(true);
      try {
        const res = await fetch("/api/blog/generate-content-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: description.trim(), slug: uploadSlug }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(data.error ?? "Image generation failed");
          return;
        }
        insertImage(data.url, description.trim());
      } catch {
        window.alert("Image generation failed");
      } finally {
        setImageGenerating(false);
      }
      return;
    }

    const url = window.prompt("Image URL (leave empty to upload a file)");
    if (url === null) {
      insertPosRef.current = null;
      return;
    }
    if (url.trim()) {
      const alt = window.prompt("Alt text (optional)", "") ?? "";
      insertImage(url.trim(), alt.trim());
      return;
    }
    fileInputRef.current?.click();
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      insertPosRef.current = null;
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please upload an image file (JPEG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      window.alert("Image must be under 4 MB");
      return;
    }

    setImageUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", uploadSlug);
      body.append("folder", "content");

      const res = await fetch("/api/blog/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(data.error ?? "Upload failed");
        return;
      }

      const defaultAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      const alt = window.prompt("Alt text (optional)", defaultAlt) ?? "";
      insertImage(data.url, alt.trim());
    } catch {
      window.alert("Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary/40">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFile}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} disabled={isCodeMode} title="Bold">
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} disabled={isCodeMode} title="Italic">
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} disabled={isCodeMode} title="Strikethrough">
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} disabled={isCodeMode} title="Inline code">
          <Code className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} disabled={isCodeMode} title="Heading 1">
          <Heading1 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} disabled={isCodeMode} title="Heading 2">
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} disabled={isCodeMode} title="Heading 3">
          <Heading3 className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} disabled={isCodeMode} title="Bullet list">
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} disabled={isCodeMode} title="Ordered list">
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} disabled={isCodeMode} title="Blockquote">
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={isCodeMode} title="Horizontal rule">
          <Minus className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} disabled={isCodeMode} title="Set link">
          <Link2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={isCodeMode || !editor.isActive("link")} title="Remove link">
          <Link2Off className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton
          onClick={addImage}
          disabled={isCodeMode || imageUploading || imageGenerating}
          title={
            imageGenerating
              ? "Generating image…"
              : imageUploading
                ? "Uploading image…"
                : "Insert image"
          }
        >
          <ImageIcon className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={isCodeMode || !editor.can().undo()} title="Undo">
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={isCodeMode || !editor.can().redo()} title="Redo">
          <Redo className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" />

        <div className="ml-auto flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5">
          <ToolbarButton onClick={switchToTextMode} active={mode === "text"} title="Text mode">
            <Type className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={switchToCodeMode} active={mode === "code"} title="Code mode">
            <FileCode className="size-3.5" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor area */}
      {isCodeMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="min-h-[320px] w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground focus:outline-none"
        />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  );
}
