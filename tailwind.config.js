import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./src/**/*.{js,jsx,ts,tsx,astro}",
    "./node_modules/@uploadthing/react/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
