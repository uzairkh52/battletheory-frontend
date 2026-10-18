/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Ya specific domain jaise 'images.unsplash.com', 'res.cloudinary.com'
      },
    ],
  },
};

module.exports = nextConfig;