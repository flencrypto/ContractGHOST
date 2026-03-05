/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output when building inside Docker (set DOCKER_BUILD=true).
  // Netlify and other non-Docker hosts should leave this unset.
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
};

export default nextConfig;
