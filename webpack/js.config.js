export default async (_, argv) => {
  const config = {
    module: {
      rules: [
        {
          test: [/.js$|.ts$/],
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  }

  return config
}
