import { Product, Review, Order, CategoryInfo, BrandInfo, HeroBanner, AnnouncementMessage } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: options?.method ? undefined : { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
export async function getProducts(params?: {
  category?: string;
  brand?: string;
  q?: string;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.brand) search.set("brand", params.brand);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return fetchApi(`/api/products${qs ? `?${qs}` : ""}`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return fetchApi(`/api/products/slug/${slug}`);
}

export async function getCategories(): Promise<CategoryInfo[]> {
  return fetchApi("/api/products/categories");
}

export async function getBrands(): Promise<BrandInfo[]> {
  return fetchApi("/api/products/brands");
}

export async function getDailyHighlights(): Promise<Product[]> {
  return fetchApi("/api/products/highlights");
}

export async function getReviews(productId?: string): Promise<Review[]> {
  const qs = productId ? `?productId=${productId}` : "";
  return fetchApi(`/api/reviews${qs}`);
}

export async function submitReview(data: {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  return fetchApi("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createOrder(data: {
  items: Order["items"];
  customer: Order["customer"];
  subtotal: number;
  total: number;
}): Promise<Order> {
  return fetchApi("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getOrder(id: string): Promise<Order> {
  return fetchApi(`/api/orders/${id}`);
}

export { API_URL };

export async function getPopularPicks(): Promise<{ items: Product[]; banner: Product | null }> {
  return fetchApi("/api/products/popular-picks");
}

export async function getBigSavings(): Promise<Product[]> {
  return fetchApi("/api/products/big-savings");
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  return fetchApi("/api/hero-banners");
}

export async function getAnnouncements(): Promise<AnnouncementMessage[]> {
  return fetchApi("/api/announcements");
}