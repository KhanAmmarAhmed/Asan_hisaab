// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 5173,
//     open: true,
//     proxy: {
//       "/assanhisaab": {
//         target: "https://fisdemoprojects.com",
//         changeOrigin: true,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/assanaccounting/", // ✅ VERY IMPORTANT

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    open: true,
    proxy: {
      "/assanhisaab": {
        target: "https://fisdemoprojects.com",
        changeOrigin: true,
      },
    },
  },
});
