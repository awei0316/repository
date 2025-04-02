const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@utils': path.resolve(__dirname, './src/utils')
        },
        resolve: {
            fallback: {
                "path": false
            }
        }
    }
};