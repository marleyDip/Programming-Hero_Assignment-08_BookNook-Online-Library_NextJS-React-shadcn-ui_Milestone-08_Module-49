import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import BookDetailsView, {
  DetailsSkeleton,
} from "@/components/books/book-details-view";

import { apiFetch } from "@/lib/api";
import { getBookById } from "@/lib/books";
import { getSessionUser } from "@/lib/session";

/* export const metadata: Metadata = {
  title: "Book Details",
  description:
    "Everything about this book, and how to borrow it from BookNook.",
  robots: { index: false, follow: false }, // private page
}; */

// Dynamic SEO metadata from the real book data
export async function generateMetadata({
  params,
}: PageProps<"/books/[id]">): Promise<Metadata> {
  const { id } = await params;

  const book = await getBookById(id);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found on BookNook.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${book.title} by ${book.author}`;
  const description =
    `${book.title} by ${book.author}. ` +
    `Explore this ${book.category} book, discover its details, ` +
    `and check its availability on BookNook.`;

  const canonical = `/books/${encodeURIComponent(id)}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      siteName: "BookNook",
      title,
      description,
      url: canonical,
      images: book.image
        ? [
            {
              url: book.image,
              alt: `${book.title} book cover`,
            },
          ]
        : [],
    },

    twitter: {
      card: book.image ? "summary_large_image" : "summary",
      title,
      description,
      images: book.image ? [book.image] : [],
    },
  };
}

// Book details
async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // const [user, book] = await Promise.all([getSessionUser(), getBookById(id)]);

  const user = await getSessionUser();
  if (!user)
    redirect(`/login?callbackUrl=${encodeURIComponent(`/books/${id}`)}`);

  const book = await getBookById(id);
  if (!book) notFound();

  // Check whether the logged-in user has already borrowed this book
  // has this user already borrowed it (and not returned it yet)?
  let alreadyBorrowed = false;

  try {
    const borrows = await apiFetch<{ bookId: string; status: string }[]>(
      `/api/borrows?email=${encodeURIComponent(user.email)}`,
    );

    alreadyBorrowed = borrows.some(
      (borrow) => String(borrow.bookId) === id && borrow.status === "borrowed",
    );
  } catch (error) {
    // API not connected yet: just show the borrow button

    alreadyBorrowed = false;

    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch borrow status:", error);
    }
  }

  // const isOwner = Boolean(
  //   user &&
  //   book.ownerEmail &&
  //   book.ownerEmail.toLowerCase() === user.email.toLowerCase(),
  // );

  const isOwner =
    !!book.ownerEmail &&
    book.ownerEmail.toLowerCase() === user.email.toLowerCase();

  return (
    <BookDetailsView
      book={book}
      isOwner={isOwner}
      alreadyBorrowed={alreadyBorrowed}
    />
  );
}

// export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {}

// Page
export default function BookDetailsPage({ params }: PageProps<"/books/[id]">) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <Details params={params} />
    </Suspense>
  );
}
