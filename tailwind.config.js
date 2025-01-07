// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // This tells Tailwind to scan these files for class names
  ],
  theme: {
    extend: {animation: {
      'spin-slow': 'spin 3s linear infinite',
    }},
  },
  plugins: [],
}
