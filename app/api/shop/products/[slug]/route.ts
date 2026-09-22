import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        currency: true,
        instagramVideoUrl: true,
        overallRating: true,
        dailyUseRating: true,
        reliabilityRating: true,
        qualityRating: true,
        recommendRating: true,
        createdAt: true,

        categories: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          orderBy: [
            { isPrimary: "desc" },
            { sortOrder: "asc" },
          ],
          select: {
            id: true,
            altText: true,
            isPrimary: true,
          },
        },

        variants: {
          where: { isActive: true },
          orderBy: { sku: "asc" },
          select: {
            id: true,
            sku: true,
            name: true,
            size: true,
            color: true,
            price: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    const images = product.images.map((image) => ({
      id: image.id,
      altText: image.altText,
      isPrimary: image.isPrimary,
      url: `/api/shop/images/${image.id}`,
    }));

    return NextResponse.json(
      {
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: Number(product.price),
          currency: product.currency,
          instagramVideoUrl: product.instagramVideoUrl,

          overallRating:
            product.overallRating === null
              ? null
              : Number(product.overallRating),

          dailyUseRating:
            product.dailyUseRating === null
              ? null
              : Number(product.dailyUseRating),

          reliabilityRating:
            product.reliabilityRating === null
              ? null
              : Number(product.reliabilityRating),

          qualityRating:
            product.qualityRating === null
              ? null
              : Number(product.qualityRating),

          recommendRating:
            product.recommendRating === null
              ? null
              : Number(product.recommendRating),

          categories: product.categories,

          image: images[0]
            ? {
                id: images[0].id,
                altText: images[0].altText,
                url: images[0].url,
              }
            : null,

          images,

          variants: product.variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            name: variant.name,
            size: variant.size,
            color: variant.color,
            price: variant.price === null ? null : Number(variant.price),
          })),

          createdAt: product.createdAt.toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Product details error:", error);

    return NextResponse.json(
      { error: "Unable to load product details." },
      { status: 500 },
    );
  }
}