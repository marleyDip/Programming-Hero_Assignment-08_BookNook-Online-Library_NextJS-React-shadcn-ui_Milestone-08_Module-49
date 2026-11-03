import { BookPlus } from "lucide-react";
import type { Metadata } from "next";

import AddBookForm from "@/components/dashboard/add-book-form";
import { DashHeader } from "@/components/dashboard/dash-header";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Share a book with the BookNook community.",
  robots: { index: false, follow: false },
};

export default function AddBookPage() {
  return (
    <>
      <DashHeader
        icon={BookPlus}
        title="Add a new book"
        subtitle="Share a title with the community. Readers can borrow it right away."
      />

      <AddBookForm />
    </>
  );
}

/* This error occurs because BookPlus is a React component (an object containing $$typeof and render), and you're passing it from a Server Component to a Client Component as a prop.

In Next.js App Router, Server Components cannot pass React component objects directly to Client Components through props.

<DashHeader
  icon="BookPlus"
/>

*/
