/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '290px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      xxl: '1350px',
      xxxl: '1400px'
    },
    extend: {
      boxShadow: {
        custom:
          'inset 0 20px 20px -20px rgba(0, 0, 0, 0.9), inset 0 -20px 20px -20px rgba(0, 0, 0, 0.9)'
      },
      colors: {
        brown: '#40280A',
        darkBrown: '#40280A',
        lightBrown: '#906C56'
      }
    }
  },
  plugins: []
};
