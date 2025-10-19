/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.perutourism.com",
      },
      {
        protocol: "https",
        hostname: "castillodechancay.com",
      },
      {
        protocol: "https",
        hostname: "trexperienceperu.com",
      },
    ],
  },
};

export default nextConfig;
