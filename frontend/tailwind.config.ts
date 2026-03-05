import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        card:   "var(--radius-card)",
        button: "var(--radius-button)",
        lg:     "var(--radius-card)",
        xl:     "calc(var(--radius-card) + 4px)",
        "2xl":  "calc(var(--radius-card) + 8px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        /* ── brand palette (RGB channel tokens) ── */
        "color-background":    "rgb(var(--color-background) / <alpha-value>)",
        "color-surface":       "rgb(var(--color-surface) / <alpha-value>)",
        "color-border-subtle": "rgb(var(--color-border-subtle) / <alpha-value>)",
        "color-primary":       "rgb(var(--color-primary) / <alpha-value>)",
        "color-primary-dark":  "rgb(var(--color-primary-dark) / <alpha-value>)",
        "color-secondary":     "rgb(var(--color-secondary) / <alpha-value>)",
        "color-text-main":     "rgb(var(--color-text-main) / <alpha-value>)",
        "color-text-muted":    "rgb(var(--color-text-muted) / <alpha-value>)",
        "color-text-faint":    "rgb(var(--color-text-faint) / <alpha-value>)",
        "color-success":       "rgb(var(--color-success) / <alpha-value>)",
        "color-warning":       "rgb(var(--color-warning) / <alpha-value>)",
        "color-danger":        "rgb(var(--color-danger) / <alpha-value>)",

        /* ── semantic tokens (alpha-aware) ── */
        background:              "rgb(var(--background) / <alpha-value>)",
        foreground:              "rgb(var(--foreground) / <alpha-value>)",

        card:                    "rgb(var(--card) / <alpha-value>)",
        "card-foreground":       "rgb(var(--card-foreground) / <alpha-value>)",

        popover:                 "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground":    "rgb(var(--popover-foreground) / <alpha-value>)",

        primary:                 "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground":    "rgb(var(--primary-foreground) / <alpha-value>)",

        secondary:               "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground":  "rgb(var(--secondary-foreground) / <alpha-value>)",

        muted:                   "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground":      "rgb(var(--muted-foreground) / <alpha-value>)",

        accent:                  "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground":     "rgb(var(--accent-foreground) / <alpha-value>)",

        destructive:             "rgb(var(--destructive) / <alpha-value>)",
        "destructive-foreground":"rgb(var(--destructive-foreground) / <alpha-value>)",

        border: "rgb(var(--border) / <alpha-value>)",
        input:  "rgb(var(--input) / <alpha-value>)",
        ring:   "rgb(var(--ring) / <alpha-value>)",

        sidebar:              "rgb(var(--sidebar) / <alpha-value>)",
        "sidebar-foreground": "rgb(var(--sidebar-foreground) / <alpha-value>)",
        "sidebar-border":     "rgb(var(--sidebar-border) / <alpha-value>)",
        "sidebar-ring":       "rgb(var(--sidebar-ring) / <alpha-value>)",

        /* ── legacy hex tokens (kept for backwards compat) ── */
        align: {
          bg:       "var(--align-bg)",
          surface:  "var(--color-surface)",
          accent:   "var(--color-primary)",
          metallic: "#C8C8C8",
          text:     "var(--color-text-main)",
          muted:    "var(--color-text-muted)",
        },
      },
      backgroundImage: {
        "grid-palantir":
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
      },
      boxShadow: {
        panel: "0 12px 30px rgba(0,0,0,.45)",
      },
    },
  },
  plugins: [],
};
export default config;
