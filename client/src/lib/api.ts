import { ProductResponse } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface GetProductsParams {
  category?: string;
  cursor?: string | null;
  limit?: number;
}

export async function getProducts({
  category,
  cursor,
  limit = 20,
}: GetProductsParams): Promise<ProductResponse> {
  const params = new URLSearchParams();

  params.set("limit", limit.toString());

  if (category) params.set("category", category);
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${API_URL}/api/products?${params}`);

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}
