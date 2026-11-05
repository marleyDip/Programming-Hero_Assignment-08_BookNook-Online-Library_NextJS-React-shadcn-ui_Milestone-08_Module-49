# 📚 BookNook — Online Community Library

**Add a book. Borrow a book. Return a book.**

BookNook is a modern online community library that allows readers to discover books, share their own books, borrow available copies, and manage their reading collections. It provides a complete library management experience with secure authentication, personal dashboards, book availability tracking, and a responsive user interface.

This repository contains the **frontend application**, built with Next.js and TypeScript. The REST API and database operations are handled by a separate Express.js backend.

<p align="center">
  <a href="https://sofian-booknook-online-library.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20BookNook-059669?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/marleyDip/Programming-Hero_Assignment-08_BookNook-Online-Library_NextJS-React-shadcn-ui_Milestone-08_Module-49">
    <img src="https://img.shields.io/badge/Backend-Repository-181717?style=for-the-badge&logo=github" alt="Frontend Repository" />
  </a>
</p>

---

## 📸 Project Overview

BookNook brings together readers through a simple sharing and borrowing experience.

- Discover books from a community-maintained library.
- Search and filter books based on different criteria.
- Share your own books with other readers.
- Borrow available copies and track borrowing information.
- Return borrowed books and automatically update availability.
- Manage your personal library through an interactive dashboard.

The application is designed with a focus on usability, security, performance, and maintainable full-stack architecture.

---

## ✨ Key Features

### 🔐 Authentication & Account Management

- Secure authentication powered by **Better Auth** and MongoDB.
- Email and password registration and login.
- Google OAuth authentication.
- Password validation on both the client and server.
- Protected dashboard and account pages.
- Automatic authentication redirects with callback URLs.
- User profile management, including name and profile photo.
- Email and password management through the authentication system.

### 📚 Book Discovery & Library

- Browse all available books in a responsive book grid.
- Search books by title or author.
- Filter books by category.
- Sort books using supported sorting options.
- Paginated results with 10 books per page.
- URL-based search and filtering for shareable views.
- Latest book arrivals displayed on the homepage.
- Detailed book information with cover images and descriptions.

### 📖 Book Details

Each book details page provides relevant information, including:

- Book cover image.
- Title and author.
- Category and description.
- ISBN and publication year.
- Language and book condition.
- Total and available copies.
- Information about the book owner.
- Borrowing availability and confirmation modal.

### ➕ Personal Book Management

Authenticated users can manage their own books.

- Add new books to the community library.
- Upload book cover images using **ImgBB**.
- Set total copies and book information.
- Edit existing books using a pre-filled form.
- Delete books through a custom confirmation modal.
- View available and borrowed copy statistics.
- Track all books added by the current user.

### 🔄 Borrowing & Returning System

- Borrow books through a confirmation modal.
- Prevent users from borrowing their own books.
- Prevent duplicate active borrowing of the same book.
- Automatically calculate borrowing due dates.
- Track borrowed books from the My Borrows dashboard.
- Return books with a single action.
- Automatically update available copies after borrowing and returning.
- Validate borrowing and returning operations on the backend.

### 🎛️ Interactive Dashboard

The dashboard provides dedicated sections for:

- **Add Book:** Submit a new book to the library.
- **My Books:** Manage books added by the current user.
- **My Borrows:** Track borrowed books and return them.
- **Profile:** Manage personal account information.

Additional dashboard features include statistics, responsive navigation, animated cards, edit forms, and confirmation dialogs.

### 🎨 Modern User Interface

- Responsive, mobile-first layout.
- Dark and light theme support.
- Modern UI with Tailwind CSS and shadcn/ui.
- Interactive animations powered by Framer Motion.
- 3D-inspired card interactions and sidebar effects.
- Animated splash and loading screens.
- Skeleton loading states.
- Custom 404 page.
- Toast notifications powered by Sonner.
- Reusable components and consistent design patterns.

### 🔍 SEO & Performance

- Next.js App Router architecture.
- Page-specific metadata.
- Open Graph metadata for social sharing.
- Loading and error states.
- Custom not-found page.
- Server-side data fetching.
- Cache-aware data management using Next.js Cache Components.
- Optimized images where supported.
- Dynamic route handling and URL-based filters.

---

## 🧰 Technology Stack

| Category | Technologies |
| --- | --- |
| Framework | Next.js 16, React |
| Language | TypeScript |
| Routing | Next.js App Router |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Authentication | Better Auth |
| OAuth | Google OAuth |
| Authentication Database | MongoDB |
| Notifications | Sonner |
| Image Hosting | ImgBB |
| API Communication | Fetch API |
| Backend | Node.js, Express.js |
| Main Database | MongoDB |
| API Authentication | JWT, JOSE, JWKS |
| Deployment | Vercel |

---

## 🏗️ Application Architecture

BookNook uses a separate frontend and backend architecture.

```text
                   ┌─────────────────────────┐
                   │        User             │
                   └────────────┬────────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │   Next.js Frontend      │
                   │   App Router + React    │
                   └────────────┬────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
       ┌────────────────────┐      ┌────────────────────┐
       │    Better Auth     │      │    Express API     │
       │ Authentication     │      │  Book Operations   │
       └─────────┬──────────┘      └─────────┬──────────┘
                 │                           │
                 ▼                           │
       ┌────────────────────┐                 │
       │ MongoDB            │                 │
       │ Auth Data          │                 │
       └────────────────────┘                 │
                                              │
                                  JWT Bearer Authentication
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │ JWT Verification   │
                                   │ EdDSA + JWKS       │
                                   └─────────┬──────────┘
                                             │
                                             ▼
                                   ┌────────────────────┐
                                   │ MongoDB            │
                                   │ Books & Borrowings │
                                   └────────────────────┘
```

### Authentication Flow

1. Users register or sign in through Better Auth.
2. Better Auth manages authentication sessions.
3. The frontend obtains a JWT using the Better Auth JWT plugin.
4. Server-side API requests attach the JWT as a Bearer token.
5. Express verifies the JWT signature using Better Auth's JWKS endpoint.
6. The backend extracts the authenticated user's identity from the verified token.
7. Protected API operations use the verified identity to enforce ownership and authorization.

**Security principle:** The backend does not trust user identity supplied through request bodies or query parameters. Authenticated user information is derived from the verified JWT.

---

## 🗺️ Application Pages & Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Homepage, hero section, latest books, categories and newsletter |
| `/books` | Public | Browse, search, filter, sort and paginate books |
| `/books/[id]` | Private | Book details and borrowing functionality |
| `/add-book` | Private | Add a new book |
| `/my-books` | Private | Manage personal books |
| `/my-borrows` | Private | View borrowed books and return them |
| `/profile` | Private | Manage profile information |
| `/login` | Public | User login |
| `/register` | Public | User registration |

---

## 🔌 Backend API Overview

The frontend communicates with a separate Express.js REST API.

The following endpoints represent the application's API structure.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API health check |
| GET | `/api/books` | Public | Retrieve books |
| GET | `/api/books/latest` | Public | Retrieve latest books |
| GET | `/api/books/:id` | Authenticated | Retrieve book details |
| POST | `/api/books` | Authenticated | Add a book |
| GET | `/api/my-books` | Authenticated | Retrieve the current user's books |
| PUT | `/api/books/:id` | Authenticated | Update an owned book |
| DELETE | `/api/books/:id` | Authenticated | Delete an owned book |
| POST | `/api/borrows` | Authenticated | Borrow a book |
| GET | `/api/borrows` | Authenticated | Retrieve the current user's borrowings |
| PATCH | `/api/borrows/:id/return` | Authenticated | Return a borrowed book |
| POST | `/api/newsletter` | Public | Subscribe to the newsletter |

**Authentication:** Protected endpoints require a valid JWT in the `Authorization` header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The backend verifies JWT signatures using the Better Auth JWKS endpoint.

For the complete backend implementation, visit the server repository.

---

## 🚀 Getting Started

Follow these steps to run the BookNook frontend locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended).
- npm.
- Git.
- MongoDB Atlas account or a local MongoDB instance.
- Google Cloud Console project for Google OAuth (optional).
- ImgBB API key for image uploads.

The Express backend must also be configured and running.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/booknook-client.git

cd booknook-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory.

```env
# ==========================================
# MongoDB - Better Auth
# ==========================================
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/
MONGODB_DB=booknook

# ==========================================
# Better Auth Configuration
# ==========================================
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# ==========================================
# Google OAuth
# ==========================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ==========================================
# Express Backend API
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:8000

# ==========================================
# ImgBB Image Hosting
# ==========================================
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

**Environment variable notes:**

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by Better Auth |
| `MONGODB_DB` | Authentication database name |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Base URL of the Next.js authentication application |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Express backend base URL |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB image upload API key |

Generate a secure Better Auth secret using:

```bash
openssl rand -base64 32
```

Keep `.env.local` private. Never commit secrets, database credentials, or OAuth client secrets to GitHub.

**Important:** The backend has its own environment configuration. Configure its MongoDB connection and `BETTER_AUTH_URL` separately in the server repository. The Better Auth URL must match the frontend authentication application's base URL.

### 4. Configure Google OAuth

If you want to enable Google sign-in:

1. Open the Google Cloud Console.
2. Create or select a project.
3. Configure the OAuth consent screen.
4. Create an OAuth 2.0 Client ID.
5. Add your client ID and secret to `.env.local`.

For local development, configure this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add your actual deployed callback URL as well.

### 5. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Make sure the Express backend is also running at the configured API URL.

---

## 🖥️ Running the Backend

The backend is maintained in a separate repository.

Clone it into another directory:

```bash
git clone https://github.com/your-username/booknook-server.git

cd booknook-server
```

Install its dependencies:

```bash
npm install
```

Configure the backend environment variables according to the backend README, including:

- MongoDB connection configuration.
- Database name.
- Better Auth base URL.
- Allowed frontend CORS origin.

Start the backend using its available development script.

The local backend URL is:

```text
http://localhost:8000
```

Verify the backend health endpoint:

```text
http://localhost:8000/api/health
```

---

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

---

## 🗂️ Project Structure

The frontend follows a modular Next.js App Router structure.

```text
booknook-client/
│
├── public/
│   ├── images/
│   └── ...
│
├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── add-book/
│   │   │   ├── my-books/
│   │   │   └── my-borrows/
│   │   │
│   │   ├── books/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │
│   │   ├── profile/
│   │   │
│   │   ├── api/
│   │   │   └── auth/
│   │   │
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── books/
│   │   ├── auth/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── actions/
│   │   ├── auth.ts
│   │   ├── auth-utils.ts
│   │   ├── api-fetch.ts
│   │   ├── books-config.ts
│   │   └── utils.ts
│   │
│   └── proxy.ts
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

*This is a representative overview; individual files and folders may vary as the project evolves.*

---

## 🔒 Security Considerations

Security is handled across both the frontend and backend.

- **Authentication:** Better Auth manages registration, login, and sessions.
- **JWT verification:** Express verifies JWT signatures using the Better Auth JWKS endpoint.
- **Protected routes:** Private application pages require an authenticated session.
- **Identity validation:** The backend derives user identity from the verified JWT.
- **Ownership checks:** Users can only manage their own books and borrowings.
- **Borrowing validation:** The backend validates copy availability and prevents duplicate active borrowing.
- **Database consistency:** Borrowing and returning operations use database transactions where supported.
- **Environment security:** Private credentials are stored in environment variables.
- **CORS:** The backend allows configured frontend origins.

Frontend route protection improves the user experience, but backend authorization remains the actual security boundary.

---

## ☁️ Deployment

The frontend is designed for deployment on **Vercel**, while the backend can be deployed separately.

### Frontend Deployment — Vercel

1. Push the frontend repository to GitHub.
2. Import the repository into Vercel.
3. Configure all required environment variables in Vercel Project Settings.
4. Set `BETTER_AUTH_URL` to your production frontend URL.
5. Set `NEXT_PUBLIC_API_URL` to your deployed Express API URL.
6. Configure the production Google OAuth redirect URI.
7. Deploy the application.

### Backend Deployment

1. Deploy the Express backend separately.
2. Configure its MongoDB connection.
3. Set `BETTER_AUTH_URL` to the same production frontend URL.
4. Configure CORS to allow your deployed frontend domain.
5. Ensure the Better Auth JWKS endpoint is publicly accessible to the backend.
6. Verify the API health endpoint.

### Production Environment Example

Frontend:

```env
BETTER_AUTH_URL=https://your-booknook-site.vercel.app
NEXT_PUBLIC_API_URL=https://your-booknook-api.example.com
```

Backend:

```env
BETTER_AUTH_URL=https://your-booknook-site.vercel.app
```

Use the actual deployed URLs in your environment configuration.

**Important:** Never use localhost URLs in production environment variables.

---

## 🧪 Testing the Application

You can test the main application workflows using the frontend or Postman.

Recommended test cases:

| Feature | Test |
| --- | --- |
| Registration | Create an account with valid information |
| Login | Sign in using email/password |
| Google OAuth | Authenticate using Google |
| Book creation | Add a book to the library |
| Book discovery | Search, filter and sort books |
| Book editing | Update an existing owned book |
| Book deletion | Delete an owned book |
| Borrowing | Borrow an available book |
| Duplicate borrowing | Attempt to borrow the same book again |
| Own-book restriction | Attempt to borrow your own book |
| Returning | Return an active borrowing |
| Authorization | Access protected APIs without a JWT |
| Ownership | Attempt to modify another user's book |

---

## 🚧 Future Improvements

Potential improvements for future versions include:

- Advanced book recommendations.
- Reading lists and favorites.
- Book reviews and ratings.
- Borrowing history and analytics.
- Notifications for upcoming due dates.
- Advanced dashboard statistics.
- Improved library discovery.
- Automated testing and CI/CD workflows.

---

## 👨‍💻 Author

<div align="center">

  <h2>✨ Md. Sofian Hasan ✨</h2>

  **Software Engineer | Full-Stack MERN & PERN Developer**

  Building Products. Teaching Minds.

  <p>
    <a href="https://marleydip.netlify.app">
      <img src="https://img.shields.io/badge/Portfolio-Visit%20Website-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
    </a>
    <a href="https://github.com/marleyDip">
      <img src="https://img.shields.io/badge/GitHub-View%20Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
    </a>
  </p>

  <img src="https://skillicons.dev/icons?i=js,ts,react,nextjs,tailwind,nodejs,express,nestjs,mongodb,postgres" alt="Technology Stack" />

</div>

Passionate about building modern, scalable, and user-focused web applications while continuously improving JavaScript, TypeScript, database design, problem-solving, and full-stack development skills.

---

## 📄 License

This project was developed for educational and portfolio purposes.

---

<p align="center">
  <strong>📚 BookNook — Bringing readers and books together.</strong>
  <br />
  ⭐ If you like this project, consider giving the repository a star!
</p>

---

## 🙏 Acknowledgements & Learning Credits

### Special Thanks to Programming Hero

This project was developed as part of my learning journey through the **AI-Driven Full Stack Web Engineering Course Level-1 B14**.

I would like to express my sincere gratitude to the entire **Programming Hero team, instructors, mentors, and community** for providing structured learning resources, practical guidance, and an encouraging environment to grow as a developer.

Throughout this journey, I have had the opportunity to strengthen my understanding of modern web development concepts, explore full-stack application architecture, and apply my knowledge by building real-world projects.

**BookNook represents more than just a course assignment — it is an opportunity to transform the concepts I have learned into a practical, functional application.**

Special thanks for inspiring me to keep learning, experimenting, solving problems, and building better software.

**Learning never stops. Every project is another step forward.** 🚀

<p align="center">
  <a href="https://codelab.programming-hero.com/u/marleydip">
    <img src="https://img.shields.io/badge/Programming%20Hero-Learning%20Partner-FF4B4B?style=for-the-badge" alt="Programming Hero" />
  </a>
</p>
