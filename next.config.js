/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:8800/api/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:8802/api/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8805/user/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 