/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./App.tsx",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./contexts/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#197FE6",
                secondary: "#0E141B",
                tertiary: "#4E7397",
            },
            fontFamily: {
                "jakarta-el": ["Jakarta-ExtraLight"],
                "jakarta-light": ["Jakarta-Light"],
                jakarta: ["Jakarta-Regular"],
                "jakarta-medium": ["Jakarta-Medium"],
                "jakarta-semibold": ["Jakarta-SemiBold"],
                "jakarta-bold": ["Jakarta-Bold"],
                "jakarta-extrabold": ["Jakarta-ExtraBold"],
            },
        },
    },
    plugins: [],
}