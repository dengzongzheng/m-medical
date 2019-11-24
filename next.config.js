const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass')
const path = require('path');
const isDevMode = process.env.NODE_ENV === 'development';
const serverBaseUrl = isDevMode ? 'http://127.0.0.1:9080' : 'http://api.sswjjd.cn';
const basicAuthorization = isDevMode ? 'Y2xpZW50XzE6MTIzNDU2' : 'Y2xpZW50XzE6MTIzNDU2';


module.exports = withCSS(withLess(withSass({
    distDir: 'dist',
    compress:true,
    cssModules: false,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
    },
    devIndicators: {
        autoPrerender: false,
    },
    pageExtensions: ['jsx', 'js'],
    evn: {
        customKey: 'value',
    },
    webpack(config, options) {
        config.resolve.alias['components'] = path.join(__dirname, 'components');
        config.resolve.alias['constants'] = path.join(__dirname, 'constants');
        config.resolve.alias['request'] = path.join(__dirname, 'request');
        config.resolve.alias['store'] = path.join(__dirname, 'store');
        config.resolve.alias['util'] = path.join(__dirname, 'util');
        return config;
    },
    //这里的配置既可以服务端获取到，也可以在浏览器端获取到
    publicRuntimeConfig: {
        serverBaseUrl: serverBaseUrl,
        basicAuthorization:basicAuthorization,
        rootDir: path.join(__dirname, './'),
        PORT: isDevMode ? 3006 : (process.env.PORT || 9081)
    }
})));

