import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#D09E1E",
                secondaryText: "#a1a1aa",
            },
            fontFamily: {
                sans: ["var(--font-montserrat)", "sans-serif"],
            },
        },
    },
    plugins: [heroui()],
};

export default config;
