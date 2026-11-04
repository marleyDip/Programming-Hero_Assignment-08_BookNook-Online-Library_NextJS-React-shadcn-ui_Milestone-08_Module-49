"use client";

/*Opens with the book's old data already filled in. */

import
    {
        Check,
        ImagePlus,
        Loader2,
        Minus,
        Pencil,
        PenLine,
        Plus,
        Sparkles,
        Type,
    } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/auth/field";
import Modal from "@/components/common/modal";
import { updateBookAction } from "@/lib/actions";
import
    {
        CATEGORY_ICONS,
        CONDITIONS,
        LANGUAGES,
        MAX_DESC,
        MAX_FILE_MB,
        uploadToImgbb,
    } from "@/lib/book-form";
import { CATEGORIES, type Book } from "@/lib/books-config";
import { cn } from "@/lib/utils";

type Errors = Partial<
  Record<"title" | "author" | "description" | "year", string>
>;

export default function EditBookModal({
  book,
  open,
  onClose,
  onSaved,
}: {
  book: Book;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Book) => void;
}) {
  // console.log(book);

  // the form starts with the OLD values
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [copies, setCopies] = useState(book.totalCopies ?? 1);
  const [description, setDescription] = useState(book.description ?? "");
  const [isbn, setIsbn] = useState(book.isbn ?? "");
  const [year, setYear] = useState(
    book.publishedYear ? String(book.publishedYear) : "",
  );
  const [language, setLanguage] = useState(book.language ?? "English");
  const [condition, setCondition] = useState(book.condition ?? "Good");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const borrowedNow =
    (book.totalCopies ?? 1) - (book.availableCopies ?? book.totalCopies ?? 1);

  function pickFile(f: File | undefined) {
    if (!f) return;

    if (!f.type.startsWith("image/"))
      return void toast.error("Please choose an image file.");

    if (f.size > MAX_FILE_MB * 1024 * 1024)
      return void toast.error(
        `The image must be smaller than ${MAX_FILE_MB} MB.`,
      );

    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const next: Errors = {};
    if (!title.trim()) next.title = "Please enter the book title.";
    if (!author.trim()) next.author = "Please enter the author's name.";
    if (!description.trim())
      next.description = "Please add a short description.";
    if (
      year &&
      (!/^\d{4}$/.test(year) || Number(year) < 1000 || Number(year) > 2100)
    )
      next.year = "Enter a 4-digit year.";
    setErrors(next);
    if (Object.keys(next).length)
      return void toast.error("Please fix the highlighted fields.");

    if (copies < borrowedNow) {
      return void toast.error(
        `${borrowedNow} copies are borrowed right now, so total copies can't go below ${borrowedNow}.`,
      );
    }

    const toastId = toast.loading(
      file ? "Uploading new image…" : "Saving changes…",
    );
    setBusy(true);

    try {
      const image = file ? await uploadToImgbb(file) : book.image;
      toast.loading("Saving changes…", { id: toastId });

      const input = {
        title: title.trim(),
        author: author.trim(),
        category,
        image,
        description: description.trim(),
        totalCopies: copies,
        isbn: isbn.trim(),
        publishedYear: year,
        language,
        condition,
      };

      const res = await updateBookAction(book._id, input);

      if (!res.ok) {
        toast.error(res.error, { id: toastId });
        return;
      }

      toast.success(res.message, { id: toastId });

      onSaved({
        ...book,
        title: input.title,
        author: input.author,
        category,
        image,
        description: input.description,
        totalCopies: copies,
        availableCopies: copies - borrowedNow,
        isbn: input.isbn,
        publishedYear: year ? Number(year) : null,
        language,
        condition,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong.",
        { id: toastId },
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !busy && onClose()}
      title="Edit book"
      description="Change anything you like, then save."
      icon={Pencil}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Book title"
            icon={Type}
            value={title}
            error={errors.title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Field
            label="Author name"
            icon={PenLine}
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
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((item) => {
              const Icon = CATEGORY_ICONS[item] ?? Sparkles;
              const active = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95",
                    active
                      ? "border-transparent bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/25"
                      : "border-border text-muted-foreground hover:border-emerald-500/40 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" /> {item}
                  {active && <Check className="size-3.5" strokeWidth={3.5} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Total copies</p>
            <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-background/60 px-2">
              <button
                type="button"
                aria-label="Fewer copies"
                onClick={() =>
                  setCopies((c) => Math.max(1, borrowedNow || 1, c - 1))
                }
                className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-emerald-500/10 hover:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-90"
              >
                <Minus className="size-4" />
              </button>

              <span className="text-lg font-semibold tabular-nums">
                {copies}
              </span>

              <button
                type="button"
                aria-label="More copies"
                onClick={() => setCopies((c) => Math.min(50, c + 1))}
                className="grid size-9 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-emerald-500/10 hover:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-90"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {borrowedNow > 0 && (
              <p className="pt-1.5 text-xs text-amber-600 dark:text-amber-400">
                {borrowedNow} borrowed now, so you can&apos;t go lower.
              </p>
            )}
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
                    "rounded-lg px-1 text-xs font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/60",
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

        {/* description */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="edit-desc" className="text-sm font-medium">
              Short description
            </label>

            <span className="text-xs tabular-nums text-muted-foreground">
              {description.length}/{MAX_DESC}
            </span>
          </div>

          <textarea
            id="edit-desc"
            rows={4}
            maxLength={MAX_DESC}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-invalid={!!errors.description}
            className={cn(
              "w-full resize-none rounded-xl border bg-background/60 px-4 py-3 text-sm outline-none transition-all focus:ring-4",
              errors.description
                ? "border-rose-500/70 focus:ring-rose-500/15"
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

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="ISBN"
            icon={Type}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />

          <Field
            label="Published year"
            icon={Type}
            inputMode="numeric"
            maxLength={4}
            value={year}
            error={errors.year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
          />

          <div>
            <label
              htmlFor="edit-lang"
              className="mb-2 block text-sm font-medium"
            >
              Language
            </label>

            <select
              id="edit-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-xl border border-border bg-background/60 px-4 text-sm outline-none transition-all hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* image */}
        <div>
          <p className="mb-2 text-sm font-medium">Book image</p>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-3">
            {(preview || book.image) && (
              <Image
                src={preview ?? book.image}
                alt="Cover"
                width={72}
                height={96}
                // unoptimized
                className="h-24 w-18 rounded-lg object-cover shadow-md"
              />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {file ? file.name : "Current cover"}
              </p>

              <p className="text-xs text-muted-foreground">
                {file
                  ? "New image uploads when you save."
                  : "Leave as is, or choose a new one."}
              </p>

              <input
                ref={fileInput}
                id="edit-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />

              <label
                htmlFor="edit-image"
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
              >
                <ImagePlus className="size-3.5" /> Change image
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-11 rounded-full border border-border px-6 text-sm font-medium outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:scale-95 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 px-7 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500/60 active:translate-y-0 active:scale-95 disabled:opacity-80"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {busy ? "Saving" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
