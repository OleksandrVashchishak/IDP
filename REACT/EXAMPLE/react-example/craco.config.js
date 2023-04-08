const CracoLessPlugin = require('craco-less');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@font-family': "'Manrope', sans-serif",
              '@primary-color': '#1F803F',
              '@border-radius-base': '4px',
              '@primary-1': '#E9F2EC',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: new AntdDayjsWebpackPlugin(),
    },
  ],
};
