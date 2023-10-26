import React, { useEffect, useState } from 'react';

import { ref, onValue, set } from 'firebase/database';
import { ToastContainer } from 'react-toastify';

import { database } from 'configs/firebaseConfig';

import { notify } from 'util/notify';
import { Input } from 'components/Input';
import { Button } from 'component';

export default function TermAndConditions() {
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

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <Input type='textarea' value={description} onChange={handleMessageChange} />
                <Button title={'Submit'} />
            </form>
            <ToastContainer />
        </div>
    );
}
