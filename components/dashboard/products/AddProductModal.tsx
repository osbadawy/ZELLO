"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleCheck,
  DollarSign,
  ImagePlus,
  Layers3,
  LoaderCircle,
  Package,
  Plus,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Upload,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Supplier = {
  id: string;
  name: string;
  provider: string;
};

type OptionsResponse = {
  categories: Category[];
  suppliers: Supplier[];
};

type ProductImage = {
  id: string;
  file: File;
  preview: string;
  altText: string;
  isPrimary: boolean;
};

type VariantSupplier = {
  id: string;
  supplierId: string;
  supplierSku: string;
  supplierProductId: string;
  cost: string;
  currency: string;
  stockQuantity: string;
  estimatedShippingDays: string;
  isAvailable: boolean;
  isActive: boolean;
};

type VariantOption = {
  id: string;
  key: string;
  value: string;
};

type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  price: string;
  isActive: boolean;
  options: VariantOption[];
  suppliers: VariantSupplier[];
};

type RatingKey =
  | "dailyUseRating"
  | "reliabilityRating"
  | "qualityRating"
  | "recommendRating"
  | "overallRating";

type Section =
  | "general"
  | "pricing"
  | "media"
  | "categories"
  | "ratings"
  | "variants"
  | "publishing";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

/* ============================================================
   CONSTANTS
============================================================ */

const sections = [
  { id: "general", label: "General", icon: Package },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "media", label: "Images & media", icon: ImagePlus },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "ratings", label: "Product ratings", icon: Star },
  { id: "variants", label: "Variants & suppliers", icon: Layers3 },
  { id: "publishing", label: "Publishing", icon: CircleCheck },
] as const;

const ratingFields = [
  {
    key: "dailyUseRating",
    label: "Daily use",
    description: "How useful is this product in everyday life?",
    color: "#A9C5FF",
  },
  {
    key: "reliabilityRating",
    label: "Reliability",
    description: "How consistently does this product perform?",
    color: "#86E0C1",
  },
  {
    key: "qualityRating",
    label: "Quality",
    description: "Rate the product's materials, build, and finish.",
    color: "#C3ADFF",
  },
  {
    key: "recommendRating",
    label: "Recommendation",
    description: "How strongly would you recommend this product?",
    color: "#E8C59B",
  },
  {
    key: "overallRating",
    label: "Overall",
    description: "Your overall assessment of the product.",
    color: "#FFFFFF",
  },
] as const;

const currencies = ["USD", "EUR", "GBP", "EGP", "SAR", "AED"];

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGE_SIZE = 24 * 1024 * 1024;

const inputClass =
  "h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 text-[13px] text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#A9C5FF]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05] disabled:opacity-50";

const textareaClass =
  "min-h-[110px] w-full resize-y rounded-xl border border-white/[0.10] bg-white/[0.045] px-4 py-3 text-[13px] leading-relaxed text-white outline-none transition-all placeholder:text-white/25 hover:border-white/20 focus:border-[#A9C5FF]/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#A9C5FF]/[0.05]";

const labelClass = "mb-2 block text-[12px] font-medium text-white/70";

const panelClass =
  "rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6";

/* ============================================================
   HELPERS
============================================================ */

function createId() {
  return crypto.randomUUID();
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function optionalNumber(value: string) {
  return value.trim() === "" ? null : Number(value);
}

function optionalString(value: string) {
  return value.trim() || null;
}

function createVariant(): ProductVariant {
  return {
    id: createId(),
    sku: "",
    name: "",
    size: "",
    color: "",
    price: "",
    isActive: true,
    options: [],
    suppliers: [],
  };
}

function createSupplier(): VariantSupplier {
  return {
    id: createId(),
    supplierId: "",
    supplierSku: "",
    supplierProductId: "",
    cost: "",
    currency: "USD",
    stockQuantity: "0",
    estimatedShippingDays: "",
    isAvailable: false,
    isActive: true,
  };
}

/* ============================================================
   REUSABLE UI
============================================================ */

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}

        {required && (
          <span className="ml-1 text-[#A9C5FF]">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-[10px] leading-relaxed text-white/35">
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#A9C5FF]/75">
        {eyebrow}
      </span>

      <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.05em] text-white sm:text-[30px]">
        {title}
      </h2>

      <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-white/40">
        {description}
      </p>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
      <div>
        <p className="text-[12px] font-medium text-white/85">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-[11px] leading-relaxed text-white/40">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-[#A9C5FF]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "left-1 translate-x-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   MAIN MODAL
============================================================ */

export default function AddProductModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [section, setSection] = useState<Section>("general");

  const [options, setOptions] = useState<OptionsResponse>({
    categories: [],
    suppliers: [],
  });

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GENERAL
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  // PRICING
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");

  // MEDIA
  const [instagramVideoUrl, setInstagramVideoUrl] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlsRef = useRef<string[]>([]);

  // CATEGORIES
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");

  // RATINGS
  const [ratings, setRatings] = useState<Record<RatingKey, string>>({
    dailyUseRating: "",
    reliabilityRating: "",
    qualityRating: "",
    recommendRating: "",
    overallRating: "",
  });

  // VARIANTS
  const [variants, setVariants] = useState<ProductVariant[]>([
    createVariant(),
  ]);

  // PUBLISHING
  const [isActive, setIsActive] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     LOAD OPTIONS
  ============================================================ */

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    async function loadOptions() {
      setLoadingOptions(true);

      try {
        const response = await fetch(
          "/api/admin/dashboard/products/options",
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Unable to load categories and suppliers.");
        }

        const result: OptionsResponse = await response.json();

        if (!controller.signal.aborted) {
          setOptions(result);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load product options.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => controller.abort();
  }, [open]);

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

  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (!open) return null;

  /* ============================================================
     HELPERS
  ============================================================ */

  function navigateTo(nextSection: Section) {
    setSection(nextSection);
    setError(null);

    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    imageUrlsRef.current = [];

    setSection("general");

    setName("");
    setSlug("");
    setSlugEdited(false);

    setDescription("");
    setShortDescription("");

    setPrice("");
    setCurrency("USD");

    setInstagramVideoUrl("");
    setImages([]);

    setCategoryIds([]);
    setNewCategories([]);
    setCategoryInput("");

    setRatings({
      dailyUseRating: "",
      reliabilityRating: "",
      qualityRating: "",
      recommendRating: "",
      overallRating: "",
    });

    setVariants([createVariant()]);
    setIsActive(false);

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

  function updateRating(key: RatingKey, value: string) {
    setRatings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  /* ============================================================
     IMAGE MANAGEMENT
  ============================================================ */

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const currentSize = images.reduce(
      (total, image) => total + image.file.size,
      0,
    );

    const addedSize = files.reduce(
      (total, file) => total + file.size,
      0,
    );

    if (currentSize + addedSize > MAX_TOTAL_IMAGE_SIZE) {
      setError("The combined image size cannot exceed 24 MB.");
      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
      ) {
        setError("Only JPEG, PNG, and WebP images are supported.");
        event.target.value = "";
        return;
      }

      if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
        setError("Each image must be smaller than 5 MB.");
        event.target.value = "";
        return;
      }
    }

    const newImages = files.map((file, index) => {
      const preview = URL.createObjectURL(file);

      imageUrlsRef.current.push(preview);

      return {
        id: createId(),
        file,
        preview,
        altText: "",
        isPrimary: images.length === 0 && index === 0,
      };
    });

    setImages((current) => [...current, ...newImages]);
    setError(null);

    event.target.value = "";
  }

  function removeImage(id: string) {
    setImages((current) => {
      const removed = current.find((image) => image.id === id);

      if (removed) {
        URL.revokeObjectURL(removed.preview);

        imageUrlsRef.current = imageUrlsRef.current.filter(
          (url) => url !== removed.preview,
        );
      }

      const remaining = current.filter((image) => image.id !== id);

      if (removed?.isPrimary && remaining.length > 0) {
        remaining[0] = {
          ...remaining[0],
          isPrimary: true,
        };
      }

      return remaining;
    });
  }

  function updateImage(id: string, changes: Partial<ProductImage>) {
    setImages((current) =>
      current.map((image) =>
        image.id === id
          ? { ...image, ...changes }
          : image,
      ),
    );
  }

  function setPrimaryImage(id: string) {
    setImages((current) =>
      current.map((image) => ({
        ...image,
        isPrimary: image.id === id,
      })),
    );
  }

  /* ============================================================
     CATEGORY MANAGEMENT
  ============================================================ */

  function toggleCategory(id: string) {
    setCategoryIds((current) =>
      current.includes(id)
        ? current.filter((categoryId) => categoryId !== id)
        : [...current, id],
    );
  }

  function addCategory() {
    const category = categoryInput.trim();

    if (!category) return;

    if (
      !newCategories.some(
        (existing) =>
          slugify(existing) === slugify(category),
      )
    ) {
      setNewCategories((current) => [...current, category]);
    }

    setCategoryInput("");
  }

  /* ============================================================
     VARIANT MANAGEMENT
  ============================================================ */

  function updateVariant(
    id: string,
    changes: Partial<ProductVariant>,
  ) {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id
          ? { ...variant, ...changes }
          : variant,
      ),
    );
  }

  function removeVariant(id: string) {
    setVariants((current) =>
      current.filter((variant) => variant.id !== id),
    );
  }

  function updateSupplier(
    variantId: string,
    supplierId: string,
    changes: Partial<VariantSupplier>,
  ) {
    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        return {
          ...variant,
          suppliers: variant.suppliers.map((supplier) =>
            supplier.id === supplierId
              ? { ...supplier, ...changes }
              : supplier,
          ),
        };
      }),
    );
  }

  function removeSupplier(variantId: string, supplierId: string) {
    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        return {
          ...variant,
          suppliers: variant.suppliers.filter(
            (supplier) => supplier.id !== supplierId,
          ),
        };
      }),
    );
  }

  function updateVariantOption(
    variantId: string,
    optionId: string,
    changes: Partial<VariantOption>,
  ) {
    setVariants((current) =>
      current.map((variant) => {
        if (variant.id !== variantId) return variant;

        return {
          ...variant,
          options: variant.options.map((option) =>
            option.id === optionId
              ? { ...option, ...changes }
              : option,
          ),
        };
      }),
    );
  }

  /* ============================================================
     CREATE PRODUCT
  ============================================================ */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError(null);

    if (!name.trim()) {
      navigateTo("general");
      setError("Enter a product name.");
      return;
    }

    if (!description.trim()) {
      navigateTo("general");
      setError("Enter a product description.");
      return;
    }

    if (!slug.trim()) {
      navigateTo("general");
      setError("Enter a valid product slug.");
      return;
    }

    if (price.trim() === "" || Number(price) < 0 || !Number.isFinite(Number(price))) {
      navigateTo("pricing");
      setError("Enter a valid product price.");
      return;
    }

    if (variants.length === 0) {
      navigateTo("variants");
      setError("Add at least one product variant.");
      return;
    }

    for (const variant of variants) {
      if (!variant.sku.trim()) {
        navigateTo("variants");
        setError("Every variant requires a SKU.");
        return;
      }

      for (const supplier of variant.suppliers) {
        if (
          !supplier.supplierId ||
          !supplier.supplierSku.trim() ||
          supplier.cost.trim() === ""
        ) {
          navigateTo("variants");
          setError("Complete the supplier information for each variant.");
          return;
        }
      }
    }

    const usedSkus = variants.map((variant) => variant.sku.trim());

    if (new Set(usedSkus).size !== usedSkus.length) {
      navigateTo("variants");
      setError("Variant SKUs must be unique.");
      return;
    }

    const supplierSkuKeys = variants.flatMap((variant) =>
      variant.suppliers.map(
        (supplier) =>
          `${supplier.supplierId}:${supplier.supplierSku.trim()}`,
      ),
    );

    if (new Set(supplierSkuKeys).size !== supplierSkuKeys.length) {
      navigateTo("variants");
      setError("A supplier SKU cannot be reused for the same supplier.");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      shortDescription: optionalString(shortDescription),

      price: Number(price),
      currency,

      instagramVideoUrl: optionalString(instagramVideoUrl),

      dailyUseRating: optionalNumber(ratings.dailyUseRating),
      reliabilityRating: optionalNumber(ratings.reliabilityRating),
      qualityRating: optionalNumber(ratings.qualityRating),
      recommendRating: optionalNumber(ratings.recommendRating),
      overallRating: optionalNumber(ratings.overallRating),

      isActive,

      categoryIds,
      newCategories,

      images: images.map((image, index) => ({
        altText: image.altText,
        isPrimary: image.isPrimary,
        sortOrder: index,
      })),

      variants: variants.map((variant) => ({
        sku: variant.sku.trim(),
        name: optionalString(variant.name),
        size: optionalString(variant.size),
        color: optionalString(variant.color),

        price: optionalNumber(variant.price),
        isActive: variant.isActive,

        options:
          variant.options.length > 0
            ? Object.fromEntries(
                variant.options
                  .filter((option) => option.key.trim())
                  .map((option) => [
                    option.key.trim(),
                    option.value.trim(),
                  ]),
              )
            : null,

        suppliers: variant.suppliers.map((supplier) => ({
          supplierId: supplier.supplierId,
          supplierSku: supplier.supplierSku.trim(),
          supplierProductId: optionalString(supplier.supplierProductId),

          cost: Number(supplier.cost),
          currency: supplier.currency,

          stockQuantity: Number(supplier.stockQuantity),
          estimatedShippingDays: optionalNumber(supplier.estimatedShippingDays),

          isAvailable: supplier.isAvailable,
          isActive: supplier.isActive,
        })),
      })),
    };

    const formData = new FormData();

    formData.append("product", JSON.stringify(payload));

    images.forEach((image) => {
      formData.append("images", image.file);
    });

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/dashboard/products/create",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create product.");
      }

      resetForm();
      onCreated();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create product.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ============================================================
     SECTION NAVIGATION
  ============================================================ */

  const currentSectionIndex = sections.findIndex(
    (item) => item.id === section,
  );

  const nextSection = sections[currentSectionIndex + 1];

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/85 p-0 backdrop-blur-xl sm:p-4">

      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close product modal"
        onClick={handleClose}
        className="absolute inset-0 cursor-default"
      />

      {/* MODAL */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="relative flex h-full w-full max-w-[1150px] flex-col overflow-hidden border border-white/[0.12] bg-[#0b1220] text-white shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:h-[min(900px,94svh)] sm:rounded-[30px]"
      >

        {/* AMBIENT BACKGROUND */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 size-[450px] rounded-full bg-[#608bff]/[0.07] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 size-[450px] rounded-full bg-[#608bff]/[0.04] blur-[100px]" />
        </div>

        {/* HEADER */}
        <div className="relative z-10 flex shrink-0 items-center justify-between gap-5 border-b border-white/[0.08] bg-[#0b1220]/85 px-5 py-5 backdrop-blur-xl sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
              <Boxes size={19} strokeWidth={1.6} className="text-[#A9C5FF]" />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#A9C5FF]/65">
                Quickshipgo / Catalog
              </p>

              <h2
                id="add-product-title"
                className="mt-1 text-[19px] font-semibold tracking-[-0.04em]"
              >
                Add new product
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/50 transition-colors hover:bg-white/[0.10] hover:text-white disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden"
        >

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">

            {/* SIDEBAR */}
            <nav
              aria-label="Product form sections"
              className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.08] bg-white/[0.015] p-3 md:w-[215px] md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:p-4"
            >
              {sections.map((item, index) => {
                const Icon = item.icon;
                const selected = section === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                      selected
                        ? "border border-[#A9C5FF]/15 bg-[#A9C5FF]/10 text-white"
                        : "border border-transparent text-white/40 hover:bg-white/[0.05] hover:text-white/80"
                    }`}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.7}
                      className={selected ? "text-[#A9C5FF]" : ""}
                    />

                    <span className="whitespace-nowrap text-[11px] font-medium">
                      {item.label}
                    </span>

                    {selected && (
                      <span className="ml-auto hidden text-[9px] text-[#A9C5FF]/60 md:block">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* FORM BODY */}
            <div
              ref={contentRef}
              className="min-h-0 min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9"
            >
              <div className="mx-auto w-full max-w-[760px]">

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-[12px] leading-relaxed text-red-200"
                  >
                    {error}
                  </div>
                )}

                {/* =====================================================
                    GENERAL INFORMATION
                ===================================================== */}

                {section === "general" && (
                  <div>
                    <SectionHeading
                      eyebrow="01 / Product information"
                      title="The essentials."
                      description="Start with the information customers will see when discovering your product."
                    />

                    <div className="space-y-6">

                      <Field label="Product name" required>
                        <input
                          type="text"
                          value={name}
                          onChange={(event) => handleNameChange(event.target.value)}
                          placeholder="e.g. Wireless Magnetic Power Bank"
                          maxLength={200}
                          className={inputClass}
                        />
                      </Field>

                      <Field
                        label="Product slug"
                        required
                        hint="Used in your product's URL. Automatically generated from the name, but you can customize it."
                      >
                        <input
                          type="text"
                          value={slug}
                          onChange={(event) => {
                            setSlugEdited(true);
                            setSlug(slugify(event.target.value));
                          }}
                          placeholder="wireless-magnetic-power-bank"
                          maxLength={200}
                          className={inputClass}
                        />

                        <p className="mt-2 text-[10px] text-white/30">
                          /products/{slug || "your-product"}
                        </p>
                      </Field>

                      <Field label="Short description">
                        <textarea
                          value={shortDescription}
                          onChange={(event) => setShortDescription(event.target.value)}
                          placeholder="A short introduction to your product..."
                          maxLength={2000}
                          rows={3}
                          className={textareaClass}
                        />
                      </Field>

                      <Field label="Full description" required>
                        <textarea
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Describe the product, its features, benefits, and what makes it special..."
                          maxLength={20000}
                          rows={7}
                          className={`${textareaClass} min-h-[200px]`}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    PRICING
                ===================================================== */}

                {section === "pricing" && (
                  <div>
                    <SectionHeading
                      eyebrow="02 / Product pricing"
                      title="Set your price."
                      description="Configure the product's base price and currency. Individual variants can override this price."
                    />

                    <div className={panelClass}>
                      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_150px]">

                        <Field label="Base price" required>
                          <input
                            type="number"
                            min="0"
                            max="99999999.99"
                            step="0.01"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            placeholder="0.00"
                            className={inputClass}
                          />
                        </Field>

                        <Field label="Currency">
                          <select
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value)}
                            className={`${inputClass} cursor-pointer bg-[#131d30]`}
                          >
                            {currencies.map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <div className="mt-6 rounded-2xl border border-[#A9C5FF]/10 bg-[#A9C5FF]/[0.045] p-4">
                        <p className="text-[11px] leading-relaxed text-white/45">
                          This is your storefront selling price. Supplier
                          purchasing costs are configured separately for
                          each product variant.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    IMAGES AND MEDIA
                ===================================================== */}

                {section === "media" && (
                  <div>
                    <SectionHeading
                      eyebrow="03 / Product media"
                      title="Make it visual."
                      description="Upload product images and add an Instagram video to showcase the product."
                    />

                    <div className="space-y-7">

                      {/* IMAGE UPLOAD */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className={labelClass}>
                            Product images
                          </span>

                          <span className="text-[10px] text-white/35">
                            {images.length}/{MAX_IMAGES}
                          </span>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={images.length >= MAX_IMAGES}
                          className="group flex min-h-[150px] w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-[#A9C5FF]/25 bg-[#A9C5FF]/[0.035] px-5 py-8 transition-all hover:border-[#A9C5FF]/50 hover:bg-[#A9C5FF]/[0.065] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                            <Upload size={19} className="text-[#A9C5FF]" />
                          </div>

                          <span className="text-[12px] font-medium text-white/80">
                            Upload product images
                          </span>

                          <span className="mt-2 text-[10px] text-white/35">
                            JPEG, PNG or WebP · Up to 5 MB per image
                          </span>
                        </button>
                      </div>

                      {/* IMAGE PREVIEWS */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {images.map((image) => (
                            <div
                              key={image.id}
                              className="overflow-hidden rounded-[19px] border border-white/[0.10] bg-white/[0.035]"
                            >
                              <div className="relative aspect-square overflow-hidden bg-[#16243a]">
                                <img
                                  src={image.preview}
                                  alt={image.altText || "Product preview"}
                                  className="h-full w-full object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id)}
                                  aria-label={`Remove ${image.file.name}`}
                                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border border-white/20 bg-[#080d18]/80 text-white backdrop-blur-xl transition-colors hover:bg-red-500"
                                >
                                  <X size={13} />
                                </button>

                                {image.isPrimary && (
                                  <span className="absolute bottom-2 left-2 rounded-full border border-white/20 bg-[#080d18]/80 px-2.5 py-1 text-[9px] font-medium text-white backdrop-blur-xl">
                                    Primary image
                                  </span>
                                )}
                              </div>

                              <div className="space-y-3 p-3">
                                <input
                                  type="text"
                                  value={image.altText}
                                  maxLength={500}
                                  onChange={(event) =>
                                    updateImage(image.id, {
                                      altText: event.target.value,
                                    })
                                  }
                                  placeholder="Image alt text"
                                  className={`${inputClass} h-9 px-3 text-[11px]`}
                                />

                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(image.id)}
                                  disabled={image.isPrimary}
                                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-medium transition-colors ${
                                    image.isPrimary
                                      ? "bg-[#A9C5FF]/10 text-[#A9C5FF]"
                                      : "bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white"
                                  }`}
                                >
                                  {image.isPrimary && <Check size={12} />}

                                  {image.isPrimary
                                    ? "Primary image"
                                    : "Set as primary"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* INSTAGRAM VIDEO */}
                      <Field
                        label="Instagram video URL"
                        hint="Optional. Add the URL of a product demonstration or Instagram Reel."
                      >
                        <input
                          type="url"
                          value={instagramVideoUrl}
                          onChange={(event) => setInstagramVideoUrl(event.target.value)}
                          placeholder="https://www.instagram.com/reel/..."
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    CATEGORIES
                ===================================================== */}

                {section === "categories" && (
                  <div>
                    <SectionHeading
                      eyebrow="04 / Product organization"
                      title="Find its place."
                      description="Assign the product to existing categories or create new categories for your collection."
                    />

                    <div className="space-y-7">

                      {/* EXISTING CATEGORIES */}
                      <div>
                        <p className="mb-4 text-[12px] font-medium text-white/70">
                          Existing categories
                        </p>

                        {loadingOptions ? (
                          <div className="flex items-center gap-2 text-[12px] text-white/40">
                            <LoaderCircle size={15} className="animate-spin" />
                            Loading categories...
                          </div>
                        ) : options.categories.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-[12px] text-white/40">
                            No categories available yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {options.categories.map((category) => {
                              const selected = categoryIds.includes(category.id);

                              return (
                                <button
                                  key={category.id}
                                  type="button"
                                  onClick={() => toggleCategory(category.id)}
                                  className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-all ${
                                    selected
                                      ? "border-[#A9C5FF]/35 bg-[#A9C5FF]/[0.09]"
                                      : "border-white/[0.08] bg-white/[0.025] hover:border-white/20"
                                  }`}
                                >
                                  <span className="text-[12px] text-white/75">
                                    {category.name}
                                  </span>

                                  <span
                                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                                      selected
                                        ? "border-[#A9C5FF] bg-[#A9C5FF] text-[#080d18]"
                                        : "border-white/20"
                                    }`}
                                  >
                                    {selected && <Check size={12} />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* CREATE NEW CATEGORY */}
                      <div className={panelClass}>
                        <p className="mb-4 text-[12px] font-medium text-white/70">
                          Create new category
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={categoryInput}
                            maxLength={100}
                            onChange={(event) => setCategoryInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addCategory();
                              }
                            }}
                            placeholder="Category name"
                            className={inputClass}
                          />

                          <button
                            type="button"
                            onClick={addCategory}
                            disabled={!categoryInput.trim()}
                            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#080d18] transition-colors hover:bg-[#dce8ff] disabled:opacity-40"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {newCategories.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {newCategories.map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center gap-2 rounded-full border border-[#A9C5FF]/20 bg-[#A9C5FF]/[0.08] px-3 py-1.5 text-[11px] text-[#A9C5FF]"
                              >
                                {category}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewCategories((current) =>
                                      current.filter((item) => item !== category),
                                    )
                                  }
                                  aria-label={`Remove ${category}`}
                                  className="hover:text-white"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="mt-4 text-[10px] leading-relaxed text-white/35">
                          New categories will be created when you save the product.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    RATINGS
                ===================================================== */}

                {section === "ratings" && (
                  <div>
                    <SectionHeading
                      eyebrow="05 / Product intelligence"
                      title="Rate your product."
                      description="Evaluate the product across five categories. Each score ranges from 0 to 10."
                    />

                    <div className="space-y-3">
                      {ratingFields.map((field) => {
                        const value = ratings[field.key];

                        return (
                          <div key={field.key} className={panelClass}>
                            <div className="flex items-start justify-between gap-4">

                              <div>
                                <p className="text-[13px] font-medium text-white/85">
                                  {field.label}
                                </p>

                                <p className="mt-1 text-[11px] leading-relaxed text-white/40">
                                  {field.description}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-baseline gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={value}
                                  onChange={(event) =>
                                    updateRating(field.key, event.target.value)
                                  }
                                  placeholder="—"
                                  aria-label={`${field.label} rating`}
                                  className="w-[65px] bg-transparent text-right text-[26px] font-semibold tracking-[-0.05em] text-white outline-none placeholder:text-white/20"
                                />

                                <span className="text-[12px] text-white/30">
                                  /10
                                </span>
                              </div>
                            </div>

                            <div className="mt-5">
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={value === "" ? 0 : Number(value)}
                                onChange={(event) =>
                                  updateRating(field.key, event.target.value)
                                }
                                aria-label={`${field.label} rating slider`}
                                className="h-1.5 w-full cursor-pointer accent-[#A9C5FF]"
                                style={{ accentColor: field.color }}
                              />

                              <div className="mt-2 flex justify-between text-[10px] text-white/25">
                                <span>0</span>
                                <span>5</span>
                                <span>10</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-5 text-[11px] leading-relaxed text-white/35">
                      Leave a rating empty if the product has not been evaluated
                      in that category. An unrated product is different from
                      a product rated 0.
                    </p>
                  </div>
                )}

                {/* =====================================================
                    VARIANTS AND SUPPLIERS
                ===================================================== */}

                {section === "variants" && (
                  <div>
                    <SectionHeading
                      eyebrow="06 / Product configuration"
                      title="Variants & suppliers."
                      description="Configure individual product variations and connect them to your existing suppliers."
                    />

                    <div className="space-y-5">
                      {variants.map((variant, variantIndex) => (
                        <div key={variant.id} className={panelClass}>

                          {/* VARIANT HEADER */}
                          <div className="mb-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex size-9 items-center justify-center rounded-xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10 text-[#A9C5FF]">
                                <Layers3 size={17} />
                              </div>

                              <div>
                                <p className="text-[13px] font-semibold text-white/85">
                                  Variant {variantIndex + 1}
                                </p>

                                <p className="mt-1 text-[10px] text-white/35">
                                  {variant.sku || "New variant"}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              disabled={variants.length === 1}
                              aria-label="Remove variant"
                              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/40 transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-25"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* VARIANT FIELDS */}
                          <div className="grid gap-4 sm:grid-cols-2">

                            <Field label="SKU" required>
                              <input
                                type="text"
                                value={variant.sku}
                                maxLength={100}
                                onChange={(event) =>
                                  updateVariant(variant.id, {
                                    sku: event.target.value,
                                  })
                                }
                                placeholder="QSG-PRODUCT-001"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Variant name">
                              <input
                                type="text"
                                value={variant.name}
                                maxLength={200}
                                onChange={(event) =>
                                  updateVariant(variant.id, {
                                    name: event.target.value,
                                  })
                                }
                                placeholder="Standard"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Size">
                              <input
                                type="text"
                                value={variant.size}
                                maxLength={100}
                                onChange={(event) =>
                                  updateVariant(variant.id, {
                                    size: event.target.value,
                                  })
                                }
                                placeholder="Medium"
                                className={inputClass}
                              />
                            </Field>

                            <Field label="Color">
                              <input
                                type="text"
                                value={variant.color}
                                maxLength={100}
                                onChange={(event) =>
                                  updateVariant(variant.id, {
                                    color: event.target.value,
                                  })
                                }
                                placeholder="Space Black"
                                className={inputClass}
                              />
                            </Field>

                            <Field
                              label="Variant price"
                              hint="Leave empty to use the product's base price."
                            >
                              <input
                                type="number"
                                min="0"
                                max="99999999.99"
                                step="0.01"
                                value={variant.price}
                                onChange={(event) =>
                                  updateVariant(variant.id, {
                                    price: event.target.value,
                                  })
                                }
                                placeholder={price || "Use base price"}
                                className={inputClass}
                              />
                            </Field>
                          </div>

                          <div className="mt-5">
                            <Toggle
                              checked={variant.isActive}
                              onChange={(checked) =>
                                updateVariant(variant.id, {
                                  isActive: checked,
                                })
                              }
                              label="Active variant"
                              description="Allow this variation to be available for purchase."
                            />
                          </div>

                          {/* ADDITIONAL OPTIONS */}
                          <div className="mt-7 border-t border-white/[0.08] pt-6">

                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[12px] font-medium text-white/75">
                                  Additional options
                                </p>

                                <p className="mt-1 text-[10px] text-white/35">
                                  Add custom attributes such as material or capacity.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateVariant(variant.id, {
                                    options: [
                                      ...variant.options,
                                      {
                                        id: createId(),
                                        key: "",
                                        value: "",
                                      },
                                    ],
                                  })
                                }
                                className="flex items-center gap-1.5 text-[11px] font-medium text-[#A9C5FF] hover:text-white"
                              >
                                <Plus size={13} />
                                Add
                              </button>
                            </div>

                            <div className="space-y-2">
                              {variant.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={option.key}
                                    onChange={(event) =>
                                      updateVariantOption(
                                        variant.id,
                                        option.id,
                                        { key: event.target.value },
                                      )
                                    }
                                    placeholder="Attribute"
                                    className={`${inputClass} min-w-0 flex-1`}
                                  />

                                  <input
                                    type="text"
                                    value={option.value}
                                    onChange={(event) =>
                                      updateVariantOption(
                                        variant.id,
                                        option.id,
                                        { value: event.target.value },
                                      )
                                    }
                                    placeholder="Value"
                                    className={`${inputClass} min-w-0 flex-1`}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateVariant(variant.id, {
                                        options: variant.options.filter(
                                          (item) => item.id !== option.id,
                                        ),
                                      })
                                    }
                                    aria-label="Remove option"
                                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white/35 hover:bg-red-400/10 hover:text-red-300"
                                  >
                                    <X size={15} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SUPPLIERS */}
                          <div className="mt-7 border-t border-white/[0.08] pt-6">

                            <div className="mb-5 flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Truck size={15} className="text-[#86E0C1]" />

                                  <p className="text-[12px] font-semibold text-white/80">
                                    Suppliers
                                  </p>
                                </div>

                                <p className="mt-2 text-[10px] text-white/35">
                                  Configure purchasing costs and inventory for this variant.
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  updateVariant(variant.id, {
                                    suppliers: [
                                      ...variant.suppliers,
                                      createSupplier(),
                                    ],
                                  })
                                }
                                disabled={loadingOptions || options.suppliers.length === 0}
                                className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#86E0C1]/20 bg-[#86E0C1]/[0.06] px-3 py-2 text-[10px] font-medium text-[#86E0C1] hover:bg-[#86E0C1]/10 disabled:opacity-40"
                              >
                                <Plus size={13} />
                                Add supplier
                              </button>
                            </div>

                            {options.suppliers.length === 0 && !loadingOptions && (
                              <p className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 text-[11px] leading-relaxed text-white/40">
                                No active suppliers are available. You can
                                create the product now and connect suppliers later.
                              </p>
                            )}

                            <div className="space-y-4">
                              {variant.suppliers.map((supplier) => (
                                <div
                                  key={supplier.id}
                                  className="rounded-[18px] border border-white/[0.08] bg-[#080d18]/45 p-4"
                                >

                                  <div className="mb-4 flex items-center justify-between gap-3">
                                    <p className="text-[11px] font-medium text-white/65">
                                      Supplier configuration
                                    </p>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSupplier(variant.id, supplier.id)
                                      }
                                      aria-label="Remove supplier"
                                      className="text-white/35 hover:text-red-300"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-2">

                                    <Field label="Supplier" required>
                                      <select
                                        value={supplier.supplierId}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { supplierId: event.target.value },
                                          )
                                        }
                                        className={`${inputClass} bg-[#131d30]`}
                                      >
                                        <option value="">Select supplier</option>

                                        {options.suppliers.map((item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.name}
                                          </option>
                                        ))}
                                      </select>
                                    </Field>

                                    <Field label="Supplier SKU" required>
                                      <input
                                        type="text"
                                        value={supplier.supplierSku}
                                        maxLength={100}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { supplierSku: event.target.value },
                                          )
                                        }
                                        placeholder="SUPPLIER-SKU"
                                        className={inputClass}
                                      />
                                    </Field>

                                    <Field label="Supplier product ID">
                                      <input
                                        type="text"
                                        value={supplier.supplierProductId}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { supplierProductId: event.target.value },
                                          )
                                        }
                                        placeholder="External product ID"
                                        className={inputClass}
                                      />
                                    </Field>

                                    <Field label="Purchase cost" required>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={supplier.cost}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { cost: event.target.value },
                                          )
                                        }
                                        placeholder="0.00"
                                        className={inputClass}
                                      />
                                    </Field>

                                    <Field label="Cost currency">
                                      <select
                                        value={supplier.currency}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { currency: event.target.value },
                                          )
                                        }
                                        className={`${inputClass} bg-[#131d30]`}
                                      >
                                        {currencies.map((code) => (
                                          <option key={code} value={code}>
                                            {code}
                                          </option>
                                        ))}
                                      </select>
                                    </Field>

                                    <Field label="Stock quantity">
                                      <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={supplier.stockQuantity}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { stockQuantity: event.target.value },
                                          )
                                        }
                                        className={inputClass}
                                      />
                                    </Field>

                                    <Field label="Estimated shipping days">
                                      <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={supplier.estimatedShippingDays}
                                        onChange={(event) =>
                                          updateSupplier(
                                            variant.id,
                                            supplier.id,
                                            { estimatedShippingDays: event.target.value },
                                          )
                                        }
                                        placeholder="e.g. 7"
                                        className={inputClass}
                                      />
                                    </Field>
                                  </div>

                                  <div className="mt-5 space-y-2">
                                    <Toggle
                                      checked={supplier.isActive}
                                      onChange={(checked) =>
                                        updateSupplier(
                                          variant.id,
                                          supplier.id,
                                          { isActive: checked },
                                        )
                                      }
                                      label="Active supplier listing"
                                    />

                                    <Toggle
                                      checked={supplier.isAvailable}
                                      onChange={(checked) =>
                                        updateSupplier(
                                          variant.id,
                                          supplier.id,
                                          { isAvailable: checked },
                                        )
                                      }
                                      label="Available for fulfillment"
                                      description="Indicates whether this supplier can currently fulfill this variant."
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* ADD VARIANT */}
                      <button
                        type="button"
                        onClick={() =>
                          setVariants((current) => [...current, createVariant()])
                        }
                        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#A9C5FF]/25 bg-[#A9C5FF]/[0.035] text-[12px] font-medium text-[#A9C5FF] transition-all hover:border-[#A9C5FF]/45 hover:bg-[#A9C5FF]/[0.07]"
                      >
                        <Plus size={17} />
                        Add another variant
                      </button>
                    </div>
                  </div>
                )}

                {/* =====================================================
                    PUBLISHING
                ===================================================== */}

                {section === "publishing" && (
                  <div>
                    <SectionHeading
                      eyebrow="07 / Publishing"
                      title="Ready to launch?"
                      description="Review your product information and choose whether to publish it immediately or save it as a draft."
                    />

                    <div className="space-y-5">

                      <div className={panelClass}>
                        <div className="mb-6 flex items-center gap-4">
                          <div className="flex size-12 items-center justify-center rounded-2xl border border-[#A9C5FF]/15 bg-[#A9C5FF]/10">
                            <Package size={22} className="text-[#A9C5FF]" />
                          </div>

                          <div>
                            <p className="text-[14px] font-semibold text-white/90">
                              {name || "Your new product"}
                            </p>

                            <p className="mt-1 text-[11px] text-white/40">
                              {price === "" ? "Price not set" : `${currency} ${price}`}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            { label: "Images", value: images.length },
                            { label: "Categories", value: categoryIds.length + newCategories.length },
                            { label: "Variants", value: variants.length },
                            {
                              label: "Suppliers",
                              value: variants.reduce(
                                (total, variant) => total + variant.suppliers.length,
                                0,
                              ),
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-3"
                            >
                              <p className="text-[10px] text-white/35">
                                {item.label}
                              </p>

                              <p className="mt-2 text-[20px] font-semibold text-white">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Toggle
                        checked={isActive}
                        onChange={setIsActive}
                        label="Publish product"
                        description={
                          isActive
                            ? "The product will be marked as active when created."
                            : "The product will be saved as an inactive draft."
                        }
                      />

                      <div className="rounded-[18px] border border-[#A9C5FF]/15 bg-[#A9C5FF]/[0.05] p-5">
                        <div className="flex items-start gap-3">
                          <Sparkles size={17} className="mt-0.5 shrink-0 text-[#A9C5FF]" />

                          <div>
                            <p className="text-[12px] font-medium text-white/80">
                              {isActive ? "Ready to publish" : "Save your progress"}
                            </p>

                            <p className="mt-2 text-[11px] leading-relaxed text-white/45">
                              {isActive
                                ? "Your product will be created with its images, categories, variants, and supplier information."
                                : "Your product will be saved as a draft. You can complete its remaining information before making it available to customers."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-[#0b1220]/90 px-5 py-4 backdrop-blur-xl sm:px-8">

            <div className="flex items-center gap-3">
              <span className="hidden text-[11px] text-white/35 sm:block">
                Step {currentSectionIndex + 1} of {sections.length}
              </span>

              <div className="flex items-center gap-1">
                {sections.map((item) => (
                  <span
                    key={item.id}
                    className={`h-1 rounded-full transition-all ${
                      item.id === section
                        ? "w-5 bg-[#A9C5FF]"
                        : "w-1.5 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => {
                  if (currentSectionIndex === 0) {
                    handleClose();
                  } else {
                    navigateTo(sections[currentSectionIndex - 1].id);
                  }
                }}
                disabled={saving}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-[11px] font-medium text-white/65 transition-colors hover:bg-white/[0.10] hover:text-white disabled:opacity-40"
              >
                <ArrowLeft size={14} />

                {currentSectionIndex === 0 ? "Cancel" : "Back"}
              </button>

              {nextSection && (
                <button
                  type="button"
                  onClick={() => navigateTo(nextSection.id)}
                  disabled={saving}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.09] px-4 text-[11px] font-medium text-white transition-colors hover:bg-white/[0.15] disabled:opacity-40"
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-[11px] font-semibold text-[#080d18] transition-all hover:bg-[#dce8ff] disabled:cursor-wait disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Create product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}