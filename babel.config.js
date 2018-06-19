module.exports = (api) => {
  const babelEnv = api.env();

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          debug: babelEnv === 'development',
        },
      ],
      '@babel/preset-typescript',
    ],
  };
};
