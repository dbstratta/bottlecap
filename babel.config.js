const getIgnoreOption = (env) => {
  const base = ['node_modules'];

  if (env === 'production') {
    return [...base, '**/*.spec.ts', '**/*.test.ts', '**/*.d.ts'];
  }

  return base;
};

module.exports = (api) => {
  const babelEnv = api.env();

  const debug = !!process.env.DEBUG;
  const useBuiltIns = false;

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        debug,
        useBuiltIns,
      },
    ],
    '@babel/preset-typescript',
  ];

  const plugins = ['@babel/plugin-proposal-optional-catch-binding', 'dynamic-import-node'];

  const ignore = getIgnoreOption(babelEnv);

  return {
    presets,
    plugins,
    ignore,
  };
};
