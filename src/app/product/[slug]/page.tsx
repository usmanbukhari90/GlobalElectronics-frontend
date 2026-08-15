export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProductBySlug, getReviews } from "@/lib/api";
import ReviewSection from "@/components/products/ReviewSection";
import ProductPurchase from "@/components/products/ProductPurchase";
import ProductGallery from "@/components/products/ProductGallery";
import ScrollReveal from "@/components/common/ScrollReveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  let reviews: import("@/types").Review[] = [];
  try {
    reviews = await getReviews(product.id);
  } catch {
    reviews = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <p className="text-xs text-muted mb-4">
        HOME &gt; SHOP &gt; {product.category.toUpperCase()} &gt; {product.name}
      </p>

      <ScrollReveal>
        <div className="grid gap-8 md:grid-cols-2">
          <ProductGallery images={product.images?.length ? product.images : [product.image]} name={product.name} />

          <div>
            <p className="text-sm text-muted uppercase tracking-wide">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-bold text-navy md:text-3xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-accent-yellow text-accent-yellow"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="text-sm text-muted">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <ProductPurchase product={product} />

            <div className="mt-8">
              <h3 className="font-semibold text-navy mb-3">Specifications</h3>
              <dl className="text-sm divide-y divide-border border-t border-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2.5">
                    <dt className="text-muted">{key}</dt>
                    <dd className="font-medium text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <ReviewSection
          productId={product.id}
          initialReviews={reviews}
          productRating={product.rating}
          reviewCount={product.reviewCount}
        />
      </ScrollReveal>
    </div>
  );
}