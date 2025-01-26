import { createApi } from "unsplash-js";

export const trelloUnsplashCollectionId = "317099";

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch: fetch,
});
