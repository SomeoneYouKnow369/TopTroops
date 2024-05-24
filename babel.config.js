function isBabelRegister(caller) {
  return !!(caller && caller.name === '@babel/register')
}

module.exports = (api) => {
  const isRegister = api.caller(isBabelRegister)
  api.cache(true)

  if (isRegister) {
    return {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: true,
            },
            debug: false,
          },
        ],
      ],
    }
  }

  return {
    presets: ['@babel/preset-env', '@babel/typescript'],
  }
}
