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
        email: email,
        userId: userId
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

            notify('User deleted successfully', 1);
        })
        .catch(function (error) {
            notify(
                error?.response?.data?.message ||
                    'An error occurred while deleting the user. Please try again.',
                0
            );
        });
};
