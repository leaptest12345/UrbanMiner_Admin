import { Input } from 'components/Input';
import { approveUser, getUserListByAdminLevel } from '../../Firebase/user/index';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import slugs from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import { UserCard } from 'routes/UserList/UserCard';
import { UserTableHeader } from 'routes/UserList/UserTableHeader';
import { onValue, ref } from 'firebase/database';
import { formateData } from 'util/formateData';
import { database } from 'configs';

export const UnApprovedUserList = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const { push } = useHistory();

    useEffect(() => {
        getUserList();
    }, []);

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
                        setUsers(user);
                    });
                } else {
                    //no need to show this for level3 user
                    onValue(userRef, (snapshot) => {
                        users.push(snapshot.val());
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    // const getInitialData = async () => {
    //     const userList = await getUserListByAdminLevel();
    //     setUnApprovedList(userList?.filter((item) => item?.isApproved === false));
    // };

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

    const unApprovedList = users?.filter(
        (item) => item?.isApproved == false && item?.userLevel != 2 && item?.userLevel != 3
    );

    const filteredList = unApprovedList.filter((item) => {
        return (
            item?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
            item?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
            item?.email?.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className='flex flex-col gap-6'>
            {/* <div className='w-1/2'>
                <Input
                    value={search}
                    placeholder={'Search user'}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div> */}
            <UserTableHeader />
            {filteredList.length === 0 && (
                <div className='flex flex-1 items-center justify-center'>
                    <h1>No User Found</h1>
                </div>
            )}
            {filteredList.map((item, index) => {
                return (
                    <UserCard
                        key={'user' + index}
                        index={index}
                        totalUsers={filteredList.length}
                        photo={item?.photo}
                        name={item?.firstName + ' ' + item?.lastName}
                        phoneNumber={item?.phoneNumber}
                        onViewDetails={() => onClick(slugs.UserDetail, { id: item?.ID })}
                        // onApprove={async () => await approveUser(item?.ID)}
                    />
                );
            })}
        </div>
    );
};
