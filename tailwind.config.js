/**@type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#4ECDC4",
        dark: "#1E1E2F",
        accent: "#FF6b6b",
      },
      boxShadow: {
        neon: "0 0 10px #4ecdc4, 0 0 20px #4ecdc4",
      },
    },
  },
  plugins: [],
};
