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

const plugins = ['@babel/plugin-proposal-object-rest-spread'];

module.exports = { presets, plugins };
