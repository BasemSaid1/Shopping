interface CompressOptions {
  maxDimension?: number;
  skipBelowBytes?: number;
}

export async function compressImage(
  file: File,
  { maxDimension = 1600, skipBelowBytes = 800 * 1024 }: CompressOptions = {},
): Promise<File> {
  if (file.size <= skipBelowBytes) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const type =
    file.type === "image/png" || file.type === "image/webp"
      ? file.type
      : "image/jpeg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, 0.85),
  );

  if (!blob || blob.size >= file.size) return file;

  return new File([blob], file.name, { type, lastModified: Date.now() });
}
