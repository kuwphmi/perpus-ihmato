import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    headers: {
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com data:;
        frame-src https://app.sandbox.midtrans.com;
        connect-src *;
        img-src * data:;
      `.replace(/\n/g, " "),
    },
  },
});