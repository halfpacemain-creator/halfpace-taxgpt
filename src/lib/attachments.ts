export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export interface PreparedAttachment {
  url: string; // data URL
  mediaType: string;
  filename: string;
  size: number;
}

export function isAcceptedImage(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export async function prepareAttachment(file: File): Promise<PreparedAttachment> {
  if (!isAcceptedImage(file)) {
    throw new Error("Only JPG, PNG or WEBP images are supported.");
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error("Image too large. Max 5 MB.");
  }
  const url = await fileToDataUrl(file);
  return {
    url,
    mediaType: file.type,
    filename: file.name,
    size: file.size,
  };
}
