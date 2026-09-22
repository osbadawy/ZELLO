import ProductDetailsClient from "@/components/product/ProductDetailsClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return <ProductDetailsClient slug={slug} />;
}