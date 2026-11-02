/** Place at: src/app/books/loading.tsx */
import { GridSkeleton } from "@/components/books/books-results";
import { ToolbarSkeleton } from "@/components/books/books-toolbar";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14"
      role="status"
      aria-label="Loading books"
    >
      <div className="mx-auto h-24 max-w-2xl animate-pulse rounded-3xl bg-muted" />
      <div className="mt-10">
        <ToolbarSkeleton />
      </div>
      <div className="mt-8">
        <GridSkeleton count={10} />
      </div>
    </div>
  );
}
