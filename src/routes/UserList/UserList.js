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
import { deleteUser, getAllMyUsers, restoreUser } from '../../Firebase/user/index';
import { deleteUserPermanently, removeDuplicatesById } from './utils';

export default function UserList() {
    const { push } = useHistory();

    const [user, setUsers] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isPermanentDelete, setIsPermanentDelete] = useState(false);
    const [deleteUserData, setDeleteUserData] = useState({
        email: '',
        userId: ''
    });
    const [userDeletionData, setUserDeletionData] = useState(null);
    const [search, setSearch] = useState('');

    const [selectedUser1Id, setSelectedUser1Id] = useState(null);
    const [selectedUser2Id, setSelectedUser2Id] = useState(null);

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

            console.log('my admin id', id);
            const userRef = ref(database, `/ADMIN/USERS/${id}`);
            const subUserRef = ref(database, `/ADMIN/USERS/${id}/SUB_USERS`);
            onValue(userRef, (snapshot) => {
                if (snapshot.val()?.adminLevel == '2') {
                    //can only see subUsers data
                    onValue(subUserRef, async (snapshot) => {
                        const data = formateData(snapshot.val());

                        let userAndSubUsers = await Promise.all(
                            data.map(async (userDetail) => {
                                const allUserLevel2 = await getAllMyUsers(userDetail?.ID);

                                const subUsersLevel2 = await Promise.all(
                                    allUserLevel2
                                        .filter((user) => user?.userLevel !== 3)
                                        .map(async (user) => {
                                            const allUserLevel3 = await getAllMyUsers(user?.ID);

                                            return {
                                                ...user,
                                                subUsers: removeDuplicatesById(allUserLevel3)
                                            };
                                        })
                                );

                                return {
                                    ...userDetail,
                                    subUsers: removeDuplicatesById(subUsersLevel2)
                                };
                            })
                        );

                        setUsers(userAndSubUsers?.filter((item) => item?.isApproved === true));
                    });
                } else if (snapshot.val()?.adminLevel == '1') {
                    //level 1 admin will be able to see all the user data
                    const starCountRef = ref(database, '/USERS');
                    onValue(starCountRef, async (snapshot) => {
                        const data = formateData(snapshot.val());

                        let userAndSubUsers = await Promise.all(
                            data.map(async (userDetail) => {
                                const allUserLevel2 = await getAllMyUsers(userDetail?.ID);

                                const subUsersLevel2 = await Promise.all(
                                    allUserLevel2
                                        .filter((user) => user?.userLevel !== 3)
                                        .map(async (user) => {
                                            const allUserLevel3 = await getAllMyUsers(user?.ID);

                                            return {
                                                ...user,
                                                subUsers: removeDuplicatesById(allUserLevel3)
                                            };
                                        })
                                );

                                return {
                                    ...userDetail,
                                    subUsers: removeDuplicatesById(subUsersLevel2)
                                };
                            })
                        );

                        setUsers(userAndSubUsers?.filter((item) => item?.isApproved === true));
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
            item.isDeleted != true &&
            item?.userLevel != 2 &&
            item?.userLevel != 3 &&
            (item?.firstName?.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
                item?.lastName?.toLowerCase().trim().includes(search.toLowerCase().trim()))
    );

    const deletedUser = user.filter(
        (item) => item.isDeleted == true && item?.userLevel != 2 && item?.userLevel != 3
    );

    const isEmptyList = userList.length === 0 && deletedUser.length === 0;

    return (
        <div className='flex flex-col gap-6'>
            <div className='w-1/2'>
                <Input
                    placeholder={'Search User'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

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
                            const subUsers2 = itemDetails?.subUsers;

                            const subUserLength = subUsers2?.length;

                            const name = item?.firstName + ' ' + item?.lastName;

                            const leftIndex = index + 1;
                            return (
                                <>
                                    <UserCard
                                        isOpen={selectedUser1Id === item.ID}
                                        key={'user' + index}
                                        index={index}
                                        totalUsers={userList?.length}
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
                                        onOpenSubUser={
                                            subUserLength === 0
                                                ? undefined
                                                : () => {
                                                      if (selectedUser1Id === item.ID) {
                                                          setSelectedUser1Id(null);
                                                      } else {
                                                          setSelectedUser1Id(item?.ID);
                                                      }
                                                  }
                                        }
                                    />
                                    {selectedUser1Id === item.ID && subUsers2?.length > 0 ? (
                                        <>
                                            <div className='text-base my-4 font-bold'>
                                                {name} - Sub User
                                            </div>
                                            {subUsers2?.map((subUser, index) => {
                                                const subUserItem = getUserDetail(subUser.ID);
                                                const subUsers3 = subUser?.subUsers;

                                                const name =
                                                    subUserItem?.firstName +
                                                    ' ' +
                                                    subUserItem?.lastName;

                                                const leftIndex2 = index + 1;

                                                return (
                                                    <div>
                                                        <UserCard
                                                            type={'user2'}
                                                            leftIndex={leftIndex}
                                                            key={'subUser' + index}
                                                            index={index}
                                                            totalUsers={subUsers2.length}
                                                            photo={subUserItem?.photo}
                                                            name={
                                                                subUserItem?.firstName +
                                                                ' ' +
                                                                subUserItem?.lastName
                                                            }
                                                            phoneNumber={subUserItem?.phoneNumber}
                                                            onViewDetails={() =>
                                                                onClick(SLUGS.UserDetail, {
                                                                    id: subUserItem?.ID
                                                                })
                                                            }
                                                            onDelete={() => {
                                                                setUserDeletionData(subUserItem);
                                                                setIsVisible(true);
                                                            }}
                                                        />

                                                        {subUsers3?.length > 0 ? (
                                                            <>
                                                                <div className='text-base my-4 font-bold'>
                                                                    {name} - Sub User
                                                                </div>
                                                                {subUsers3?.map(
                                                                    (subUser3, index) => {
                                                                        const subUserItem3 =
                                                                            getUserDetail(
                                                                                subUser3.ID
                                                                            );

                                                                        return (
                                                                            <UserCard
                                                                                leftIndex={`${leftIndex}-${leftIndex2}`}
                                                                                key={
                                                                                    'subUser3' +
                                                                                    index
                                                                                }
                                                                                type={'user3'}
                                                                                index={index}
                                                                                totalUsers={
                                                                                    subUsers3.length
                                                                                }
                                                                                photo={
                                                                                    subUserItem3?.photo
                                                                                }
                                                                                name={
                                                                                    subUserItem3?.firstName +
                                                                                    ' ' +
                                                                                    subUserItem3?.lastName
                                                                                }
                                                                                phoneNumber={
                                                                                    subUserItem3?.phoneNumber
                                                                                }
                                                                                onViewDetails={() =>
                                                                                    onClick(
                                                                                        SLUGS.UserDetail,
                                                                                        {
                                                                                            id: subUserItem3?.ID
                                                                                        }
                                                                                    )
                                                                                }
                                                                                onDelete={() => {
                                                                                    setUserDeletionData(
                                                                                        subUserItem3
                                                                                    );
                                                                                    setIsVisible(
                                                                                        true
                                                                                    );
                                                                                }}
                                                                            />
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : null}
                                </>
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
                                    <>
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
                                            onDelete={() => {
                                                setDeleteUserData({
                                                    email: item.email,
                                                    userId: item.ID
                                                });
                                                setIsPermanentDelete(true);
                                            }}
                                        />
                                    </>
                                );
                            })}
                    </section>
                </div>
            )}
            <ConfirmationCard
                isVisible={isPermanentDelete}
                onClose={() => setIsPermanentDelete(false)}
                onDelete={async () => {
                    await deleteUserPermanently(deleteUserData);
                    setIsPermanentDelete(false);
                }}
                type={'User Permanently'}
            />
            <ToastContainer />
        </div>
    );
}
