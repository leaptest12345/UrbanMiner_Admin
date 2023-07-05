import { Button } from '@material-ui/core';
import { database } from 'configs/firebaseConfig';
import { ToastContainer } from 'react-toastify';
import { formateData } from 'util/formateData';
import { notify } from 'util/notify';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { v4 as uuid } from 'uuid';
import { onValue, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-jss';

export default function AddAdmin(props) {
    const uniqueId = uuid().slice(0, 8);
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [password, setPassword] = useState('');
    const [itemPermission, setItemPermission] = useState(false);
    const [userPermission, setUserPermission] = useState(false);
    const [paymentPermission, setPaymentPermission] = useState(false);
    const [feedbackPermission, setFeedBackPermission] = useState(false);
    const [termPermission, setTermPermission] = useState(false);
    const [privacyPermission, setPrivacyPermission] = useState(false);
    const [adminPermission, setAdminPermission] = useState(false);
    const [pdfDetailPermission, setpdfDetailPermission] = useState(false);
    const [priceSheetPermission, setPriceSheetPermission] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [userList, setUserList] = useState([]);
    const [adminLevel, setAdminLevel] = useState('');
    const [adminUsers, setAdminUsers] = useState('');
    const theme = useTheme();

    const { id } = props.location.state;

    useEffect(() => {
        getUsers();
        if (id) {
            getAdminDetails(id);
        }
    }, []);

    const getAdminDetails = (id) => {
        const refDetail = ref(database, `/ADMIN/USERS/${id}`);
        onValue(refDetail, (snapshOT) => {
            if (snapshOT.val()) {
                setEmail(snapshOT.val()?.email);
                const permissionStatus = snapshOT.val()?.role?.PermissionStatus;
                if (permissionStatus) {
                    setItemPermission(permissionStatus.item);
                    setTermPermission(permissionStatus.term);
                    setUserPermission(permissionStatus.user);
                    setAdminPermission(permissionStatus.addAdmin);
                    setpdfDetailPermission(permissionStatus.pdfDetail ? true : false);
                    setFeedBackPermission(permissionStatus.feedback);
                    setPriceSheetPermission(permissionStatus.priceSheet ? true : false);
                    setPaymentPermission(permissionStatus.payment);
                    setPrivacyPermission(permissionStatus.privacy);
                    setAddProduct(permissionStatus.addProduct);
                }
            }
        });
    };

    const getUsers = async () => {
        try {
            const id = await localStorage.getItem('userID');
            const userRef = ref(database, `/ADMIN/USERS/${id}`);
            onValue(userRef, (snapshot) => {
                setAdminLevel(snapshot.val().adminLevel);
                setAdminUsers(snapshot.val().users);
            });
            const refDetail = ref(database, '/ADMIN/USERS');
            onValue(refDetail, (snapshOT) => {
                const data = snapshOT.val();
                setUsers(formateData(data));
            });
            const refDetail1 = ref(database, '/USERS');
            onValue(refDetail1, (snapshot) => {
                const data = snapshot.val();
                setUserList(data);
            });
        } catch (error) {
            console.log(error);
        }
    };
    const getUserId = () => {
        let result = 0;
        users &&
            users.map((item) => {
                if (email == item.email) {
                    result = item.ID;
                }
            });
        return result;
    };
    const userAlreadyExist = () => {
        let result = null;
        formateData(userList).map((item) => {
            if (item.email == email) {
                result = item.ID;
            }
        });
        return result;
    };

    const createAdmin = async () => {
        try {
            const result = await getUserId();
            if (result == 0) {
                const subUserID = userAlreadyExist();
                //check if user exist or not
                if (subUserID != null) {
                    //if user  exist
                    const id = await localStorage.getItem('userID');
                    const userDetailRef = ref(database, `/USERS/${subUserID}`);
                    onValue(userDetailRef, async (snapShot) => {
                        console.log('snapShot of the users ', snapShot.val());
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
                        notify(`New Admin has been created!`, 1);
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
                                cca2: '',
                                countryCode: ''
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
                            notify(`New Admin has been created!`, 1);

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
                        } catch (error) {
                            if (error.message.includes('Error (auth/email-already-in-use')) {
                                notify(
                                    "This email already have user don't need to set password!",
                                    1
                                );
                            }
                            console.log('addAdmin error', error);
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
                        notify(`User Permission updated!`, 1);
                    } catch (error) {
                        console.log(error);
                    }
                }
                //admin exist show message "admin already exist please try with differenet id"
                // const subUserID = userAlreadyExist();
                // const refDetail = ref(database, `/ADMIN/USERS/${result}`);
                // try {
                //     await update(refDetail, {
                //         ID: result,
                //         adminLevel: parseInt(adminLevel) + 1,
                //         role: {
                //             roleName: 'admin',
                //             PermissionStatus: {
                //                 user: userPermission,
                //                 item: itemPermission,
                //                 payment: paymentPermission,
                //                 privacy: privacyPermission,
                //                 term: termPermission,
                //                 addAdmin: adminLevel == 2 ? false : adminPermission,
                //                 feedback: feedbackPermission,
                //                 addProduct: addProduct,
                //                 pdfDetail: pdfDetailPermission
                //             }
                //         }
                //     });
                //     notify(`User Permission updated!`, 1);
                // } catch (error) {
                //     console.log(error);
                // }
                // }
            }
        } catch (error) {
            const { message } = error;
            notify('somehting Went Wrong!, please try with diffrent email', 0);
            // if (message == 'Firebase: Error (auth/email-already-in-use).') {
            //     const result = await getUserId();
            //     try {
            //         if (result == 0) {
            //             const refDetail = ref(database, `/ADMIN/USERS/${uniqueId}`);
            //             await set(refDetail, {
            //                 ID: uniqueId,
            //                 email: email,
            //                 adminLevel: parseInt(adminLevel) + 1,
            //                 role: {
            //                     roleName: 'admin',
            //                     PermissionStatus: {
            //                         user: userPermission,
            //                         item: itemPermission,
            //                         payment: paymentPermission,
            //                         privacy: privacyPermission,
            //                         term: termPermission,
            //                         addAdmin: adminLevel == 2 ? false : adminPermission,
            //                         feedback: feedbackPermission,
            //                         addProduct: addProduct,
            //                         pdfDetail: pdfDetailPermission,
            //                         priceSheet: priceSheetPermission
            //                     }
            //                 }
            //             });
            //         } else {
            //             const refDetail = ref(database, `/ADMIN/USERS/${result}`);
            //             await update(refDetail, {
            //                 ID: result,
            //                 email: email,
            //                 adminLevel: parseInt(adminLevel) + 1,
            //                 role: {
            //                     roleName: 'admin',
            //                     PermissionStatus: {
            //                         user: userPermission,
            //                         item: itemPermission,
            //                         payment: paymentPermission,
            //                         privacy: privacyPermission,
            //                         term: termPermission,
            //                         addAdmin: adminLevel == 2 ? false : adminPermission,
            //                         feedback: feedbackPermission,
            //                         addProduct: addProduct,
            //                         pdfDetail: pdfDetailPermission,
            //                         priceSheet: priceSheetPermission
            //                     }
            //                 }
            //             });
            //         }
            //         notify(`New Admin has been created!`, 1);
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        }
    };
    const onSubmit = () => {
        if (!email) {
            notify('Please Enter Email Value!', 0);
        } else {
            createAdmin();
        }
    };

    const checkboxStyle = {
        width: 25,
        height: 25,
        borderRadius: 100
    };
    const labelStyle = {
        marginLeft: '20px'
    };
    const inputStyle = {
        width: '45%',
        height: 45,
        borderRadius: 4,
        padding: 20,
        marginInline: 10,
        margin: 20
    };
    const formCheckStyle = {
        alignItems: 'center',
        display: 'flex'
    };

    const btnStyle = {
        backgroundColor: theme.color.veryDarkGrayishBlue,
        margin: 30,
        width: '30%',
        height: 50
    };
    const dangerLabel = {
        color: 'red'
    };

    return (
        <div>
            <div>
                {id ? null : (
                    <>
                        <input
                            className='form-check-input'
                            placeholder='Enter Email Address'
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            className='form-check-input'
                            placeholder='Enter Password'
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>
                )}
                {adminLevel != 1 ? null : (
                    <div style={{ marginLeft: 40 }}>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={userPermission}
                                onChange={() => setUserPermission(!userPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>DELETE/VIEW</label> usersDetail
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={itemPermission}
                                onChange={() => setItemPermission(!itemPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>ADD/DELETE</label> item
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={paymentPermission}
                                onChange={() => setPaymentPermission(!paymentPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>ADD/DELETE</label> payment
                                Method
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={pdfDetailPermission}
                                onChange={() => setpdfDetailPermission(!pdfDetailPermission)}
                            />

                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>VIEW/UPDATE</label> pdfDetail
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={priceSheetPermission}
                                onChange={() => setPriceSheetPermission(!priceSheetPermission)}
                            />

                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>VIEW/UPDATE</label> Category
                                Price
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={feedbackPermission}
                                onChange={() => setFeedBackPermission(!feedbackPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>VIEW</label> the feedbacks
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={adminPermission}
                                onChange={() => setAdminPermission(!adminPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can give the <label style={dangerLabel}>PERMISSION</label> to
                                the Another user
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={termPermission}
                                onChange={() => setTermPermission(!termPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <lable style={dangerLabel}>VIEW/UPDATE</lable> the
                                TermAndCondition
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={privacyPermission}
                                onChange={() => setPrivacyPermission(!privacyPermission)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>VIEW/UPDATE </label>the
                                PrivacyPolicy
                            </label>
                        </div>
                        <div className='form-check' style={formCheckStyle}>
                            <input
                                className='form-check-input'
                                type='checkbox'
                                style={checkboxStyle}
                                checked={addProduct}
                                onChange={() => setAddProduct(!addProduct)}
                            />
                            <label
                                style={labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={dangerLabel}>ADD_PRODUCT</label>
                            </label>
                        </div>
                    </div>
                )}
            </div>
            <Button onClick={() => onSubmit()} style={btnStyle}>
                <span style={{ color: 'white' }}>{id ? 'UPDATE' : 'SUBMIT'}</span>
            </Button>

            <ToastContainer />
        </div>
    );
}
