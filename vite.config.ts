import { sveltekit } from "@sveltejs/kit/vite";
import type { PluginOption, UserConfig } from "vite";

const reloadSVGandCSS = (): PluginOption => {
  return {
    name: "reload-svg",
    enforce: "post",
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".svg") || file.endsWith(".css")) {
        console.log("reloading svg file...");

        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
};

const config: UserConfig = {
  plugins: [sveltekit(), reloadSVGandCSS()],
};

export default config;
