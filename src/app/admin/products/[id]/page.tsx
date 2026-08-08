"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/adminAuth";
import { Product } from "@/types";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<Product>(`/api/products/${params.id}`)
      .then(setProduct)
      .catch(() => setError("Product not found"));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Product</h1>
      <ProductForm mode="edit" initial={product} />
    </div>
  );
}