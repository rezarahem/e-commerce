/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'e-commerce.storage.iran.liara.space'
            }
        ]
    },
}

export default nextConfig;
