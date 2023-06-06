// It is handy to not have those transformations while we developing
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano'),
    // More postCSS modules here if needed
  ]
}