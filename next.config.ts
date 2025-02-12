/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dpctunptgwovyjurqwnn.supabase.co",
        pathname: "/storage/v1/object/public/project/**",
      },
    ],
  },
};

module.exports = nextConfig;
