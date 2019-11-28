/**
 * user name:  zjxpdq
 * creation time:  2019/9/17 11:04
 */
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 9318,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true
    // proxy: {}
  },
  configureWebpack: {
    name: 'vue-3.0',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
