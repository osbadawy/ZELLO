import CategoryProductsClient from "@/components/categories/CategoryProductsClient";

type Props = {
  params: Promise<{
    categoryName: string;
  }>;
};

export default async function CategoryProductsPage({ params }: Props) {
  const { categoryName } = await params;

  return (
    <CategoryProductsClient
      key={categoryName}
      categoryName={categoryName}
    />
  );
}