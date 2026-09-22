import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_IMAGE_SIZE = 24 * 1024 * 1024;
const MAX_IMAGES = 8;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type Rating = number | null;

type ProductSupplierInput = {
  supplierId: string;
  supplierSku: string;
  supplierProductId: string | null;
  cost: number;
  currency: string;
  stockQuantity: number;
  isAvailable: boolean;
  isActive: boolean;
  estimatedShippingDays: number | null;
};

type ProductVariantInput = {
  sku: string;
  name: string | null;
  size: string | null;
  color: string | null;
  options: Record<string, string> | null;
  price: number | null;
  isActive: boolean;
  suppliers: ProductSupplierInput[];
};

type ProductImageInput = {
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
};

type ProductInput = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;

  price: number;
  currency: string;

  instagramVideoUrl: string | null;

  dailyUseRating: Rating;
  reliabilityRating: Rating;
  qualityRating: Rating;
  recommendRating: Rating;
  overallRating: Rating;

  isActive: boolean;

  categoryIds: string[];
  newCategories: string[];

  images: ProductImageInput[];
  variants: ProductVariantInput[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isOptionalString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 99999999.99 &&
    Math.round(value * 100) === value * 100
  );
}

function isRating(value: unknown): value is Rating {
  return (
    value === null ||
    (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value <= 10 &&
      Math.round(value * 10) === value * 10
    )
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function isCurrency(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{3}$/.test(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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

function validateProduct(value: unknown): asserts value is ProductInput {
  if (!isRecord(value)) {
    throw new Error("Invalid product information.");
  }

  if (
    !isString(value.name) ||
    !value.name.trim() ||
    value.name.length > 200
  ) {
    throw new Error("Enter a valid product name.");
  }

  if (
    !isString(value.slug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) ||
    value.slug.length > 200
  ) {
    throw new Error("Enter a valid product slug.");
  }

  if (
    !isString(value.description) ||
    !value.description.trim() ||
    value.description.length > 20000
  ) {
    throw new Error("Enter a valid product description.");
  }

  if (
    !isOptionalString(value.shortDescription) ||
    (value.shortDescription?.length ?? 0) > 2000
  ) {
    throw new Error("Invalid short description.");
  }

  if (!isMoney(value.price)) {
    throw new Error("Enter a valid product price.");
  }

  if (!isCurrency(value.currency)) {
    throw new Error("Enter a valid three-letter currency code.");
  }

  if (
    !isOptionalString(value.instagramVideoUrl) ||
    (
      value.instagramVideoUrl !== null &&
      (
        value.instagramVideoUrl.length > 2000 ||
        !isHttpUrl(value.instagramVideoUrl)
      )
    )
  ) {
    throw new Error("Enter a valid Instagram video URL.");
  }

  const ratingFields = [
    "dailyUseRating",
    "reliabilityRating",
    "qualityRating",
    "recommendRating",
    "overallRating",
  ] as const;

  for (const field of ratingFields) {
    if (!isRating(value[field])) {
      throw new Error(`${field} must be between 0 and 10.`);
    }
  }

  if (typeof value.isActive !== "boolean") {
    throw new Error("Invalid publishing status.");
  }

  if (
    !Array.isArray(value.categoryIds) ||
    value.categoryIds.length > 30 ||
    !value.categoryIds.every((id) => isString(id) && id.length > 0)
  ) {
    throw new Error("Invalid product categories.");
  }

  if (
    !Array.isArray(value.newCategories) ||
    value.newCategories.length > 20 ||
    !value.newCategories.every(
      (name) => isString(name) && name.trim().length > 0 && name.length <= 100,
    )
  ) {
    throw new Error("Invalid new categories.");
  }

  if (
    !Array.isArray(value.images) ||
    value.images.length > MAX_IMAGES
  ) {
    throw new Error("Too many product images.");
  }

  let primaryImageCount = 0;

  for (const image of value.images) {
    if (
      !isRecord(image) ||
      !isString(image.altText) ||
      image.altText.length > 500 ||
      typeof image.isPrimary !== "boolean" ||
      !isNonNegativeInteger(image.sortOrder)
    ) {
      throw new Error("Invalid product image information.");
    }

    if (image.isPrimary) primaryImageCount++;
  }

  if (value.images.length > 0 && primaryImageCount !== 1) {
    throw new Error("Select exactly one primary image.");
  }

  if (
    !Array.isArray(value.variants) ||
    value.variants.length === 0 ||
    value.variants.length > 50
  ) {
    throw new Error("Add at least one product variant.");
  }

  const usedSkus = new Set<string>();
  const usedSupplierSkus = new Set<string>();

  for (const variant of value.variants) {
    if (!isRecord(variant)) {
      throw new Error("Invalid product variant.");
    }

    if (
      !isString(variant.sku) ||
      !variant.sku.trim() ||
      variant.sku.length > 100
    ) {
      throw new Error("Every variant requires a valid SKU.");
    }

    const normalizedSku = variant.sku.trim();

    if (usedSkus.has(normalizedSku)) {
      throw new Error(`Duplicate variant SKU: ${normalizedSku}`);
    }

    usedSkus.add(normalizedSku);

    if (
      !isOptionalString(variant.name) ||
      !isOptionalString(variant.size) ||
      !isOptionalString(variant.color)
    ) {
      throw new Error("Invalid variant information.");
    }

    if (
      (variant.name?.length ?? 0) > 200 ||
      (variant.size?.length ?? 0) > 100 ||
      (variant.color?.length ?? 0) > 100
    ) {
      throw new Error("Variant information is too long.");
    }

    if (
      variant.price !== null &&
      !isMoney(variant.price)
    ) {
      throw new Error(`Invalid price for variant ${normalizedSku}.`);
    }

    if (typeof variant.isActive !== "boolean") {
      throw new Error("Invalid variant status.");
    }

    if (
      variant.options !== null &&
      (
        !isRecord(variant.options) ||
        Object.keys(variant.options).length > 30 ||
        !Object.entries(variant.options).every(
          ([key, option]) =>
            key.length > 0 &&
            key.length <= 100 &&
            isString(option) &&
            option.length <= 500,
        )
      )
    ) {
      throw new Error("Invalid variant options.");
    }

    if (
      !Array.isArray(variant.suppliers) ||
      variant.suppliers.length > 20
    ) {
      throw new Error("Invalid variant suppliers.");
    }

    const variantSupplierIds = new Set<string>();

    for (const supplier of variant.suppliers) {
      if (!isRecord(supplier)) {
        throw new Error("Invalid supplier information.");
      }

      if (
        !isString(supplier.supplierId) ||
        !supplier.supplierId.trim() ||
        !isString(supplier.supplierSku) ||
        !supplier.supplierSku.trim() ||
        supplier.supplierSku.length > 100 ||
        !isOptionalString(supplier.supplierProductId) ||
        !isMoney(supplier.cost) ||
        !isCurrency(supplier.currency) ||
        !isNonNegativeInteger(supplier.stockQuantity) ||
        typeof supplier.isAvailable !== "boolean" ||
        typeof supplier.isActive !== "boolean" ||
        (
          supplier.estimatedShippingDays !== null &&
          !isNonNegativeInteger(supplier.estimatedShippingDays)
        )
      ) {
        throw new Error("Invalid supplier product information.");
      }

      if (variantSupplierIds.has(supplier.supplierId)) {
        throw new Error("A supplier can only be assigned once per variant.");
      }

      variantSupplierIds.add(supplier.supplierId);

      const supplierSkuKey = `${supplier.supplierId}:${supplier.supplierSku.trim()}`;

      if (usedSupplierSkus.has(supplierSkuKey)) {
        throw new Error("Duplicate supplier SKU for the same supplier.");
      }

      usedSupplierSkus.add(supplierSkuKey);
    }
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const role = String(session.user.role ?? "").trim().toLowerCase();

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // READ MULTIPART DATA
    const formData = await request.formData();

    const rawProduct = formData.get("product");

    if (typeof rawProduct !== "string") {
      return NextResponse.json(
        { error: "Missing product information." },
        { status: 400 },
      );
    }

    let productInput: unknown;

    try {
      productInput = JSON.parse(rawProduct);
    } catch {
      return NextResponse.json(
        { error: "Invalid product JSON." },
        { status: 400 },
      );
    }

    try {
      validateProduct(productInput);
    } catch (error) {
      return NextResponse.json(
        {
          error: error instanceof Error
            ? error.message
            : "Invalid product information.",
        },
        { status: 400 },
      );
    }

    const input = productInput;

    // VALIDATE IMAGE UPLOADS
    const imageFiles = formData.getAll("images");

    if (imageFiles.length !== input.images.length) {
      return NextResponse.json(
        { error: "Image information does not match uploaded files." },
        { status: 400 },
      );
    }

    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} images allowed.` },
        { status: 400 },
      );
    }

    let totalImageSize = 0;

    for (const image of imageFiles) {
      if (!(image instanceof File)) {
        return NextResponse.json(
          { error: "Invalid image upload." },
          { status: 400 },
        );
      }

      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          { error: "Only JPEG, PNG, and WebP images are supported." },
          { status: 400 },
        );
      }

      if (image.size === 0 || image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Each image must be smaller than 5 MB." },
          { status: 400 },
        );
      }

      totalImageSize += image.size;
    }

    if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "The combined image size cannot exceed 24 MB." },
        { status: 400 },
      );
    }

    // VALIDATE EXISTING RELATIONS
    const uniqueCategoryIds = [...new Set(input.categoryIds)];

    const supplierIds = [
      ...new Set(
        input.variants.flatMap((variant) =>
          variant.suppliers.map((supplier) => supplier.supplierId),
        ),
      ),
    ];

    const [existingCategories, existingSuppliers] = await Promise.all([
      prisma.category.findMany({
        where: {
          id: { in: uniqueCategoryIds },
          isActive: true,
        },
        select: { id: true },
      }),

      prisma.supplier.findMany({
        where: {
          id: { in: supplierIds },
          isActive: true,
        },
        select: { id: true },
      }),
    ]);

    if (existingCategories.length !== uniqueCategoryIds.length) {
      return NextResponse.json(
        { error: "One or more selected categories are unavailable." },
        { status: 400 },
      );
    }

    if (existingSuppliers.length !== supplierIds.length) {
      return NextResponse.json(
        { error: "One or more selected suppliers are unavailable." },
        { status: 400 },
      );
    }

    // PREPARE IMAGE BYTES
    const images = await Promise.all(
      imageFiles.map(async (image, index) => {
        const file = image as File;
        const metadata = input.images[index];

        return {
          fileName: file.name,
          contentType: file.type,
          sizeBytes: file.size,
          data: new Uint8Array(await file.arrayBuffer()),
          altText: metadata.altText.trim() || null,
          isPrimary: metadata.isPrimary,
          sortOrder: metadata.sortOrder,
        };
      }),
    );

    // PREPARE NEW CATEGORIES
    const newCategories = [
      ...new Map(
        input.newCategories
          .map((name) => ({
            name: name.trim(),
            slug: slugify(name),
          }))
          .filter((category) => category.slug.length > 0)
          .map((category) => [category.slug, category]),
      ).values(),
    ];

    if (newCategories.length !== input.newCategories
      .map(slugify)
      .filter(Boolean)
      .filter((slug, index, all) => all.indexOf(slug) === index).length
    ) {
      return NextResponse.json(
        { error: "Invalid category name." },
        { status: 400 },
      );
    }

    // CREATE PRODUCT AND ALL RELATED DATA
    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: input.name.trim(),
          slug: input.slug.trim(),
          description: input.description.trim(),
          shortDescription: input.shortDescription?.trim() || null,

          price: input.price,
          currency: input.currency,

          instagramVideoUrl: input.instagramVideoUrl?.trim() || null,

          dailyUseRating: input.dailyUseRating,
          reliabilityRating: input.reliabilityRating,
          qualityRating: input.qualityRating,
          recommendRating: input.recommendRating,
          overallRating: input.overallRating,

          isActive: input.isActive,

          categories: {
            connect: uniqueCategoryIds.map((id) => ({ id })),

            connectOrCreate: newCategories.map((category) => ({
              where: { slug: category.slug },
              create: {
                name: category.name,
                slug: category.slug,
                isActive: true,
              },
            })),
          },

          images: {
            create: images,
          },

          variants: {
            create: input.variants.map((variant) => ({
              sku: variant.sku.trim(),
              name: variant.name?.trim() || null,
              size: variant.size?.trim() || null,
              color: variant.color?.trim() || null,

              options: variant.options ?? undefined,

              price: variant.price,
              isActive: variant.isActive,

              supplierProducts: {
                create: variant.suppliers.map((supplier) => ({
                  supplier: {
                    connect: { id: supplier.supplierId },
                  },

                  supplierSku: supplier.supplierSku.trim(),
                  supplierProductId: supplier.supplierProductId?.trim() || null,

                  cost: supplier.cost,
                  currency: supplier.currency,

                  stockQuantity: supplier.stockQuantity,
                  isAvailable: supplier.isAvailable,
                  isActive: supplier.isActive,

                  estimatedShippingDays: supplier.estimatedShippingDays,
                })),
              },
            })),
          },
        },

        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Create product error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "This product slug, variant SKU, or supplier SKU already exists.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to create product." },
      { status: 500 },
    );
  }
}