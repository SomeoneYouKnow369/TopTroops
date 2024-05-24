import path from 'path'

export default async (_, argv) => {
  if (argv.mode !== 'development') return {}

  const config = {
    devtool: 'source-map',

    performance: {
      hints: false,
    },

    stats: 'errors-only',

    devServer: {
      compress: true,
      port: 3333,
      host: 'localhost',
      allowedHosts: 'all',
      watchFiles: ['site/**/*'],
    },

    watchOptions: {
      ignored: /node_modules/,
    },
  }

  return config
}
