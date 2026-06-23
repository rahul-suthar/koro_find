"use client";

import { useEffect, useState } from "react";

import { Product } from "@/types/product";
import { getProducts } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadProducts(reset = false, cursor?: string | null) {
    setLoading(true);

    try {
      const data = await getProducts({
        category,
        cursor
      });

      if (reset) setProducts(data.products);
      else {
        setProducts((prev) => [...prev, ...data.products])
      }

      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadProducts(true);
  }, [category]);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Product Browser
      </h1>

      <select value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-6"
      >
        <option value="">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Gaming">Gaming</option>
        <option value="Fashion">Fashion</option>
        <option value="Sports">Sports</option>
      </select>

      <div className="grid gap-4 grid-cols-3">
        {products.map(prd => (
          <div key={prd.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{prd.name}</h2>

            <p>{prd.category}</p>
            <p>₹ {prd.price}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => loadProducts(false, nextCursor)}
          disabled={loading}
          className="mt-6 border px-4 py-2 rounded"
        >
          {loading ? "loading..." : "Load More"}
        </button>
      )}
    </main>
  )


}
