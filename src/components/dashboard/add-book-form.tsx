"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Check,
  Hash,
  ImagePlus,
  Loader2,
  Lock,
  Mail,
  Minus,
  PenLine,
  Plus,
  Sparkles,
  Type,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/auth/field";

import { addBookAction } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";
import {
  CATEGORY_ICONS,
  CONDITIONS,
  LANGUAGES,
  MAX_DESC,
  MAX_FILE_MB,
  uploadToImgbb,
} from "@/lib/book-form";
import { CATEGORIES } from "@/lib/books-config";
import { cn } from "@/lib/utils";

import Image from "next/image";
import LanguageDropdown from "./language-dropdown";

/* const CATEGORY_ICONS: Record<string, LucideIcon> = {
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

const CONDITIONS = ["New", "Like new", "Good", "Fair"];

const LANGUAGES = [
  "English",
  "Bangla",
  "Hindi",
  "Arabic",
  "Spanish",
  "French",
  "Other",
];

const MAX_DESC = 300;
const MAX_FILE_MB = 5; */

type Errors = Partial<
  Record<
    "title" | "author" | "category" | "image" | "description" | "year",
    string
  >
>;

/* async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key)
    throw new Error(
      "Image upload isn't set up yet (missing NEXT_PUBLIC_IMGBB_API_KEY).",
    );

  const fd = new FormData();
  fd.append("image", file);

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
} */

/* live 3D preview card */
function PreviewCard({
  title,
  author,
  category,
  copies,
  condition,
  image,
}: {
  title: string;
  author: string;
  category: string;
  copies: number;
  condition: string;
  image: string | null;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 16 });
  const sy = useSpring(my, { stiffness: 150, damping: 16 });
  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [12, -12]);

  return (
    <div className="perspective-[1000px]">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative rounded-3xl border border-border/70 bg-card p-3 shadow-xl shadow-emerald-900/10"
      >
        <div
          className="relative aspect-3/4 overflow-hidden rounded-2xl bg-muted"
          style={{ transform: "translateZ(24px)" }}
        >
          {image ? (
            <Image
              src={image}
              alt="Cover preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-linear-to-br from-emerald-500 to-teal-700 p-6 text-center text-white">
              <div>
                <BookOpen className="mx-auto size-10 opacity-80" />
                <p className="mt-3 font-serif text-lg font-bold leading-tight">
                  {title || "Your book title"}
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
            {category || "Category"}
          </span>
        </div>

        <div
          className="px-2 pb-2 pt-4"
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight">
            {title || "Your book title"}
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <PenLine className="size-3.5" />
            {author || "Author name"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
              {copies} {copies === 1 ? "copy" : "copies"}
            </span>

            <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
              {condition}
            </span>
          </div>
        </div>
      </motion.div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Live preview. Move your mouse over it.
      </p>
    </div>
  );
}

function ReadOnlyField({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex h-12 items-center gap-3 rounded-xl border border-dashed border-border bg-muted/50 px-4 text-sm text-muted-foreground">
        <Icon className="size-4.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{value || "Loading…"}</span>
        <Lock className="size-3.5 shrink-0" aria-label="Read only" />
      </div>
    </div>
  );
}

/* ===== Form ===== */
export default function AddBookForm() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [copies, setCopies] = useState(1);
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("English");
  const [condition, setCondition] = useState("Good");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState<null | "upload" | "save">(null);

  function pickFile(f: File | undefined) {
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WEBP).");
      return;
    }

    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`The image must be smaller than ${MAX_FILE_MB} MB.`);
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));

    setErrors((e) => ({ ...e, image: undefined }));
  }

  function removeFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);

    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const next: Errors = {};
    if (!title.trim()) next.title = "Please enter the book title.";
    if (!author.trim()) next.author = "Please enter the author's name.";
    if (!category) next.category = "Please choose a category.";
    if (!file) next.image = "Please upload a cover image.";
    if (!description.trim())
      next.description = "Please add a short description.";
    if (
      year &&
      (!/^\d{4}$/.test(year) || Number(year) < 1000 || Number(year) > 2100)
    )
      next.year = "Enter a 4-digit year.";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const toastId = toast.loading("Uploading cover image…");

    try {
      setBusy("upload");
      // const imageUrl = await uploadToImgbb(file as File, "booknook-book-cover");

      const imageUrl = await uploadToImgbb(file as File);

      setBusy("save");

      toast.loading("Saving your book…", { id: toastId });

      const result = await addBookAction({
        title: title.trim(),
        author: author.trim(),
        category,
        image: imageUrl,
        description: description.trim(),
        totalCopies: copies,
        isbn: isbn.trim(),
        publishedYear: year,
        language,
        condition,
      });

      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });

      router.push("/my-books");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
        { id: toastId },
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_17rem]">
      <form onSubmit={onSubmit} noValidate className="space-y-8">
        {/* ---- Basics ---- */}
        <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">Book details</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Book title"
              icon={Type}
              placeholder="e.g. The Quiet Orchard"
              value={title}
              error={errors.title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Field
              label="Author name"
              icon={PenLine}
              placeholder="e.g. Mira Lane"
              value={author}
              error={errors.author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* category */}
          <div>
            <p className="mb-2 text-sm font-medium">Category</p>
            <div
              role="radiogroup"
              aria-label="Category"
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-5"
            >
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c] ?? Sparkles;
                const active = category === c;

                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setCategory(c);
                      setErrors((er) => ({ ...er, category: undefined }));
                    }}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-emerald-500/20 active:scale-95",
                      active
                        ? "border-transparent bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-700/30"
                        : "border-border bg-background/60 text-muted-foreground hover:-translate-y-1 hover:border-emerald-500/40 hover:text-foreground hover:shadow-md",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                      )}
                    />
                    {c}

                    {active && (
                      <Check
                        className="absolute right-2 top-2 size-3.5"
                        strokeWidth={3.5}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {errors.category && (
              <p
                role="alert"
                className="pt-1.5 text-xs text-rose-600 dark:text-rose-400"
              >
                {errors.category}
              </p>
            )}
          </div>

          {/* copies & condition */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">Total copies</p>

              <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-background/60 px-2">
                <button
                  type="button"
                  aria-label="Fewer copies"
                  onClick={() => setCopies((c) => Math.max(1, c - 1))}
                  className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none transition-all hover:bg-emerald-500/10 hover:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-90"
                >
                  <Minus className="size-4" />
                </button>

                <motion.span
                  key={copies}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg font-semibold tabular-nums"
                >
                  {copies}
                </motion.span>

                <button
                  type="button"
                  aria-label="More copies"
                  onClick={() => setCopies((c) => Math.min(50, c + 1))}
                  className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none transition-all hover:bg-emerald-500/10 hover:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-90"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Condition</p>

              <div
                role="radiogroup"
                aria-label="Condition"
                className="grid h-12 grid-cols-4 gap-1 rounded-xl border border-border bg-background/60 p-1"
              >
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={condition === c}
                    onClick={() => setCondition(c)}
                    className={cn(
                      "rounded-lg px-1 text-xs font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60",
                      condition === c
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- cover & description ---- */}
        <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight">
            Cover & description
          </h2>

          <div>
            <p className="mb-2 text-sm font-medium">Book image</p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "relative flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                dragging
                  ? "scale-[1.01] border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-background/60 hover:border-emerald-500/50",
                errors.image && "border-rose-500/60",
              )}
            >
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="sr-only"
                id="book-image"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />

              {preview ? (
                <div className="flex w-full items-center gap-4 p-4">
                  {/* <Image
                    src={preview}
                    alt="Selected cover"
                    className="h-32 w-24 rounded-lg object-cover shadow-lg"
                  /> */}

                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={preview}
                      alt="Selected cover"
                      fill
                      sizes="96px"
                      className="object-cover shadow-lg"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {file?.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB. It
                      uploads when you press Add Book.
                    </p>

                    <div className="mt-3 flex gap-2">
                      <label
                        htmlFor="book-image"
                        className="cursor-pointer rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
                      >
                        Change
                      </label>

                      <button
                        type="button"
                        onClick={removeFile}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-500/10"
                      >
                        <X className="size-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="book-image"
                  className="flex w-full cursor-pointer flex-col items-center gap-2 p-8 text-center"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-transform duration-300 hover:scale-110 dark:text-emerald-400">
                    <ImagePlus className="size-7" />
                  </span>

                  <span className="text-sm font-semibold">
                    Drop an image here, or click to browse
                  </span>

                  <span className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP, up to {MAX_FILE_MB} MB
                  </span>
                </label>
              )}
            </div>

            {errors.image && (
              <p
                role="alert"
                className="pt-1.5 text-xs text-rose-600 dark:text-rose-400"
              >
                {errors.image}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="book-desc" className="text-sm font-medium">
                Short description
              </label>

              <span
                className={cn(
                  "text-xs tabular-nums",
                  description.length > MAX_DESC * 0.9
                    ? "text-amber-600"
                    : "text-muted-foreground",
                )}
              >
                {description.length}/{MAX_DESC}
              </span>
            </div>

            <textarea
              id="book-desc"
              rows={4}
              maxLength={MAX_DESC}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((er) => ({ ...er, description: undefined }));
              }}
              placeholder="What is this book about? Why would someone enjoy it?"
              aria-invalid={!!errors.description}
              className={cn(
                "w-full resize-none rounded-xl border bg-background/60 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/60 focus:ring-4",
                errors.description
                  ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/15"
                  : "border-border hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-emerald-500/15",
              )}
            />

            {errors.description && (
              <p
                role="alert"
                className="pt-1.5 text-xs text-rose-600 dark:text-rose-400"
              >
                {errors.description}
              </p>
            )}
          </div>
        </section>

        {/* ---- extra library info ---- */}
        <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              More details{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Helps readers find and identify the right edition.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="ISBN"
              icon={Hash}
              placeholder="978-…"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />

            <Field
              label="Published year"
              icon={CalendarDays}
              inputMode="numeric"
              maxLength={4}
              placeholder="2021"
              value={year}
              error={errors.year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
            />

            {/* <div>
              <label
                htmlFor="book-lang"
                className="mb-2 block text-sm font-medium"
              >
                Language
              </label>

              <div className="group flex h-12 items-center gap-3 rounded-xl border border-border bg-background/60 px-4 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15 hover:border-emerald-500/40">
                <Languages className="size-4.5 shrink-0 text-muted-foreground group-focus-within:text-emerald-500" />

                <select
                  id="book-lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-full min-w-0 flex-1 cursor-pointer bg-transparent text-sm outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            <LanguageDropdown
              value={language}
              onChange={setLanguage}
              options={LANGUAGES}
            />
          </div>
        </section>

        {/* ---- owner (read only) & submit ---- */}
        <section className="space-y-5 rounded-3xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Added by</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Taken from your account, so it can&apos;t be changed here.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ReadOnlyField
              label="User name"
              icon={User}
              value={user?.name ?? ""}
            />

            <ReadOnlyField
              label="Email"
              icon={Mail}
              value={user?.email ?? ""}
            />
          </div>

          <button
            type="submit"
            disabled={!!busy || !user}
            className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/30 focus-visible:ring-4 focus-visible:ring-emerald-500/30 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              {busy ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  {busy === "upload" ? "Uploading image" : "Saving book"}
                </>
              ) : (
                <>
                  <Plus className="size-5" />
                  Add Book
                </>
              )}
            </span>

            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </section>
      </form>

      {/* live preview */}
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <PreviewCard
            title={title}
            author={author}
            category={category}
            copies={copies}
            condition={condition}
            image={preview}
          />
        </div>
      </aside>
    </div>
  );
}
