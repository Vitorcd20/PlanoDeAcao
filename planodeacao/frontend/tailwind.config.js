// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-dark': 'var(--color-green-dark)',
        'green-base': 'var(--color-green-base)',
        'green-light': 'var(--color-green-light)',
      },
    },
  },
  plugins: [],
}
