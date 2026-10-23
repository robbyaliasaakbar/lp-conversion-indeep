/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './404.html'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#062C3D',
                accent: '#F4A100',
                navy: '#062C3D',
                amber: '#F4A100',
                surface: '#EBF0F4',
                'surface-2': '#E2E9EF',
                'text-body': '#33475B'
            },
            fontFamily: {
                heading: ['Poppins', 'sans-serif'],
                body: ['Inter', 'sans-serif']
            }
        }
    },
    plugins: []
};
