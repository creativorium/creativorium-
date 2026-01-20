/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker/Cloud Run deployments
  // Comment this out if using Firebase Hosting with static export
  output: 'standalone'
}

module.exports = nextConfig
