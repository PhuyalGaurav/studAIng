/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['lh3.googleusercontent.com'],
  },
  webpack(config) {
    // Add a rule to handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: 'html-loader',
    });

    return config; // Return the updated config
  },
};

export default nextConfig;
