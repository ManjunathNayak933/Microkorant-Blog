/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
