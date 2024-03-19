export const formateData = (value) => {
    const isArray = Array.isArray(value);
    if (isArray) {
        const newArr = value.filter((item) => item);
        return newArr;
    } else {
        let arr = [];
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                let data = value[key];

                arr.push(data);
            }
        }
        const newArr = arr.filter((item) => item);
        return newArr;
    }
};
