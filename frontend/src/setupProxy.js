// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // 代理到 newsapi.org
    app.use(
        '/v2',
        createProxyMiddleware({
            target: 'https://newsapi.org',
            changeOrigin: true,
            pathRewrite: {
                '^/v2': ''
            }
        })
    );

};