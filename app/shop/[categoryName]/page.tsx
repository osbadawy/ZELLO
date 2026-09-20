import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma/prisma";

import CategoryProductsClient from "@/components/shop/CategoryProductsClient";

type PageProps = {
  params: Promise<{
    categoryName: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoryName } = await params;

  const category =
    await prisma.category.findUnique({
      where: {
        slug: categoryName,
        isActive: true,
      },

      select: {
        name: true,
        description: true,
      },
    });

  if (!category) {
    return {
      title: "Category Not Found | Penta Labs",
    };
  }

  return {
    title: `${category.name} | Penta Labs`,

    description:
      category.description ??
      `Explore the ${category.name} collection at Penta Labs.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { categoryName } = await params;

  // Retrieve the selected category and its products.

  const category =
    await prisma.category.findUnique({
      where: {
        slug: categoryName,
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        description: true,

        products: {
          where: {
            isActive: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            shortDescription: true,
            price: true,
            currency: true,

            images: {
              select: {
                id: true,
              },

              orderBy: [
                {
                  isPrimary: "desc",
                },
                {
                  sortOrder: "asc",
                },
              ],

              take: 1,
            },
          },
        },
      },
    });

  if (!category) {
    notFound();
  }

  // Retrieve all active categories for navigation.

  const categories =
    await prisma.category.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },

      orderBy: {
        name: "asc",
      },
    });

  // Convert Prisma Decimal fields into serializable values.
  // Product image binaries are deliberately excluded.

  const products = category.products.map(
    (product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,

      description:
        product.shortDescription ??
        product.description,

      price: product.price.toString(),
      currency: product.currency,

      imageId:
        product.images[0]?.id ?? null,
    }),
  );

  return (
    <div className="min-h-screen bg-[#f3f5f7] py-6 sm:py-10">
      <CategoryProductsClient
        category={{
          id: category.id,
          name: category.name,
          slug: category.slug,
        }}
        categories={categories}
        products={products}
      />
    </div>
  );
}