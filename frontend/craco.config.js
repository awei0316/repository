// 在文件开头引入 path 模块
const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
};