import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

import { Delete } from '@material-ui/icons';

import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { ConfirmationCard } from 'components/ConfirmationCard';
import { Button } from 'component';
import { Update } from '@mui/icons-material';

import { getAdminSubUsers, getMyDetails } from '../../Firebase/admin/index';

export default function AdminList() {
    const { push } = useHistory();

    const [users, setUsers] = useState([]);
    const [adminLevel, setAdminLevel] = useState('');
    const [subUserId, setSubUserId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUserDetail = (id) => {
        let userData = null;
        const userRef = ref(database, `USERS/${id}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            userData = data;
        });
        return userData;
    };

    const getUsers = async () => {
        try {
            const id = await localStorage.getItem('userID');

            const subUsers = await getAdminSubUsers(id);
            setUsers(subUsers);

            const myDetails = await getMyDetails();
            setAdminLevel(myDetails?.adminLevel);
        } catch (error) {
            console.log(error);
        }
    };

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

    const deleteSubUser = async () => {
        setIsVisible(false);
        const userId = await localStorage.getItem('userID');
        if (adminLevel == 1) {
            const userRef = ref(database, `/ADMIN/USERS/${subUserId}`);
            set(userRef, null);
        }
        const subUserRef = ref(database, `/ADMIN/USERS/${userId}/SUB_USERS/${subUserId}`);
        set(subUserRef, null);
        notify(`Your ${adminLevel == 1 ? 'Admin' : 'User'}  Successfully Deleted`, 0);
    };

    return (
        <div className='flex flex-col gap-6'>
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => deleteSubUser()}
                type={adminLevel == 1 ? 'Admin' : 'SubUser'}
            />
            <div className='flex items-center justify-between'>
                <label className='form-check-label' htmlFor='flexCheckChecked'>
                    AdminLevel:{parseInt(adminLevel) + 1}
                </label>
                <Button
                    title={adminLevel == 1 ? 'Create New Admin' : 'Add New User'}
                    onClick={() => onClick(SLUGS.AddAdmin, { id: null })}
                />
            </div>

            <section>
                <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
                    <h5 className='w-[100px]'>No</h5>
                    <h5 className='flex-1'>AdminName</h5>
                    <h5 className='flex-1'>Actions</h5>
                </div>
                {formateData(users) &&
                    formateData(users).map((item, index) => {
                        const data = getUserDetail(item.ID);
                        return (
                            <div
                                className={`flex border ${
                                    index + 1 != formateData(users).length && 'border-b-0'
                                } flex-1 items-center font-bold text-black text-sm ${
                                    index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
                                } p-4`}
                            >
                                <h5 className='w-[100px]'>{index + 1}</h5>
                                <h5 className='flex-1'>{data.email}</h5>
                                <div className='flex items-center gap-10 flex-1 pr-10'>
                                    {adminLevel != 1 ? null : (
                                        <div
                                            className='flex text-blue-700 hover:text-blue-900 items-center gap-2 cursor-pointer'
                                            onClick={() => onClick(SLUGS.AddAdmin, { id: item.ID })}
                                        >
                                            <Update />
                                            <p className='text-sm'>Update Permission</p>
                                        </div>
                                    )}
                                    <Delete
                                        className='text-red-600 cursor-pointer hover:text-red-800'
                                        onClick={() => {
                                            setSubUserId(item.ID);
                                            setIsVisible(true);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </section>
        </div>
    );
}
