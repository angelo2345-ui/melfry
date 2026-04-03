module.exports = {
  style: {
    postcss: {
      mode: "file"
    }
  },
  devServer: (devServerConfig) => {
    return {
      ...devServerConfig,
      hot: true,
      liveReload: true
    };
  },
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === "development") {
        const webpack = require("webpack");
        const hasHmrPlugin =
          Array.isArray(webpackConfig.plugins) &&
          webpackConfig.plugins.some((plugin) => plugin instanceof webpack.HotModuleReplacementPlugin);

        if (!hasHmrPlugin) {
          webpackConfig.plugins = [...(webpackConfig.plugins ?? []), new webpack.HotModuleReplacementPlugin()];
        }
      }

      webpackConfig.watchOptions = {
        ...(webpackConfig.watchOptions ?? {}),
        ignored: ["**/node_modules/**", "**/pagefile.sys"]
      };

      return webpackConfig;
    }
  }
};
