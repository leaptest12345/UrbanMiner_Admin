import React, { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';

import { database } from 'configs/firebaseConfig';

import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { onValue, ref, set, update } from 'firebase/database';

import { formateData } from 'util/formateData';
import { notify } from 'util/notify';
import { styles } from './styles';
import { Input } from 'components/Input';
import { Button } from 'component';

export default function AddAdmin(props) {
    const history = useHistory();

    const { id } = props.location.state;

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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

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
                setAdminLevel(snapshot.val()?.adminLevel);
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
        } catch (error) {}
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
                        const data = snapShot.val();
                        setFirstName(data.firstName);
                        setLastName(data.lastName);
                        setPhoneNumber(data.phoneNumber);
                        setCompanyName(data.companyName);

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
                                firstName: firstName,
                                lastName: lastName,
                                photo: '',
                                photoName: '',
                                phoneNumber: phoneNumber,
                                companyName: companyName,
                                isApproved: true,
                                cca2: 'US',
                                countryCode: '1',
                                address: {
                                    street: street,
                                    city: city,
                                    state: state,
                                    zipCode: zip
                                },
                                companyName: ''
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
        if (!email) {
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label='Password'
                                type='password'
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='flex gap-10 items-center'>
                            <Input
                                label='FirstName'
                                placeholder='Enter FirstName'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <Input
                                label='LastName'
                                placeholder='Enter LastName'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <Input
                                label='PhoneNumber'
                                placeholder='Enter PhoneNumber'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <Input
                                label='CompanyName'
                                placeholder='Enter CompanyName'
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <Input
                                label='Street'
                                placeholder='Enter Street'
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                            />
                            <Input
                                label='City'
                                placeholder='Enter City'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-10 items-center'>
                            <Input
                                label='State'
                                placeholder='Enter State'
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                            <Input
                                label='Zip'
                                placeholder='Enter Zip'
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {adminLevel != 1 ? null : (
                    <div className='pl-1 flex flex-col gap-2'>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                className='w-6 h-6'
                                type='checkbox'
                                checked={userPermission}
                                onChange={() => setUserPermission(!userPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>DELETE/VIEW</label>{' '}
                                usersDetail
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={itemPermission}
                                onChange={() => setItemPermission(!itemPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>ADD/DELETE</label> item
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={paymentPermission}
                                onChange={() => setPaymentPermission(!paymentPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>ADD/DELETE</label>{' '}
                                payment Method
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={pdfDetailPermission}
                                onChange={() => setpdfDetailPermission(!pdfDetailPermission)}
                            />

                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>VIEW/UPDATE</label>{' '}
                                pdfDetail
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={priceSheetPermission}
                                onChange={() => setPriceSheetPermission(!priceSheetPermission)}
                            />

                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>VIEW/UPDATE</label>{' '}
                                Category Price
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={feedbackPermission}
                                onChange={() => setFeedBackPermission(!feedbackPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>VIEW</label> the
                                feedbacks
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={adminPermission}
                                onChange={() => setAdminPermission(!adminPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can give the{' '}
                                <label style={styles.dangerLabel}>PERMISSION</label> to the Another
                                user
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={termPermission}
                                onChange={() => setTermPermission(!termPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <lable style={styles.dangerLabel}>VIEW/UPDATE</lable> the
                                TermAndCondition
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={privacyPermission}
                                onChange={() => setPrivacyPermission(!privacyPermission)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>VIEW/UPDATE </label>the
                                PrivacyPolicy
                            </label>
                        </div>
                        <div className='form-check' style={styles.formCheckStyle}>
                            <input
                                type='checkbox'
                                className='w-6 h-6'
                                checked={addProduct}
                                onChange={() => setAddProduct(!addProduct)}
                            />
                            <label
                                style={styles.labelStyle}
                                className='form-check-label'
                                htmlFor='flexCheckChecked'
                            >
                                User can <label style={styles.dangerLabel}>ADD_PRODUCT</label>
                            </label>
                        </div>
                    </div>
                )}
                <Button onClick={() => onSubmit()} title={id ? 'UPDATE' : 'SUBMIT'} />
            </div>

            <ToastContainer />
        </div>
    );
}
