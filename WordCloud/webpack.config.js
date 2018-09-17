const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebPackPlugin({
  template: path.join(__dirname, './src/index.html'),
  filename: 'index.html'
})


module.exports = {
  mode: 'development',
  plugins: [
    htmlPlugin
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', "postcss-loader", 'sass-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            outputPath: 'images'
          }
        }]
      }
    ]
  }
}