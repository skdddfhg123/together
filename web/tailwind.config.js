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
        88: '22rem',
        100: '25rem',
        114: '28.5rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
        200: '48rem',
      },
      height: {
        88: '22rem',
        100: '25rem',
        114: '28.5rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
        200: '48rem',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
      },
      scale: {
        175: '1.75',
        200: '2.00',
      },
      colors: {
        custom: {
          main: '#0120c9',
          light: '#badfff',
          line: '#F2F2F2',
          yellow: '#FDDE55',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide'), require('tailwindcss-textshadow')],
};
