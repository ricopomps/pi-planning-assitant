import { createApi } from "unsplash-js";
import { env } from "./env";

export const trelloUnsplashCollectionId = "317099";

export const unsplash = createApi({
  accessKey: env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});
