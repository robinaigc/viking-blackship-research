import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Viking Blackship",
    short_name: "Viking Blackship",
    description: "Evidence-based analysis on China's economy and policy signals.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [{ src: "/favicon.png", sizes: "241x241", type: "image/png" }],
  };
}
