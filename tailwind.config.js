/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        rule: "var(--color-rule)",
        "rule-subtle": "var(--color-rule-subtle)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        "accent-ink": "var(--color-accent-ink)",
        jade: "var(--color-jade)",
        crimson: "var(--color-crimson)",
        spirit: "var(--color-spirit)",
        kinship: "var(--color-kinship)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["var(--font-display)", "var(--font-body)", "Times New Roman", "serif"],
        display: ["var(--font-display)", "var(--font-body)", "Times New Roman", "serif"],
        body: ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "var(--font-body)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
