import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

import { validatePassword } from "@/lib/auth-utils";
import { db } from "@/lib/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false, // after register we send the user to the Login page

    // Forgot password: plug in your email provider here (Resend, Nodemailer...).
    // For now the link is printed in the server terminal.
    sendResetPassword: async ({ user, url }) => {
      console.log(`[BookNook] Password reset link for ${user.email}: ${url}`);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Server-side password rules (the browser form checks them too)
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" || ctx.path === "/reset-password") {
        const body = (ctx.body ?? {}) as {
          password?: string;
          newPassword?: string;
        };
        const error = validatePassword(body.password ?? body.newPassword ?? "");
        if (error) throw new APIError("BAD_REQUEST", { message: error });
      }
    }),
  },

  plugins: [nextCookies()], // keep this last
});
