import z from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().nonempty(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().nonempty(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().nonempty(),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().nonempty(),
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: z.string().nonempty(),
  NODE_ENV: z.string(),
});

const serverEnvSchema = z.object({
  CLERK_SECRET_KEY: z.string().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  NODE_ENV: z.string(),
});

const enviroment = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  NODE_ENV: process.env.NODE_ENV,
};

export const env = clientEnvSchema.parse(enviroment);

// On server
if (typeof window === "undefined") {
  serverEnvSchema.parse(enviroment);
}
