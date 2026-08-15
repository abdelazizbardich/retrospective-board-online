"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Minus, Undo, Redo, Link2, Link2Off, ImageIcon,
  Type, FileCode, Sparkles, Upload, X,
} from "lucide-react";

type EditorMode = "text" | "code";

type DialogState =
  | { kind: "none" }
  | { kind: "link-url" }
  | { kind: "image-choice" }
  | { kind: "image-describe" }
  | { kind: "image-url" }
  | { kind: "image-alt"; url: string; defaultAlt: string }
  | { kind: "alert"; message: string };

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

function EditorDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-dialog-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 id="editor-dialog-title" className="text-base font-semibold">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {children ? <div className="p-5">{children}</div> : null}

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
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
  const [mounted, setMounted] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });
  const [linkUrlInput, setLinkUrlInput] = useState("");
  const [imageDescriptionInput, setImageDescriptionInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageAltInput, setImageAltInput] = useState("");
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

  useEffect(() => setMounted(true), []);

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

  const closeDialog = () => {
    if (dialog.kind === "image-choice" || dialog.kind === "image-describe" || dialog.kind === "image-url") {
      insertPosRef.current = null;
    }
    setDialog({ kind: "none" });
  };

  const showAlert = (message: string) => {
    setDialog({ kind: "alert", message });
  };

  if (!editor) return null;

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

  const setLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    setLinkUrlInput(prev);
    setDialog({ kind: "link-url" });
  };

  const applyLink = () => {
    const url = linkUrlInput;
    setDialog({ kind: "none" });
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    rememberInsertPosition();
    setDialog({ kind: "image-choice" });
  };

  const generateImage = async () => {
    const description = imageDescriptionInput.trim();
    if (!description) return;

    setImageGenerating(true);
    try {
      const res = await fetch("/api/blog/generate-content-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, slug: uploadSlug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showAlert(data.error ?? "Image generation failed");
        return;
      }
      setImageAltInput(description);
      setDialog({ kind: "image-alt", url: data.url, defaultAlt: description });
    } catch {
      showAlert("Image generation failed");
    } finally {
      setImageGenerating(false);
    }
  };

  const submitImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) {
      setDialog({ kind: "none" });
      fileInputRef.current?.click();
      return;
    }
    setImageAltInput("");
    setDialog({ kind: "image-alt", url, defaultAlt: "" });
  };

  const submitImageAlt = () => {
    if (dialog.kind !== "image-alt") return;
    insertImage(dialog.url, imageAltInput.trim());
    setDialog({ kind: "none" });
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      insertPosRef.current = null;
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert("Please upload an image file (JPEG, PNG, WebP, or GIF)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showAlert("Image must be under 4 MB");
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
        showAlert(data.error ?? "Upload failed");
        return;
      }

      const defaultAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setImageAltInput(defaultAlt);
      setDialog({ kind: "image-alt", url: data.url, defaultAlt });
    } catch {
      showAlert("Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  const dialogContent = (() => {
    switch (dialog.kind) {
      case "link-url":
        return (
          <EditorDialog
            open
            onClose={closeDialog}
            title="Link URL"
            footer={
              <>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyLink}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </>
            }
          >
            <input
              autoFocus
              type="url"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyLink(); }}
              placeholder="https://example.com"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-muted-foreground">Leave empty to remove the link.</p>
          </EditorDialog>
        );

      case "image-choice":
        return (
          <EditorDialog
            open
            onClose={closeDialog}
            title="Insert image"
            description="Generate an image from a description, or upload a file and paste a URL."
          >
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setImageDescriptionInput("");
                  setDialog({ kind: "image-describe" });
                }}
                className="rounded-xl border-2 border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="text-sm font-semibold">Generate from description</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Describe the image you want and we&apos;ll create it for you.
                </p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrlInput("");
                  setDialog({ kind: "image-url" });
                }}
                className="rounded-xl border-2 border-border p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="size-5" />
                </div>
                <h3 className="text-sm font-semibold">Upload or paste URL</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Upload a file from your computer or paste an image URL.
                </p>
              </button>
            </div>
          </EditorDialog>
        );

      case "image-describe":
        return (
          <EditorDialog
            open
            onClose={closeDialog}
            title="Describe the image"
            description="Be specific about style, subject, and mood."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setDialog({ kind: "image-choice" })}
                  disabled={imageGenerating}
                  className="mr-auto rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={imageGenerating}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={generateImage}
                  disabled={imageGenerating || !imageDescriptionInput.trim()}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {imageGenerating ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Generate
                </button>
              </>
            }
          >
            <textarea
              autoFocus
              value={imageDescriptionInput}
              onChange={(e) => setImageDescriptionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateImage();
                }
              }}
              rows={4}
              placeholder="A minimalist illustration of a team doing a retrospective…"
              className={`${inputClass} resize-y`}
            />
          </EditorDialog>
        );

      case "image-url":
        return (
          <EditorDialog
            open
            onClose={closeDialog}
            title="Image URL"
            description="Paste a URL, or leave empty to upload a file."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setDialog({ kind: "image-choice" })}
                  className="mr-auto rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDialog({ kind: "none" });
                    fileInputRef.current?.click();
                  }}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={submitImageUrl}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Insert
                </button>
              </>
            }
          >
            <input
              autoFocus
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitImageUrl(); }}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </EditorDialog>
        );

      case "image-alt": {
        const cancelAlt = () => {
          insertImage(dialog.url, "");
          setDialog({ kind: "none" });
        };
        return (
          <EditorDialog
            open
            onClose={cancelAlt}
            title="Alt text"
            description="Describe the image for accessibility and SEO."
            footer={
              <>
                <button
                  type="button"
                  onClick={cancelAlt}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={submitImageAlt}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Insert image
                </button>
              </>
            }
          >
            <input
              autoFocus
              type="text"
              value={imageAltInput}
              onChange={(e) => setImageAltInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitImageAlt(); }}
              placeholder={dialog.defaultAlt || "Optional alt text"}
              className={inputClass}
            />
          </EditorDialog>
        );
      }

      case "alert":
        return (
          <EditorDialog
            open
            onClose={closeDialog}
            title="Something went wrong"
            footer={
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                OK
              </button>
            }
          >
            <p className="text-sm text-foreground">{dialog.message}</p>
          </EditorDialog>
        );

      default:
        return null;
    }
  })();

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

      {mounted && dialogContent ? createPortal(dialogContent, document.body) : null}
    </div>
  );
}
