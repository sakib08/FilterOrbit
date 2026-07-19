function cosineSimilarity(a, b) {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/** Simple bag-of-words embedding for demo / offline stores without an API */
export function textToEmbedding(text, dims = 32) {
  const vec = new Array(dims).fill(0);
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash * 31 + token.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % dims;
    vec[idx] = (vec[idx] ?? 0) + 1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export function ensureProductEmbeddings(products) {
  if (!Array.isArray(products)) return [];
  return products.map((p) => {
    if (p.embedding?.length) return p;
    const text = [p.title, p.description, p.style, p.color, p.category]
      .filter(Boolean)
      .join(" ");
    return { ...p, embedding: textToEmbedding(text) };
  });
}

export function findSimilarProducts(
  products,
  queryEmbedding,
  threshold = 0.35,
  limit = 50
) {
  const scored = (products ?? [])
    .filter((p) => p.embedding?.length)
    .map((p) => ({
      id: p.id,
      score: cosineSimilarity(queryEmbedding, p.embedding),
    }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored;
}
