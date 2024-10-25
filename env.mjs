import { z } from "zod";

const server = z.object({
  NODE_ENV: z
    .enum([
      "development", // default
      "production",
    ])
    .default("development"),
  OLLAMA_BASE_URL: z.string().url(),
  OLLAMA_MODEL_NAME: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_PRIVATE_KEY: z.string().min(1),
  OLLAMA_EMBEDDING_MODEL_NAME: z.string(),
});

const client = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_IS_DEMO: z.enum(["true", "false"], {
    message: "NEXT_PUBLIC_IS_DEMO must be 'true' or 'false'",
  }),
  NEXT_PUBLIC_URL_PROD: z.string().url(),
  NEXT_PUBLIC_URL_DEV: z.string().url(),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  OLLAMA_MODEL_NAME: process.env.OLLAMA_MODEL_NAME,
  NEXT_PUBLIC_IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_PRIVATE_KEY: process.env.SUPABASE_PRIVATE_KEY,
  OLLAMA_EMBEDDING_MODEL_NAME: process.env.OLLAMA_EMBEDDING_MODEL_NAME,
  NEXT_PUBLIC_URL_PROD: process.env.NEXT_PUBLIC_URL_PROD,
  NEXT_PUBLIC_URL_DEV: process.env.NEXT_PUBLIC_URL_DEV,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);
if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
