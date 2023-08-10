import React, { useEffect, useState } from 'react';

import { ref, onValue, set } from 'firebase/database';
import { createUseStyles, useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';

import { Button } from '@material-ui/core';

import { database } from 'configs/firebaseConfig';

import { notify } from 'util/notify';

export default function TermAndConditions() {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [description, setDescription] = useState('');

    useEffect(() => {
        getDetail();
    }, []);

    const getDetail = () => {
        try {
            const result = ref(database, '/ADMIN/termAndcondition');
            onValue(result, (snapShot) => {
                if (snapShot.val()) {
                    setDescription(snapShot.val().Description);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleMessageChange = (event) => {
        setDescription(event.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        try {
            const result = ref(database, '/ADMIN/termAndcondition');
            set(result, {
                title: 'termAndcondition',
                Description: description
            });
            notify('TermAndCondition Successfully Updated!', 1);
        } catch (error) {
            console.log(error);
        }
    }

    const btnStyle = {
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        margin: 30
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    className={classes.areaText}
                    value={description}
                    onChange={handleMessageChange}
                />
                <Button className={classes.btn} type='submit' style={btnStyle} variant='contained'>
                    Add
                </Button>
            </form>
            <ToastContainer />
        </div>
    );
}

const useStyles = createUseStyles((theme) => ({
    mainDiv: {
        display: 'flex',
        height: '100%',
        width: '100%'
    },
    btn: {
        width: '30%',
        borderRadius: 10,
        height: 50,
        color: 'white',
        marginTop: '5%',
        backgroundColor: 'black'
    },
    areaText: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        padding: 20,
        backgroundColor: theme.color.WHITE
    }
}));
