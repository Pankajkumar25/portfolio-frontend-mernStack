/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion", "swiper"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://portpofilio-backend-mern.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
