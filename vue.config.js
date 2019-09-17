/**
 * user name:  zjxpd
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
    port: 9527,
    open: true,
    overlay: {
      warnings: true,
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
