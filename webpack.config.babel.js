import { merge } from 'webpack-merge'
import path from 'path'

import styleConfig from './webpack/style.config'
import jsConfig from './webpack/js.config'
import htmlConfig from './webpack/html.config'
import devConfig from './webpack/dev.config'

module.exports = async (env, argv) => {
  let config = {
    entry: {
      main: './js/index.js',
      skiplinks: './js/skiplinks.js'
    },

    output: {
      path: path.resolve(__dirname, 'docs'),
      clean: true,
    },

    performance: {
      hints: 'warning',
    },

    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
  }

  config = merge(
    {},
    config,
    await styleConfig(env, argv),
    await jsConfig(env, argv),
    await htmlConfig(env, argv),
    await devConfig(env, argv)
  )

  return config
}
