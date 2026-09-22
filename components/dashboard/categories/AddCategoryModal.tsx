"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  ArrowRight,
  Check,
  FolderPlus,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

/* ============================================================
   HELPERS
============================================================ */

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 text-[13px] text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#A9C5FF]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05] disabled:opacity-50";

const labelClass = "mb-2 block text-[12px] font-medium text-white/70";

/* ============================================================
   COMPONENT
============================================================ */

export default function AddCategoryModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
     MODAL BEHAVIOR
  ============================================================ */

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, saving, onClose]);

  if (!open) return null;

  /* ============================================================
     HANDLERS
  ============================================================ */

  function resetForm() {
    setName("");
    setSlug("");
    setSlugEdited(false);

    setDescription("");
    setIsActive(true);

    setError(null);
  }

  function handleClose() {
    if (saving) return;

    resetForm();
    onClose();
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError(null);

    if (!name.trim()) {
      setError("Enter a category name.");
      return;
    }

    if (!slug.trim()) {
      setError("Enter a valid category slug.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/dashboard/categories", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create category.");
      }

      resetForm();

      onCreated();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create category.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/85 p-4 backdrop-blur-xl">

      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close category modal"
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      {/* MODAL */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-category-title"
        className="relative flex max-h-[92svh] w-full max-w-[540px] flex-col overflow-hidden rounded-[28px] border border-white/[0.12] bg-[#0b1220] text-white shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
      >

        {/* ATMOSPHERE */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 size-[350px] rounded-full bg-[#608bff]/[0.08] blur-[100px]" />
        </div>

        {/* HEADER */}
        <div className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-5 sm:px-8">

          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
              <FolderPlus size={20} strokeWidth={1.6} className="text-[#A9C5FF]" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/65">
                Quickshipgo / Catalog
              </p>

              <h2
                id="add-category-title"
                className="mt-1 text-[19px] font-semibold tracking-[-0.04em] text-white"
              >
                Create category
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 transition-colors hover:bg-white/[0.10] hover:text-white disabled:opacity-40"
          >
            <X size={17} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8"
        >

          {/* INTRODUCTION */}
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={13} className="text-[#A9C5FF]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/70">
                Product organization
              </span>
            </div>

            <h3 className="text-[25px] font-semibold tracking-[-0.05em] text-white">
              A new collection.
            </h3>

            <p className="mt-2 text-[12px] leading-relaxed text-white/40">
              Create a category to organize products and make your collection
              easier to explore.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-[12px] leading-relaxed text-red-200"
            >
              {error}
            </div>
          )}

          <div className="space-y-6">

            {/* NAME */}
            <div>
              <label htmlFor="category-name" className={labelClass}>
                Category name <span className="text-[#A9C5FF]">*</span>
              </label>

              <input
                id="category-name"
                type="text"
                required
                autoFocus
                maxLength={100}
                value={name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="e.g. Tech Essentials"
                disabled={saving}
                className={inputClass}
              />
            </div>

            {/* SLUG */}
            <div>
              <label htmlFor="category-slug" className={labelClass}>
                Category slug <span className="text-[#A9C5FF]">*</span>
              </label>

              <input
                id="category-slug"
                type="text"
                required
                maxLength={200}
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(slugify(event.target.value));
                }}
                placeholder="tech-essentials"
                disabled={saving}
                className={inputClass}
              />

              <p className="mt-2 text-[10px] text-white/35">
                /categories/{slug || "your-category"}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label htmlFor="category-description" className={labelClass}>
                Description
              </label>

              <textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="Describe the products that belong to this category..."
                disabled={saving}
                className="min-h-[110px] w-full resize-y rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-3 text-[13px] leading-relaxed text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#A9C5FF]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05] disabled:opacity-50"
              />

              <p className="mt-2 text-right text-[10px] text-white/30">
                {description.length}/2000
              </p>
            </div>

            {/* STATUS */}
            <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">

              <div>
                <p className="text-[12px] font-medium text-white/85">
                  Active category
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                  {isActive
                    ? "This category will be available in your catalog."
                    : "This category will be created as inactive."}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label="Active category"
                onClick={() => setIsActive((current) => !current)}
                disabled={saving}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                  isActive ? "bg-[#A9C5FF]" : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
                    isActive ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/[0.08] pt-6">

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 text-[11px] font-medium text-white/65 transition-colors hover:bg-white/[0.10] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !name.trim() || !slug.trim()}
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[11px] font-semibold text-[#080d18] transition-all hover:bg-[#dce8ff] disabled:cursor-wait disabled:opacity-50"
            >
              {saving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check size={15} />
                  Create category

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}