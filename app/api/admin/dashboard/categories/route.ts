import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const role = String(session.user.role ?? "").trim().toLowerCase();

  if (role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { error: null };
}

/* ============================================================
   GET — ALL CATEGORIES
============================================================ */

export async function GET(request: Request) {
  try {
    const { error } = await requireAdmin(request);

    if (error) return error;

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            products: true,
          },
        },
      },

      orderBy: {
        name: "asc",
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,

      productCount: category._count.products,

      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));

    const activeCategories = categories.filter(
      (category) => category.isActive,
    ).length;

    const categoriesWithProducts = categories.filter(
      (category) => category._count.products > 0,
    ).length;

    return NextResponse.json(
      {
        categories: formattedCategories,

        summary: {
          totalCategories: categories.length,
          activeCategories,
          inactiveCategories: categories.length - activeCategories,
          categoriesWithProducts,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve categories." },
      { status: 500 },
    );
  }
}

/* ============================================================
   POST — CREATE CATEGORY
============================================================ */

export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin(request);

    if (error) return error;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid category information." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;

    /* VALIDATE NAME */

    if (
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.trim().length > 100
    ) {
      return NextResponse.json(
        { error: "Enter a valid category name (maximum 100 characters)." },
        { status: 400 },
      );
    }

    const name = input.name.trim();

    /* VALIDATE SLUG */

    if (input.slug !== undefined && typeof input.slug !== "string") {
      return NextResponse.json(
        { error: "Invalid category slug." },
        { status: 400 },
      );
    }

    const slug = slugify(
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug
        : name,
    );

    if (!slug || slug.length > 200) {
      return NextResponse.json(
        { error: "Enter a valid category slug." },
        { status: 400 },
      );
    }

    /* VALIDATE DESCRIPTION */

    if (
      input.description !== undefined &&
      input.description !== null &&
      typeof input.description !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid category description." },
        { status: 400 },
      );
    }

    const description =
      typeof input.description === "string"
        ? input.description.trim() || null
        : null;

    if (description && description.length > 2000) {
      return NextResponse.json(
        { error: "Category description cannot exceed 2000 characters." },
        { status: 400 },
      );
    }

    /* VALIDATE STATUS */

    if (
      input.isActive !== undefined &&
      typeof input.isActive !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid category status." },
        { status: 400 },
      );
    }

    const isActive =
      typeof input.isActive === "boolean"
        ? input.isActive
        : true;

    /* CHECK EXISTING CATEGORY */

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 },
      );
    }

    /* CREATE CATEGORY */

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isActive,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Category created successfully.",

        category: {
          ...category,
          productCount: 0,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A category with this slug already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to create category." },
      { status: 500 },
    );
  }
}