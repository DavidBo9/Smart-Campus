/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'ibero-red': '#C8102E',
          'ibero-dark-red': '#9A0C23',
          'ibero-beige': '#F4F1EA',
          'ibero-yellow': '#FFD100',
        },
        fontFamily: {
          serif: ['Times New Roman', 'serif'],
        },
      },
    },
    plugins: [],
  }