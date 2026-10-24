/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#3A0A1E',
          dark: '#3A0A1E',
          light: '#5A1030',
          hover: '#4C0D28',
          subtle: '#280614',
        },
        gold: {
          DEFAULT: '#D4A85A',
          light: '#E8C887',
          dark: '#D4A85A',
          shimmer: '#F4DEB2',
          muted: '#C49848',
        },
        cream: {
          DEFAULT: '#FFF8F0',
          50: '#FFFDFC',
          100: '#FFF8F0',
          200: '#FBF0E2',
          300: '#F5E4CE',
        },
        brandText: {
          DEFAULT: '#2B1A1F',
          dark: '#1C1014',
          muted: '#6A565C',
          light: '#917C83',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        body: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(58, 10, 30, 0.15)',
        'gold-glow': '0 0 25px rgba(232, 200, 135, 0.45)',
        'maroon-glow': '0 0 30px rgba(90, 16, 48, 0.35)',
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, #3A0A1E 0%, #5A1030 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E8C887 0%, #D4A85A 100%)',
        'subtle-cream': 'linear-gradient(180deg, #FFF8F0 0%, #FFFDF9 100%)',
      },
    },
  },
  plugins: [],
}
