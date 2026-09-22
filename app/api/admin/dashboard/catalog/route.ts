import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noAvailableSupplierStock = {
  variants: {
    none: {
      isActive: true,
      supplierProducts: {
        some: {
          isActive: true,
          isAvailable: true,
          stockQuantity: { gt: 0 },
          supplier: {
            isActive: true,
          },
        },
      },
    },
  },
} as const;

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string | null }).role;

    if (role?.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalActiveProducts,
      missingImages,
      missingVariants,
      missingRatings,
      missingCategories,
      unavailableStock,
      products,
    ] = await Promise.all([
      prisma.product.count({
        where: { isActive: true },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          images: { none: {} },
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          variants: { none: {} },
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          overallRating: null,
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          categories: { none: {} },
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
          ...noAvailableSupplierStock,
        },
      }),

      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { images: { none: {} } },
            { variants: { none: {} } },
            { overallRating: null },
            { categories: { none: {} } },
            noAvailableSupplierStock,
          ],
        },

        select: {
          id: true,
          name: true,
          slug: true,
          overallRating: true,

          _count: {
            select: {
              images: true,
              variants: true,
              categories: true,
            },
          },

          variants: {
            where: { isActive: true },

            select: {
              supplierProducts: {
                where: {
                  isActive: true,
                  isAvailable: true,
                  stockQuantity: { gt: 0 },
                  supplier: {
                    isActive: true,
                  },
                },

                select: {
                  id: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 6,
      }),
    ]);

    const productsNeedingAttention = products.map((product) => {
      const issues: string[] = [];

      if (product._count.images === 0) {
        issues.push("Missing images");
      }

      if (product._count.variants === 0) {
        issues.push("Missing variants");
      }

      if (product.overallRating === null) {
        issues.push("Unrated");
      }

      if (product._count.categories === 0) {
        issues.push("Missing categories");
      }

      const hasAvailableSupplierStock = product.variants.some(
        (variant) => variant.supplierProducts.length > 0,
      );

      if (!hasAvailableSupplierStock) {
        issues.push("No available supplier stock");
      }

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        issues,
      };
    });

    return NextResponse.json(
      {
        totalActiveProducts,
        missingImages,
        missingVariants,
        missingRatings,
        missingCategories,
        unavailableStock,
        productsNeedingAttention,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Catalog health error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve catalog health." },
      { status: 500 },
    );
  }
}