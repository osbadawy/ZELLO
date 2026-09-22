import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ imageId: string }>;
};

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function GET(_request: Request, { params }: Props) {
  try {
    const { imageId } = await params;

    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
      select: {
        data: true,
        contentType: true,
        product: {
          select: { isActive: true },
        },
      },
    });

    if (
      !image ||
      !image.product.isActive ||
      !allowedImageTypes.has(image.contentType)
    ) {
      return new NextResponse(null, { status: 404 });
    }

    const bytes = Uint8Array.from(image.data);

    return new Response(bytes.buffer, {
      status: 200,
      headers: {
        "Content-Type": image.contentType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Shop image error:", error);

    return new NextResponse(null, { status: 500 });
  }
}