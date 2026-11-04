/** client-safe: shared by Add Book and Edit Book */

import {
  Baby,
  BookMarked,
  Brain,
  Feather,
  Library,
  Microscope,
  Puzzle,
  Rocket,
  ScrollText,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

// export const CATEGORY_ICONS: Record<string, LucideIcon> = {
//   Fiction: Feather,
//   Science: FlaskConical,
//   History: Landmark,
//   Kids: Baby,
//   Others: Sparkles,
// };

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Fiction: Feather,
  Fantasy: WandSparkles,
  "Sci-Fi": Rocket,
  History: ScrollText,
  "Self-Help": Brain,
  Classic: BookMarked,
  Mystery: Puzzle,
  // Mystery: Fingerprint,
  Science: Microscope,
  // Science: FlaskConical,
  Kids: Baby,
  Others: Library,
};

export const CONDITIONS = ["New", "Like new", "Good", "Fair"];

export const LANGUAGES = [
  "English",
  "Bangla",
  "Hindi",
  "Arabic",
  "Spanish",
  "French",
  "Other",
];

export const MAX_DESC = 300;
export const MAX_FILE_MB = 5;

/** Uploads an image to imgbb and returns its public URL */
export async function uploadToImgbb(
  file: File,
  name?: string,
): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key)
    throw new Error(
      "Image upload isn't set up yet (missing NEXT_PUBLIC_IMGBB_API_KEY).",
    );

  const fd = new FormData();
  fd.append("image", file);

  if (name) {
    fd.append("name", name);
  }

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: fd,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success)
    throw new Error(
      json?.error?.message || "Image upload failed. Please try again.",
    );

  return (json.data.display_url || json.data.url) as string;
}
