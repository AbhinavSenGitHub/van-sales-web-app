/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#00AB55",
                "primary-dark": "#007B55",
                "text-main": "#212B36",
                "text-secondary": "#637381",
                "bg-main": "#F4F6F8",
                "bg-card": "#FFFFFF",
                error: "#FF4842",
            },
            boxShadow: {
                'premium': '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
            }
        },
    },
    plugins: [],
}
