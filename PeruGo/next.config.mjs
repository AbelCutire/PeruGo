/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.perutourism.com",
      },
      {
        protocol: "https",
        hostname: "castillodechancay.com",
      },
      {
        protocol: "https",
        hostname: "trexperienceperu.com",
      },
    ],
  },
};

// Configuración para importar SVGs como componentes React usando SVGR
const withSvgr = (nextConfig = {}) => {
  return {
    ...nextConfig,
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      });
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config);
      }
      return config;
    },
  };
};

export const experimental = {
  turbo: false,
};

export default withSvgr(nextConfig);
