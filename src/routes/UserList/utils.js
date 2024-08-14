export const removeDuplicatesById = (array) => {
    const uniqueItems = array.reduce((accumulator, current) => {
        const exists = accumulator.find((item) => item.ID === current.ID);
        if (!exists) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);
    return uniqueItems;
};
