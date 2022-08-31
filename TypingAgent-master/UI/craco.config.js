const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#8B64BD",
              // "@border-radius-base": "14px"
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
