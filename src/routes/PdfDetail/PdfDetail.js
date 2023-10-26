import React, { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { ref, onValue, set } from 'firebase/database';

import { database } from 'configs/firebaseConfig';

import { notify } from 'util/notify';
import { Input } from 'components/Input';
import { Button } from 'component';

export default function PdfDetail() {
    const [description, setDescription] = useState('');
    const [description1, setDescription1] = useState('');

    useEffect(() => {
        getDetail();
    }, []);

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

    return (
        <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <Input
                    label='Address:'
                    value={description}
                    onChange={handleMessageChange}
                    type='textarea'
                />
                <Input
                    label='Pdf Description:'
                    value={description1}
                    onChange={handleMessageChange1}
                    type='textarea'
                />
                <Button title='submit' />
            </form>
            <ToastContainer />
        </div>
    );
}
