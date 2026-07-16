/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/taxonomy", destination: "/history", permanent: true },
    ];
  },
};
export default nextConfig;
