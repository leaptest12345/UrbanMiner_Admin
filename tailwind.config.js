/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                brightBlue: '#3498db',
                darkGrayishBlue: '#8b8d94',
                darkRed: '#a90000',
                grayishBlue: '#A4A6B3',
                grayishBlue2: '#9fa2b4',
                grayishBlue3: '#bdc3c7',
                lightBlue: '#3751FF',
                lightGrayishBlue: '#F7F8FC',
                lightGrayishBlue2: '#DFE0EB',
                paleBlue: '#DDE2FF',
                paleBlueTransparent: 'rgba(221, 226, 255, 0.08)',
                veryDarkGrayishBlue: '#373a47'
            }
        }
    },
    plugins: []
};
