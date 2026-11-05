# 📚 BookNook

**Add a book. Borrow a book. Return a book.**

BookNook is a small online library where readers can discover books, share their own titles with the community, and borrow them for a few days. This repository is the **client side** (Next.js). The REST API lives in a separate server repository.

🔗 **Live site:** [https://your-booknook-site.vercel.app](https://your-booknook-site.vercel.app)
🖥️ **Server repo:** [https://github.com/your-username/booknook-server](https://github.com/your-username/booknook-server)

---

## ✨ Key Features

- 🔐 **Secure authentication** with Better Auth and MongoDB: email and password registration and login, plus **Google sign-in**. Password rules (uppercase, lowercase, minimum 6 characters) are checked in the browser and again on the server.
- 🛡️ **Private routes with smart redirects:** logged-out visitors who open a private page, or press **Borrow**, are sent to Login and returned to the same page afterwards.
- 🔎 **Browse the whole shelf:** a responsive book grid with **search by title or author, category filter, sorting and pagination (10 books per page)**. Every filter lives in the URL, so any view can be shared.
- 📖 **Book Details page** showing the cover, title, author, category, description, availability, condition, language, ISBN and **who added the book**.
- ➕ **Add, edit and delete your books:** upload covers to **imgbb**, set the number of copies, and manage everything from a dashboard. Editing opens a pre-filled form, and deleting uses a **custom confirmation modal**.
- 🔄 **Complete borrow system:** borrow through a confirmation modal, track due dates in **My Borrows**, and return a book in one tap. Available copies update automatically, and a user can't borrow their own book or the same book twice.
- 🎛️ **Premium dashboard:** a 3D sidebar with **Add Book, My Books and My Borrows**, plus a profile page to change your name, photo, email and password.
- 🎨 **Modern, interactive design:** dark and light mode, 3D tilt cards, animated splash screen, 3D loading and 404 pages, skeleton loaders, and **toast notifications** for every success and error message.
- 🔍 **SEO and performance minded:** page metadata, Open Graph tags, `loading.tsx` states, a custom `not-found` page, and cached data with Next.js Cache Components.

---

## 🧰 Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion, Lucide icons |
| Authentication | Better Auth with the MongoDB adapter, Google OAuth |
| Notifications | Sonner |
| Image hosting | imgbb |
| Backend | Node.js, Express.js, MongoDB (separate repository) |

---

## 🗺️ Pages

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Hero slider, new arrivals, categories, how it works, reviews, newsletter |
| `/books` | Public | All books with search, category filter, sorting and pagination |
| `/books/:id` | **Private** | Full book details and the Borrow modal |
| `/add-book` | **Private** | Add a new book |
| `/my-books` | **Private** | Edit and delete your books |
| `/my-borrows` | **Private** | Your borrowed books and the Return button |
| `/profile` | **Private** | Update name, photo, email and password |
| `/login`, `/register` | Public | Email and password or Google authentication |

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/booknook-client.git
cd booknook-client
npm install
```

### 2. Add environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB (used by Better Auth)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/?retryWrites=true&w=majority
MONGODB_DB=booknook

# Better Auth
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (redirect URI: http://localhost:3000/api/auth/callback/google)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Express API
NEXT_PUBLIC_API_URL=http://localhost:5000
INTERNAL_API_KEY=same-value-as-in-the-server-env

# Image uploads (https://api.imgbb.com/)
NEXT_PUBLIC_IMGBB_API_KEY=
```

> Generate a secret with `openssl rand -base64 32`. `INTERNAL_API_KEY` must be identical in the client and the server.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API server needs to be running too (see the server repository).

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

---

## 🗂️ Project Structure

```text
src/
├── app/
│   ├── (auth)/          # login, register, forgot and reset password
│   ├── (dashboard)/     # add-book, my-books, my-borrows (shared sidebar layout)
│   ├── books/           # all books and /books/[id] details
│   ├── profile/         # profile settings
│   ├── api/auth/        # Better Auth route handler
│   ├── loading.tsx      # global loading screen
│   └── not-found.tsx    # custom 404 page
├── components/          # UI: navbar, footer, sliders, cards, modals, forms
├── lib/                 # auth, API helpers, server actions, types
└── proxy.ts             # redirects logged-out users away from private routes
```

---

## ☁️ Deployment

1. Push the repository to GitHub and import it into **Vercel**.
2. Add the same environment variables in the Vercel project settings, setting `BETTER_AUTH_URL` and `NEXT_PUBLIC_API_URL` to your live URLs.
3. In the Google Cloud Console, add `https://your-booknook-site.vercel.app/api/auth/callback/google` as an authorized redirect URI.
4. Add your live domain to the allowed origins (CORS) on the server.

---

## 👨‍💻 Author

<div align="center">

  <h2>✨ Md. Sofian Hasan ✨</h2>

  <p>
    <strong>Software Engineer | Full-Stack (MERN / PERN) Developer</strong>
  </p>

  <p align="center">

[![🌐 Portfolio](https://img.shields.io/badge/🌐_Portfolio-Visit_Website-0A0A0A?style=for-the-badge)](https://marleydip.netlify.app/)
&nbsp;
[![💻 GitHub](https://img.shields.io/badge/💻_GitHub-View_Profile-181717?style=for-the-badge&logo=github)](https://github.com/marleyDip)

</p>

</div>

<p align="center">
  Passionate about building <strong>modern, scalable, and user-focused web applications</strong> while continuously strengthening <b><i>JavaScript, TypeScript, problem-solving, and full-stack development skills</i></b>.
</p>

### 🚀 Tech Focus

<div align="center">

<img src="https://skillicons.dev/icons?i=js,ts,react,nextjs,tailwind,nodejs,express,nestjs,mongodb,postgres" alt="Tech Stack" />

<br /><br />

<img src="https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge" alt="MERN Stack" />
<img src="https://img.shields.io/badge/PERN-Stack-336791?style=for-the-badge" alt="PERN Stack" />

</div>

---

⭐ If you like BookNook, give the repository a star!
