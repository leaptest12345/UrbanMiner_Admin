import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Delete, RemoveRedEye } from '@material-ui/icons';

import ImageModal from 'components/ImageModal/ImageModal';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, update } from 'firebase/database';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';

import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';

import { ConfirmationCard } from 'components/ConfirmationCard';
import { RestorePageSharp } from '@mui/icons-material';

export default function UserList() {
    const { push } = useHistory();

    const [user, setUsers] = useState([]);
    const [deletedUser, setDeletedUser] = useState([]);
    const [adminLevel, setAdminLevel] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [userDeletetionData, setUserDeletionData] = useState(null);

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
                setAdminLevel(snapshot.val().adminLevel);
                if (snapshot.val().adminLevel == '2') {
                    //can only see subusers data
                    onValue(subUserRef, (snapshot) => {
                        const data = snapshot.val();
                        setUsers(formateData(data).filter);
                    });
                } else if (snapshot.val().adminLevel == '1') {
                    //level 1 admin will be able to see all the user data
                    const starCountRef = ref(database, '/USERS');
                    onValue(starCountRef, (snapshot) => {
                        const data = snapshot.val();
                        setUsers(formateData(data).filter((item) => item.isDeleted != true));
                        setDeletedUser(formateData(data).filter((item) => item.isDeleted == true));
                    });
                } else {
                    //no need to show this for level3 user
                    onValue(userRef, (snapshot) => {
                        user.push(snapshot.val());
                        console.log(user);
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

    const onRestore = async (item) => {
        try {
            const id = await localStorage.getItem('userID');
            if (id != item.ID) {
                const starCountRef = ref(database, `/USERS/${item.ID}`);
                if (starCountRef) {
                    update(starCountRef, {
                        isDeleted: false
                    });
                    setTimeout(() => {
                        notify(`User has been Activated Successfully`, !item.isDeleted ? 0 : 1);
                    }, 200);
                }
            } else {
                notify("You can't delete this User", 0);
            }
        } catch (error) {
            console.log('error');
        }
    };

    const onAction = async () => {
        try {
            setIsVisible(false);
            const id = await localStorage.getItem('userID');
            if (id != userDeletetionData.ID) {
                const starCountRef = ref(database, `/USERS/${userDeletetionData.ID}`);
                if (starCountRef) {
                    update(starCountRef, {
                        isDeleted: !userDeletetionData.isDeleted
                    });
                    setTimeout(() => {
                        notify(
                            `User has been ${
                                !userDeletetionData.isDeleted ? 'Deleted' : 'Activated'
                            } Successfully`,
                            !userDeletetionData.isDeleted ? 0 : 1
                        );
                    }, 200);
                }
            } else {
                notify("You can't delete this User", 0);
            }
        } catch (error) {
            console.log('error');
        }
    };
    const users = user?.filter((item) => item.email != undefined);

    return (
        <>
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => onAction()}
                type={'User'}
            />
            <section>
                <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
                    <h5 className='w-[100px]'>No</h5>
                    <h5 className='w-[100px]'>Photo</h5>
                    <div className='flex flex-1 items-center justify-between'>
                        <h5 className='flex-1'>Name</h5>
                        <div className='flex flex-1 items-center justify-between'>
                            <h5 className='flex-1'>PhoneNumber</h5>
                            <h5 className='flex-1'>Actions</h5>
                        </div>
                    </div>
                </div>
                {users &&
                    users.map((itemDetails, index) => {
                        const item = getUserDetail(itemDetails.ID);

                        return (
                            <div
                                className={`flex border ${
                                    index + 1 != users.length && 'border-b-0'
                                } flex-1 items-center font-bold text-black text-sm ${
                                    index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
                                } p-4`}
                            >
                                <h5 className='w-[100px]'>{index + 1}</h5>
                                <h5 className='w-[100px]'>
                                    {item?.photo ? (
                                        <ImageModal
                                            url={item?.photo}
                                            className='w-12 h-12 -ml-2 rounded-full'
                                        />
                                    ) : (
                                        <div className='w-12 h-12  rounded-full'>-----</div>
                                    )}
                                </h5>
                                <div className='flex flex-1 items-center justify-between'>
                                    <h5 className='flex-1'>
                                        {item?.firstName == undefined
                                            ? item?.email ?? '-----'
                                            : item?.firstName + '   ' + item?.lastName}
                                    </h5>
                                    <div className='flex flex-1 items-center justify-between'>
                                        <h5 className='flex-1'>
                                            {item?.phoneNumber
                                                ? (item?.phoneNumber + '').substring(0, 3) +
                                                  '   ' +
                                                  (item?.phoneNumber + '').substring(3, 6) +
                                                  '   ' +
                                                  (item?.phoneNumber + '').substring(6, 10) +
                                                  '   '
                                                : '--- --- --- ----'}
                                        </h5>
                                        <div className='flex-1 flex items-center gap-14'>
                                            <RemoveRedEye
                                                onClick={() =>
                                                    onClick(SLUGS.UserDetail, { id: item?.ID })
                                                }
                                                className='cursor-pointer text-blue-900 hover:text-blue-700'
                                            />
                                            <Delete
                                                onClick={() => {
                                                    setUserDeletionData(item);
                                                    setIsVisible(true);
                                                }}
                                                className='cursor-pointer text-red-600 hover:text-red-800'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </section>
            <h2
                style={{
                    marginTop: 50,
                    marginBottom: 50
                }}
            >
                DeletedUser
            </h2>
            <section>
                <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
                    <h5 className='w-[100px]'>No</h5>
                    <h5 className='w-[100px]'>Photo</h5>
                    <div className='flex flex-1 items-center justify-between'>
                        <h5 className='flex-1'>Name</h5>
                        <div className='flex flex-1 items-center justify-between'>
                            <h5 className='flex-1'>PhoneNumber</h5>
                            <h5 className='flex-1'>Actions</h5>
                        </div>
                    </div>
                </div>
                {deletedUser &&
                    deletedUser.map((itemDetails, index) => {
                        const item = getUserDetail(itemDetails.ID);

                        return (
                            <div
                                className={`flex border ${
                                    index + 1 != users.length && 'border-b-0'
                                } flex-1 items-center font-bold text-black text-sm ${
                                    index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
                                } p-4`}
                            >
                                <h5 className='w-[100px]'>{index + 1}</h5>
                                <h5 className='w-[100px]'>
                                    {item?.photo ? (
                                        <ImageModal
                                            url={item?.photo}
                                            className='w-12 h-12 -ml-2 rounded-full'
                                        />
                                    ) : (
                                        <div className='w-12 h-12  rounded-full'>-----</div>
                                    )}
                                </h5>
                                <div className='flex flex-1 items-center justify-between'>
                                    <h5 className='flex-1'>
                                        {item?.firstName == undefined
                                            ? item?.email ?? '-----'
                                            : item?.firstName + '   ' + item?.lastName}
                                    </h5>
                                    <div className='flex flex-1 items-center justify-between'>
                                        <h5 className='flex-1'>
                                            {item?.phoneNumber
                                                ? (item?.phoneNumber + '').substring(0, 3) +
                                                  '   ' +
                                                  (item?.phoneNumber + '').substring(3, 6) +
                                                  '   ' +
                                                  (item?.phoneNumber + '').substring(6, 10) +
                                                  '   '
                                                : '--- --- --- ----'}
                                        </h5>
                                        <div className='flex-1 flex items-center gap-14'>
                                            <RemoveRedEye
                                                onClick={() =>
                                                    onClick(SLUGS.UserDetail, { id: item?.ID })
                                                }
                                                className='cursor-pointer text-blue-900 hover:text-blue-700'
                                            />
                                            <div
                                                className='flex items-center gap-2 cursor-pointer  text-red-600 hover:text-red-800'
                                                onClick={() => onRestore(item)}
                                            >
                                                <RestorePageSharp className='cursor-pointer' />
                                                <h5>Restore User</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </section>
            <ToastContainer />
        </>
    );
}
