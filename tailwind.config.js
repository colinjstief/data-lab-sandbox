/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#294b71",
        "secondary-blue": "#39A0ED",
        "primary-green": "#db2828",
        "primary-salmon": "#f2711c",
      },
    },
  },
  plugins: [],
};
