import { database } from 'configs/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { createUseStyles, useTheme } from 'react-jss';
import { Button } from '@material-ui/core';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';

export default function PdfDetail() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [description, setDescription] = useState('');
    const [description1, setDescription1] = useState('');

    const getDetail = () => {
        try {
            const result = ref(database, '/ADMIN/PdfDetail');
            onValue(result, (snapShot) => {
                if (snapShot.val()) {
                    setDescription(snapShot.val().address);
                    setDescription1(snapShot.val().pdfDescription);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDetail();
    }, []);
    const handleMessageChange = (event) => {
        setDescription(event.target.value);
    };
    const handleMessageChange1 = (event) => {
        setDescription1(event.target.value);
    };
    function handleSubmit(e) {
        e.preventDefault();
        try {
            const result = ref(database, '/ADMIN/PdfDetail');
            set(result, {
                address: description,
                pdfDescription: description1
            });
            notify('address Successfully Updated!', 1);
        } catch (error) {
            console.log(error);
        }
    }
    const btnstyle = {
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        margin: 30
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <>
                    <h3
                        style={{
                            marginBottom: 10
                        }}
                    >
                        Address:
                    </h3>
                    <textarea
                        className={classes.areaText}
                        value={description}
                        onChange={handleMessageChange}
                    />
                </>
                <>
                    <h3
                        style={{
                            marginBottom: 10,
                            marginTop: 10
                        }}
                    >
                        Pdf Description:
                    </h3>
                    <textarea
                        className={classes.areaText}
                        value={description1}
                        onChange={handleMessageChange1}
                    />
                    <Button
                        className={classes.btn}
                        type='submit'
                        style={btnstyle}
                        variant='contained'
                    >
                        Add
                    </Button>
                </>
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
