/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output when building inside Docker (set DOCKER_BUILD=true).
  // Vercel and Netlify deployments should leave this unset.
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
