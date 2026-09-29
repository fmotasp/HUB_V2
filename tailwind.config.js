module.exports = {
  content: ["./*.html", "./*.js"],
  darkMode: 'class',
  theme: {
      extend: {
          colors: {
              dark: '#000000',
              surface: '#151515',
              surface2: '#1d1d1f',
              brand: '#2997ff',
              greencta: '#2997ff'
          },
          fontFamily: {
              sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Helvetica Neue"', 'sans-serif'],
              display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
          }
      }
  },
  plugins: [],
}
