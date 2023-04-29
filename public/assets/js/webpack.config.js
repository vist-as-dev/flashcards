const path = require('path')

module.exports = {
    entry: './index.js',
    module: {
        rules: [
            { test: /\.svg$/, use: 'svg-inline-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.(js)$/, use: 'babel-loader' }
        ]
    },
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'script.js'
    },
    // mode: 'development'
    mode: 'production'
}