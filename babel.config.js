const getIgnore = (env) => {
  const base = ['node_modules'];

  if (env === 'production') {
    return [...base, '**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'];
  }

  return base;
};

module.exports = (api) => {
  const babelEnv = api.env();

  const presets = [
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
  ];

  const plugins = ['@babel/plugin-proposal-optional-catch-binding'];

  const ignore = getIgnore(babelEnv);

  return {
    presets,
    plugins,
    ignore,
  };
};
