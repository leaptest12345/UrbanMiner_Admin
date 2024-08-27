import { notify } from 'util/notify';
import axios from 'axios';

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

export const deleteUserPermanently = async ({ email, userId }) => {
    var data = JSON.stringify({
        email: 'referraluser3@gmail.com',
        userId: '16456645-add0-4fdc-aa17-b9dd5ae14056'
    });

    var config = {
        method: 'post',
        url: 'https://urbanminer-web.vercel.app/api/deleteUser',
        headers: {
            'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
};
