const presets = [
  [
    '@babel/env',
    {
      targets: {
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
      },
      useBuiltIns: 'usage',
    },
  ],
];

const plugins = [
  [
    'babel-plugin-dotenv',
    {
      replacedModuleName: 'babel-dotenv',
    },
  ],
];

module.exports = { presets, plugins };
