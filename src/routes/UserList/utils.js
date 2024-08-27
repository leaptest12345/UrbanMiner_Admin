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
    try {
        const response = await axios.post('https://urbanminer-web.vercel.app/api/deleteUser', {
            email,
            userId
        });

        if (response.status === 200) {
            notify('User Deleted Successfully!', 1);
        } else {
            console.log('Unexpected status code:', response.status);
            notify('Failed to delete user. Please try again.', 0);
        }
    } catch (error) {
        console.log('Error deleting user:', error);
        notify(
            error?.response?.data?.message ||
                'An error occurred while deleting the user. Please try again later.',
            0
        );
    }
};
