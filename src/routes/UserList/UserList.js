import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';

import { formateData } from 'util/formateData';

import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';

import { ConfirmationCard } from 'components/ConfirmationCard';
import { UserCard } from './UserCard';
import { UserTableHeader } from './UserTableHeader';
import { Input } from 'components/Input';
import { deleteUser, restoreUser } from '../../Firebase/user/index';

export default function UserList() {
    const { push } = useHistory();

    const [user, setUsers] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [userDeletionData, setUserDeletionData] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getUserList();
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

    const getUserList = async () => {
        try {
            const id = await localStorage.getItem('userID');
            const userRef = ref(database, `/ADMIN/USERS/${id}`);
            const subUserRef = ref(database, `/ADMIN/USERS/${id}/SUB_USERS`);
            onValue(userRef, (snapshot) => {
                if (snapshot.val()?.adminLevel == '2') {
                    //can only see subUsers data
                    onValue(subUserRef, (snapshot) => {
                        const data = snapshot.val();
                        setUsers(formateData(data));
                    });
                } else if (snapshot.val()?.adminLevel == '1') {
                    //level 1 admin will be able to see all the user data
                    const starCountRef = ref(database, '/USERS');
                    onValue(starCountRef, (snapshot) => {
                        const data = snapshot.val();
                        const user = formateData(data);
                        setUsers(user?.filter((item) => item.isApproved == true));
                    });
                } else {
                    //no need to show this for level3 user
                    onValue(userRef, (snapshot) => {
                        user.push(snapshot.val());
                    });
                }
            });
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

    const userList = user?.filter(
        (item) =>
            (item.isDeleted != true &&
                item?.firstName?.toLowerCase().includes(search.toLowerCase())) ||
            item?.lastName?.toLowerCase().includes(search.toLowerCase())
    );

    const deletedUser = user.filter((item) => item.isDeleted == true);

    const isEmptyList = userList.length === 0 && deletedUser.length === 0;

    return (
        <div className='flex flex-col gap-6'>
            {/* <div className='w-1/2'>
                <Input
                    placeholder={'Search User'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div> */}

            {isEmptyList && (
                <div className='flex h-96 items-center justify-center'>
                    <h1>No User Found</h1>
                </div>
            )}
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => {
                    if (userDeletionData.isDeleted) {
                        restoreUser(userDeletionData.ID);
                    } else {
                        deleteUser(userDeletionData.ID);
                    }
                    setIsVisible(false);
                }}
                type={'User'}
            />
            {userList.length > 0 && (
                <section className='flex flex-col gap-4'>
                    <div className='text-xl font-bold text-black'>Approved Users</div>
                    <UserTableHeader />
                    {userList &&
                        userList.map((itemDetails, index) => {
                            const item = getUserDetail(itemDetails.ID);
                            return (
                                <UserCard
                                    key={'user' + index}
                                    index={index}
                                    totalUsers={userList.length}
                                    photo={item?.photo}
                                    name={item?.firstName + ' ' + item?.lastName}
                                    phoneNumber={item?.phoneNumber}
                                    onViewDetails={() =>
                                        onClick(SLUGS.UserDetail, { id: item?.ID })
                                    }
                                    onDelete={() => {
                                        setUserDeletionData(item);
                                        setIsVisible(true);
                                    }}
                                />
                            );
                        })}
                </section>
            )}
            {deletedUser.length > 0 && (
                <div className='flex flex-col gap-6'>
                    <h2 className='text-xl font-bold text-black'>DeletedUser</h2>
                    <section>
                        <UserTableHeader />
                        {deletedUser &&
                            deletedUser.map((itemDetails, index) => {
                                const item = getUserDetail(itemDetails.ID);

                                return (
                                    <UserCard
                                        key={'deletedUser' + index}
                                        index={index}
                                        name={item?.firstName + ' ' + item?.lastName}
                                        onRestore={() => restoreUser(item.ID)}
                                        onViewDetails={() =>
                                            onClick(SLUGS.UserDetail, { id: item?.ID })
                                        }
                                        phoneNumber={item?.phoneNumber}
                                        photo={item?.photo}
                                        totalUsers={deletedUser.length}
                                    />
                                );
                            })}
                    </section>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
