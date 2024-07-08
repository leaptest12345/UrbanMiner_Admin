const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomElement = (array) => array[randomInt(0, array.length - 1)];

const placeholder = '#';

export const generateOne = ({ pattern, charset, prefix, postfix }) => {
    // Uses for_of loop for performance reasons
    let code = '';
    for (const p of pattern) {
        const c = p === placeholder ? randomElement(charset) : p;
        code += c;
    }

    return `${prefix}-${code}-${postfix}`;
};
