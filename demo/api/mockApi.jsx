/**
 * Mock API using axios.
 * In production, swap the try/catch fallback for a real endpoint:
 *   return (await api.get('/products')).data
 */
import axios from "axios";
import { sampleProducts } from "../data/sampleProducts";

const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

/** Simulates network latency so the loading skeleton is visible */
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function fetchProducts() {
  await delay(750);
  try {
    const res = await api.get("/products");
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

export async function fetchProductById(id) {
  await delay(300);
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch {
    return sampleProducts.find((p) => p.id === id);
  }
}
