import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import ProductsPageClient from "@/components/dashboard/products/ProductsPageClient";

export default async function ProductsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  const role = String(session.user.role ?? "").trim().toLowerCase();

  if (role !== "admin") notFound();

  return <ProductsPageClient />;
}