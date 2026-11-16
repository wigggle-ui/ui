import type { MetadataRoute } from "next";

import { categories } from "@/config/widgets";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: "https://wigggle-ui.vercel.app",
  };
  const contributors = {
    url: "https://wigggle-ui.vercel.app/contributors",
  };
  const categoryPages = categories.map((category) => ({
    url: `https://wigggle-ui.vercel.app/${category.slug}`,
  }));

  return [home, contributors, ...categoryPages];
}
