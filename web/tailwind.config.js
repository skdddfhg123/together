/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      transitionDuration: {
        2000: '2000ms',
      },
      fontFamily: {},
      textShadow: {
        blue: '-2px 0 darkblue, 0 2px darkblue, 2px 0 darkblue, 0 -2px darkblue',
      },
      width: {
        100: '25rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
        200: '48rem',
      },
      height: {
        128: '32rem',
        144: '36rem',
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
          line: '#F2F2F2',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide'), require('tailwindcss-textshadow')],
};
