const withPWA = require('next-pwa')

module.exports = withPWA({
  // next-pwa options
  // Add your options here
  dest: 'public', // Directorio donde se guardará el service worker
  disable: process.env.NODE_ENV === 'development', // Deshabilitar en desarrollo
  // Optional options
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for the next service worker update
  reloadOnUpgrade: false, // Don't reload on upgrade
})
module.exports = {
  webpack(config, options) {
    const { isServer } = options
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })

    return config
  },
}
