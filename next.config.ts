import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.12"],
  cacheComponents: true,
  images: {
    remotePatterns: [
      new URL(
        "https://i.scdn.co/image/ab67616d0000b273dfd5b5d99cf81f1864deef01"
      ),
      new URL(
        "https://i.scdn.co/image/ab6761610000e5ebd55c95ad400aed87da52daec"
      ),
      new URL(
        "https://c.saavncdn.com/artists/Nucleya_002_20241118064538_500x500.jpg"
      ),
      new URL(
        "https://i.scdn.co/image/ab67616d0000b273aacbfc6de7128a834757fea4"
      ),
      new URL(
        "https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8"
      ),
      new URL(
        "https://i.scdn.co/image/ab67616d0000b273627b5b17cb48f6e6956b842e"
      ),
    ],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  partialPrefetching: true,
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
