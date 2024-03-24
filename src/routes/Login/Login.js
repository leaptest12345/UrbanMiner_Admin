import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';

import { Grid, Paper, TextField } from '@material-ui/core';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';

import { database } from 'configs/firebaseConfig';

import LoadingSpinner from 'components/Spinner/LoadingSpinner';

import { UserContext } from 'util/userContext';
import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { Button } from 'component';
import { LockOpen } from '@mui/icons-material';

const Login = () => {
    const auth = getAuth();
    const theme = useTheme();

    const { signIn1 } = React.useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState('');

    useEffect(() => {
        getDetail();
    }, []);

    // const imageUrl = 'https://cdn.wallpapersafari.com/74/49/F7dPYn.jpg';
    const imageUrl =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFGxG4TqP21CAeCARSRmBFhHe8VVxJoKsjxw&usqp=CAU';
    const containerStyle = {
        display: 'flex',
        flex: 1,
        height: '100vh',
        backgroundColor: theme.color.BG,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover', // This will make the image cover the entire container
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center'
    };

    const onSubmit = async () => {
        if (!email) notify('Please Fill The Email Filed!', 0);
        else if (!password) notify('Please Fill The password Field!', 0);
        else {
            setLoading(true);
            try {
                let emailResult = false;
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential.user.uid) {
                    users &&
                        users.map((item, index) => {
                            if (item.email == email) {
                                emailResult = true;
                                signIn1(item.ID + '', item.role.PermissionStatus);
                                notify('Login Successfully Done!', 1);
                                setLoading(false);
                                return;
                            }
                        });
                }

                if (!emailResult) {
                    notify('Invalid UserName and Password', 0);
                    setLoading(false);
                }
                // const refDetail=ref(database,'/USERS/1')
                // update(refDetail,{
                //    ID:1,
                //    role:{
                //       roleName:'admin',
                //       PermissionStatus:{
                //         user:true,
                //          item:true,
                //          payment:true,
                //          privacy:true,
                //          term:true,
                //          addAdmin:true,
                //          feedback:true
                //       }
                //     }
                // })
            } catch (error) {
                setLoading(false);
                const errorMessage = error.message;
                console.error(errorMessage);
                notify(errorMessage, 0);
            }
        }
    };

    const onchangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onchangePassword = (e) => {
        setPassword(e.target.value);
    };

    const getDetail = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/USERS');
            onValue(starCountRef, (snapshot) => {
                let data = snapshot.val();
                setUsers(formateData(data));
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={containerStyle}>
            {loading ? <LoadingSpinner /> : null}
            <Paper
                elevation={10}
                className='p-10 w-[500px] flex flex-col gap-10 rounded-md bg-veryDarkGrayishBlue'
            >
                <Grid align='center' style={{ margin: '20px 0px' }}>
                    <LockOpen />
                    <h2 className='text-2xl font-bold '>Sign In</h2>
                </Grid>
                <div className='flex flex-1 w-full flex-col gap-4'>
                    <TextField
                        onChange={onchangeEmail}
                        label='Username'
                        placeholder='Enter username'
                        variant='outlined'
                        fullWidth
                        required
                    />
                    <TextField
                        onChange={onchangePassword}
                        label='Password'
                        placeholder='Enter password'
                        type='password'
                        variant='outlined'
                        fullWidth
                        required
                    />
                </div>
                <Button onClick={() => onSubmit()} title='Sign In' width='full' />
            </Paper>
            <ToastContainer />
        </div>
    );
};

export default Login;
