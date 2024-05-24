import HtmlWebpackPlugin from 'html-webpack-plugin'
import utils from './webpack.utils'
import path from 'path'

export default async (/* env, argv */) => {
  const config = {
    module: {
      rules: [
        {
          test: /\.ejs$/i,
          use: ['html-loader', 'template-ejs-loader'],
        },
      ],
    },

    plugins: [
      ...utils.getSites('site').map((filePath) => {
        const ext = path.extname(filePath)
        return new HtmlWebpackPlugin({
          filename: `${filePath.replace('site/', '').replace(ext, '')}.html`,
          template: path.resolve(__dirname, '..', filePath),
        })
      }),
    ],
  }

  return config
}
