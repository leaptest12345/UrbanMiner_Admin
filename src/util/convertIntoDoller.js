export const convertIntoDoller = (price) => {
    let formatting_options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    };
    let numberWithDollar = price.toLocaleString('en-US', formatting_options);
    return numberWithDollar;
};
