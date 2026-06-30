/**
 * Mock API using axios.
 * In production, swap the try/catch fallback for a real endpoint:
 *   return (await api.get<Product[]>('/products')).data
 */
import axios, { type AxiosInstance } from "axios";
import type { Product } from "../../src/lib";
import { sampleProducts } from "../data/sampleProducts";

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  perPage: number;
}

/** Simulates network latency so the loading skeleton is visible */
function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function fetchProducts(): Promise<ProductsResponse> {
  await delay(750);                         // realistic round-trip
  try {
    // Will 404 in dev → caught below → returns mock data
    const res = await api.get<ProductsResponse>("/products");
    const list = Array.isArray(res.data?.data) ? res.data.data : [];
    if (list.length > 0) {
      return { ...res.data, data: list, total: list.length };
    }
  } catch {
    // fall through to local sample data
  }
  return {
    data: sampleProducts,
    total: sampleProducts.length,
    page: 1,
    perPage: sampleProducts.length,
  };
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await delay(300);
  try {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  } catch {
    return sampleProducts.find((p) => p.id === id);
  }
}
