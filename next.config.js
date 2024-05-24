/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "api.mapbox.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["knex"],
  },
};

module.exports = nextConfig;
