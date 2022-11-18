import { Button, TextField } from '@material-ui/core';
import { RefreshRounded } from '@material-ui/icons';
import { database } from 'configs/firebaseConfig';
import { onValue, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { formateData } from 'util/formateData';
import { notify } from 'util/notify';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { v4 as uuid } from 'uuid';

export default function AddAdmin() {
    const uniqueId = uuid().slice(0, 8);

    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [password, setPassword] = useState('');
    const [id, setId] = useState(null);
    const [itemPermission, setItemPermission] = useState(false);
    const [userPermission, setUserPermission] = useState(false);
    const [paymentPermission, setPaymentPermission] = useState(false);
    const [feedbackPermission, setFeedBackPermission] = useState(false);
    const [termPermission, setTermPermission] = useState(false);
    const [privacyPermission, setPrivacyPermission] = useState(false);
    const [adminPermission, setAdminPermission] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const classes = useStyles();
    const theme = useTheme();
    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        try {
            const refDetail = ref(database, '/ADMIN/USERS');
            onValue(refDetail, (snapshOT) => {
                const data = snapshOT.val();
                setUsers(formateData(data));
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
    const matchUser = () => {
        try {
            let result = false;
            let id = null;

            if (result) {
            } else {
                notify('This User hasn"t created Account!', 0);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const updateUserDetail = async (id) => {
        try {
            const userID = await localStorage.getItem('userID');
            if (id != null) {
                // &&id!=userID
                const refDetail = ref(database, `/ADMIN/USERS/${id}`);
                update(refDetail, {
                    role: {
                        roleName: 'admin',
                        PermissionStatus: {
                            user: userPermission,
                            item: itemPermission,
                            payment: paymentPermission,
                            privacy: privacyPermission,
                            term: termPermission,
                            addAdmin: adminPermission,
                            feedback: feedbackPermission,
                            addProduct: addProduct
                        }
                    }
                });
                notify('User Permission Successfully Updated!', 1);
            } else {
                notify('Invalid Request', 2);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const createAdmin = async () => {
        try {
            const result = await getUserId();
            console.log('account alredy', result);
            if (result == 0) {
                const auth = getAuth();
                const user = await createUserWithEmailAndPassword(auth, email, password);
                if (user) {
                    const refDetail = ref(database, `/ADMIN/USERS/${uniqueId}`);
                    await set(refDetail, {
                        ID: uniqueId,
                        email: email,
                        role: {
                            roleName: 'admin',
                            PermissionStatus: {
                                user: userPermission,
                                item: itemPermission,
                                payment: paymentPermission,
                                privacy: privacyPermission,
                                term: termPermission,
                                addAdmin: adminPermission,
                                feedback: feedbackPermission,
                                addProduct: addProduct
                            }
                        }
                    });
                    notify(`New Admin has been created!`, 1);
                }
            } else {
                const refDetail = ref(database, `/ADMIN/USERS/${result}`);
                await update(refDetail, {
                    ID: result,
                    role: {
                        roleName: 'admin',
                        PermissionStatus: {
                            user: userPermission,
                            item: itemPermission,
                            payment: paymentPermission,
                            privacy: privacyPermission,
                            term: termPermission,
                            addAdmin: adminPermission,
                            feedback: feedbackPermission,
                            addProduct: addProduct
                        }
                    }
                });
                notify(`User Permission updated!`, 1);
            }
        } catch (error) {
            const { message } = error;
            if (message == 'Firebase: Error (auth/email-already-in-use).') {
                const result = await getUserId();
                console.log('account alredy', result);
                try {
                    if (result == 0) {
                        const refDetail = ref(database, `/ADMIN/USERS/${uniqueId}`);
                        await set(refDetail, {
                            ID: uniqueId,
                            email: email,
                            role: {
                                roleName: 'admin',
                                PermissionStatus: {
                                    user: userPermission,
                                    item: itemPermission,
                                    payment: paymentPermission,
                                    privacy: privacyPermission,
                                    term: termPermission,
                                    addAdmin: adminPermission,
                                    feedback: feedbackPermission,
                                    addProduct: addProduct
                                }
                            }
                        });
                    } else {
                        const refDetail = ref(database, `/ADMIN/USERS/${result}`);
                        await update(refDetail, {
                            ID: result,
                            email: email,
                            role: {
                                roleName: 'admin',
                                PermissionStatus: {
                                    user: userPermission,
                                    item: itemPermission,
                                    payment: paymentPermission,
                                    privacy: privacyPermission,
                                    term: termPermission,
                                    addAdmin: adminPermission,
                                    feedback: feedbackPermission,
                                    addProduct: addProduct
                                }
                            }
                        });
                    }
                    notify(`New Admin has been created!`, 1);
                } catch (error) {
                    console.log(error);
                }
            }
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
                <div style={{ marginLeft: 40 }}>
                    <div className='form-check' style={formCheckStyle}>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            style={checkboxStyle}
                            value={userPermission}
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
                            value={itemPermission}
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
                            value={paymentPermission}
                            onChange={() => setPaymentPermission(!paymentPermission)}
                        />
                        <label
                            style={labelStyle}
                            className='form-check-label'
                            htmlFor='flexCheckChecked'
                        >
                            User can <label style={dangerLabel}>ADD/DELETE</label> payment Method
                        </label>
                    </div>
                    <div className='form-check' style={formCheckStyle}>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            style={checkboxStyle}
                            value={feedbackPermission}
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
                            value={adminPermission}
                            onChange={() => setAdminPermission(!adminPermission)}
                        />
                        <label
                            style={labelStyle}
                            className='form-check-label'
                            htmlFor='flexCheckChecked'
                        >
                            User can give the <label style={dangerLabel}>PERMISSION</label> to the
                            Another user
                        </label>
                    </div>
                    <div className='form-check' style={formCheckStyle}>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            style={checkboxStyle}
                            value={termPermission}
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
                            value={privacyPermission}
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
                            value={addProduct}
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
            </div>
            <Button onClick={() => onSubmit()} style={btnStyle}>
                <span style={{ color: 'white' }}>SUBMIT</span>
            </Button>
            <ToastContainer />
        </div>
    );
}

const useStyles = createUseStyles({
    btn: {
        backgroundColor: 'red'
    },
    checkBox: {
        width: 100,
        height: 100
    },
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 0,
        marginTop: 0,
        backgroundColor: 'red'
    }
});
