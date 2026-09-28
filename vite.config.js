import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";

const fullReloadPlugin = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
};

const staticMediaCachePlugin = {
  name: "static-media-cache",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.match(/\.(mp3|wav|ogg|glb|gltf|png|jpg|jpeg|webp)$/i)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
      next();
    });
  },
};

export default defineConfig(({ command, mode }) => {
  const config = {
    base: "/robin/",
    plugins: [
      basicSsl(),
      vue({
        template: {
          compilerOptions: {
            // Allow A-Frame elements to be in Vue template
            isCustomElement: (tag) => tag.startsWith("a-"),
          },
        },
      }),
      fullReloadPlugin,
      staticMediaCachePlugin,
    ],
    resolve: {
      alias: {
        "three": "/src/three.js",
        "@": "/src",
      },
    },
  };

  return config;
});
