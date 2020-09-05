const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    options: path.join(__dirname, "src/options.ts"),
    popup: path.join(__dirname, "src/popup.ts"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.pegjs$/,
        loader: 'pegjs-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name]/bundle.js",
    path: path.join(__dirname, "dist"),
  },
};
