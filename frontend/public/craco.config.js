const path = require('path');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "http": require.resolve("stream-http")
                }
            }
        }
    }
};