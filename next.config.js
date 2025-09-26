const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/types': path.resolve(__dirname, './types'),
    };
    return config;
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img-c.udemycdn.com' },
      { protocol: 'https', hostname: 'udemy-images.udemy.com' },
      { protocol: 'https', hostname: 'udemycdn.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  async redirects() {
    return [
      // WordPress categories -> Next.js category filter
      // e.g. /courses/development/ -> /?category=development
      {
        source: '/courses/:category/',
        destination: '/?category=:category',
        permanent: true,
      },
      {
        source: '/courses/:category',
        destination: '/?category=:category',
        permanent: true,
      },
      // WordPress subcategories -> Next.js category + search hint (q)
      // e.g. /courses/development/web-development/ -> /?category=development&q=web-development
      {
        source: '/courses/:category/:sub/',
        destination: '/?category=:category&q=:sub',
        permanent: true,
      },
      {
        source: '/courses/:category/:sub',
        destination: '/?category=:category&q=:sub',
        permanent: true,
      },
      // NOTE for post permalinks like /sample-post/:
      // We recommend a middleware-based redirect that checks if :slug is a known deal slug
      // and 301-redirects to /deal/:slug. This avoids colliding with real app routes.
    ];
  },
};

module.exports = nextConfig;
