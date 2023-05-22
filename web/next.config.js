/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", process.env.NEXT_PUBLIC_HOST],
  },
};

module.exports = nextConfig;
