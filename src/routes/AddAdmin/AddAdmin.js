import React, { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import { database } from 'configs/firebaseConfig';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { onValue, ref, set, update } from 'firebase/database';

import { notify } from 'util/notify';
import { Input } from 'components/Input';
import { Button } from 'component';
import { PermissionCard } from './_Components';
import { useFormik } from 'formik';

import { findAdminByEmail, getAdmin, getMyDetails } from '../../Firebase/Database/admin/index';
import { findUserByEmail } from '../../Firebase/Database/user/index';

export default function AddAdmin(props) {
    const history = useHistory();
    const { id } = props.location.state;

    const [adminDetails, setAdminDeails] = useState(null);
    const [adminLevel, setAdminLevel] = useState(0);

    useEffect(() => {
        getUsers();
        if (id) {
            getAdminDetails(id);
        }
    }, []);

    const getAdminDetails = async (id) => {
        const data = await getAdmin(id);
        setAdminDeails(data);
    };

    const permissionStatus = adminDetails?.role?.PermissionStatus;

    const formik = useFormik({
        initialValues: {
            email: adminDetails?.email || '',
            password: adminDetails?.password || '',
            userPermission: permissionStatus?.user || false,
            itemPermission: permissionStatus?.item || false,
            paymentPermission: permissionStatus?.payment || false,
            feedbackPermission: permissionStatus?.feedback || false,
            termPermission: permissionStatus?.term || false,
            privacyPermission: permissionStatus?.privacy || false,
            adminPermission: permissionStatus?.addAdmin || false,
            pdfDetailPermission: permissionStatus?.pdfDetail || false,
            priceSheetPermission: permissionStatus?.priceSheet || false,
            addProduct: permissionStatus?.addProduct || false
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log(values);
        }
    });

    const getUsers = async () => {
        try {
            const myData = getMyDetails();
            setAdminLevel(myData.adminLevel);
        } catch (error) {}
    };

    const createAdmin = async () => {
        try {
            const email = formik.values.email;
            const password = formik.values.password;
            const userPermission = formik.values.userPermission;
            const itemPermission = formik.values.itemPermission;
            const paymentPermission = formik.values.paymentPermission;
            const feedbackPermission = formik.values.feedbackPermission;
            const termPermission = formik.values.termPermission;
            const privacyPermission = formik.values.privacyPermission;
            const adminPermission = formik.values.adminPermission;
            const pdfDetailPermission = formik.values.pdfDetailPermission;
            const priceSheetPermission = formik.values.priceSheetPermission;
            const addProduct = formik.values.addProduct;

            const admin = findAdminByEmail(email);

            if (admin) {
                const subUser = await findUserByEmail(email);
                const subUserID = subUser ? subUser.ID : null;

                //check if user exist or not
                if (subUser?.ID) {
                    //if user  exist
                    const id = await localStorage.getItem('userID');
                    const userDetailRef = ref(database, `/USERS/${subUserID}`);
                    onValue(userDetailRef, async (snapShot) => {
                        const userRef = ref(database, `/ADMIN/USERS/${id}/SUB_USERS/${subUserID}`);
                        set(userRef, {
                            ID: subUserID,
                            email: email
                        });
                        if (adminLevel == 1) {
                            //only add admin2 in the adminlist admin3 is user so no need to add them in adminlist
                            const refDetail = ref(database, `/ADMIN/USERS/${subUserID}`);
                            await set(refDetail, {
                                ID: subUserID,
                                email: email,
                                adminLevel: parseInt(adminLevel) + 1,
                                role: {
                                    roleName: 'admin',
                                    PermissionStatus: {
                                        user: userPermission,
                                        item: itemPermission,
                                        payment: paymentPermission,
                                        privacy: privacyPermission,
                                        term: termPermission,
                                        addAdmin: adminLevel == 2 ? false : adminPermission,
                                        feedback: feedbackPermission,
                                        addProduct: addProduct,
                                        pdfDetail: pdfDetailPermission,
                                        priceSheet: priceSheetPermission
                                    }
                                }
                            });
                        }
                        notify(`New ${adminLevel == 1 ? 'Admin' : 'User'} has been created!`, 1);
                        setTimeout(() => {
                            history.goBack();
                        }, 1000);
                    });
                } else {
                    if (password) {
                        const auth = getAuth();
                        try {
                            //add new user
                            await createUserWithEmailAndPassword(auth, email, password);
                            const userUniqueID = uuid();
                            const userDetailRef = ref(database, `USERS/${userUniqueID}`);
                            set(userDetailRef, {
                                ID: userUniqueID,
                                email: email,
                                isDeleted: false,
                                firstName: email,
                                lastName: '',
                                photo: '',
                                photoName: '',
                                phoneNumber: '',
                                isApproved: true,
                                cca2: 'US',
                                countryCode: '1'
                            });

                            const id = await localStorage.getItem('userID');
                            const userRef = ref(
                                database,
                                `/ADMIN/USERS/${id}/SUB_USERS/${userUniqueID}`
                            );
                            set(userRef, {
                                ID: userUniqueID,
                                email: email
                            });

                            if (adminLevel == 1) {
                                const refDetail = ref(database, `/ADMIN/USERS/${userUniqueID}`);
                                await set(refDetail, {
                                    ID: userUniqueID,
                                    email: email,
                                    adminLevel: parseInt(adminLevel) + 1,
                                    role: {
                                        roleName: 'admin',
                                        PermissionStatus: {
                                            user: userPermission,
                                            item: itemPermission,
                                            payment: paymentPermission,
                                            privacy: privacyPermission,
                                            term: termPermission,
                                            addAdmin: adminLevel == 2 ? false : adminPermission,
                                            feedback: feedbackPermission,
                                            addProduct: addProduct,
                                            pdfDetail: pdfDetailPermission,
                                            priceSheet: priceSheetPermission
                                        }
                                    }
                                });
                            }

                            notify(
                                `New ${adminLevel == 1 ? 'Admin' : 'User'} has been created!`,
                                1
                            );
                            setTimeout(() => {
                                history.goBack();
                            }, 1000);
                        } catch (error) {
                            if (error.message.includes('Error (auth/email-already-in-use')) {
                                notify(
                                    "This email already have user don't need to set password!",
                                    1
                                );
                            }
                        }
                    } else {
                        notify('Password required for new user', 0);
                    }
                }
            } else {
                if (!id) {
                    notify('Admin already Exist!', 0);
                } else {
                    const refDetail = ref(database, `/ADMIN/USERS/${id}`);
                    try {
                        await update(refDetail, {
                            role: {
                                PermissionStatus: {
                                    user: userPermission,
                                    item: itemPermission,
                                    payment: paymentPermission,
                                    privacy: privacyPermission,
                                    term: termPermission,
                                    addAdmin: adminLevel == 2 ? false : adminPermission,
                                    feedback: feedbackPermission,
                                    addProduct: addProduct,
                                    pdfDetail: pdfDetailPermission,
                                    priceSheet: priceSheetPermission
                                }
                            }
                        });
                        notify(`Admin Permission updated!`, 1);
                        setTimeout(() => {
                            history.goBack();
                        }, 1000);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        } catch (error) {
            const { message } = error;
            notify('somehting Went Wrong!, please try with diffrent email', 0);
        }
    };

    const onSubmit = () => {
        if (!formik.values.email) {
            notify('Please Enter Email Value!', 0);
        } else {
            createAdmin();
        }
    };

    return (
        <div>
            <div className='flex flex-col gap-6'>
                {id ? null : (
                    <>
                        <div className='flex gap-10 items-center'>
                            <Input
                                label='Email'
                                placeholder='Enter Email Address'
                                value={formik.values.email}
                                onChange={(e) => formik.setFieldValue('email', e.target.value)}
                            />
                            <Input
                                label='Password'
                                type='password'
                                placeholder='Enter Password'
                                value={formik.values.password}
                                onChange={(e) => formik.setFieldValue('password', e.target.value)}
                            />
                        </div>
                    </>
                )}
                {adminLevel != 1 ? null : (
                    <div className='pl-1 flex flex-col gap-2'>
                        <PermissionCard
                            warningTypes={'DELETE/VIEW'}
                            value={formik.values.userPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'userPermission',
                                    !formik.values.userPermission
                                )
                            }
                            type='UserDetail'
                        />
                        <PermissionCard
                            value={formik.values.itemPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'itemPermission',
                                    !formik.values.itemPermission
                                )
                            }
                            type={'Item'}
                            warningTypes={'ADD/DELETE'}
                        />
                        <PermissionCard
                            value={formik.values.paymentPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'paymentPermission',
                                    !formik.values.paymentPermission
                                )
                            }
                            type={'Payment Method'}
                            warningTypes={'ADD/DELETE'}
                        />
                        <PermissionCard
                            value={formik.values.pdfDetailPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'pdfDetailPermission',
                                    !formik.values.pdfDetailPermission
                                )
                            }
                            type={'pdfDetail'}
                            warningTypes={'VIEW/UPDATE'}
                        />
                        <PermissionCard
                            value={formik.values.priceSheetPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'priceSheetPermission',
                                    !formik.values.priceSheetPermission
                                )
                            }
                            type={'Category Price'}
                            warningTypes={'VIEW/UPDATE'}
                        />

                        <PermissionCard
                            value={formik.values.feedbackPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'feedbackPermission',
                                    !formik.values.feedbackPermission
                                )
                            }
                            type={'Feedback'}
                            warningTypes={'VIEW'}
                        />
                        <PermissionCard
                            value={formik.values.adminPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'adminPermission',
                                    !formik.values.adminPermission
                                )
                            }
                            type={'to the another user'}
                            warningTypes={'PERMISSION'}
                        />
                        <PermissionCard
                            value={formik.values.termPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'termPermission',
                                    !formik.values.termPermission
                                )
                            }
                            type={'TermAndCondition'}
                            warningTypes={'VIEW/UPDATE'}
                        />
                        <PermissionCard
                            value={formik.values.privacyPermission}
                            onChange={() =>
                                formik.setFieldValue(
                                    'privacyPermission',
                                    !formik.values.privacyPermission
                                )
                            }
                            type={'PrivacyPolicy'}
                            warningTypes={'VIEW/UPDATE'}
                        />
                        <PermissionCard
                            value={formik.values.addProduct}
                            onChange={() =>
                                formik.setFieldValue('addProduct', !formik.values.addProduct)
                            }
                            type={'Product'}
                            warningTypes={'ADD'}
                        />
                    </div>
                )}
                <Button onClick={() => onSubmit()} title={id ? 'UPDATE' : 'SUBMIT'} />
            </div>

            <ToastContainer />
        </div>
    );
}
