import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    httpAgentOptions: {
        keepAlive: true,
    },
};

export default nextConfig;
