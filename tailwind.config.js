/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js,css}",
  "./views/**/*.ejs",
  "./views/partials/*.ejs",
  "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}