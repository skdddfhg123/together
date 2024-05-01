/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {},
      width: {
        128: '32rem',
        160: '40rem',
        200: '48rem',
      },
      height: {
        128: '32rem',
        160: '40rem',
        200: '48rem',
      },
      scale: {
        175: '1.75',
        200: '2.00',
      },
      colors: {
        custom: {
          main: '#0086FF',
          light: '#badfff',
          line: 'rgb(242, 242, 242)',
        },
      },
    },
  },
  plugins: [],
};
