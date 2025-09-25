/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
