module.exports = {
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'pages'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['supabase.com', 'github.com'],
    formats: ['image/webp', 'image/avif'],
  },
  transpilePackages: ['@heroicons/react'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}