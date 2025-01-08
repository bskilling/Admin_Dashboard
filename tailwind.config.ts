/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    backgroundImage: {
      "login-bg-img": "url('/assets/loginBg.png')",
      "main-bg-img": "url('/assets/appBg.png')",
    },
  },
};
