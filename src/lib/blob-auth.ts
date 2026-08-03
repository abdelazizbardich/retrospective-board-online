/** Options for @vercel/blob when BLOB_READ_WRITE_TOKEN is set. */
export type BlobAuthOptions = { token: string };

export function isBlobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

/**
 * Prefer an explicit read-write token so uploads work when OIDC is enabled
 * for production/preview but not for the development environment.
 */
export function getBlobAuthOptions(): BlobAuthOptions | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return undefined;
  return { token };
}
