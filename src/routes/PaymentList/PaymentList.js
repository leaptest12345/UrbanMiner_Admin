import React, { useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';
import { ToastContainer } from 'react-toastify';

import { Delete } from '@material-ui/icons';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

import { notify } from 'util/notify';
import { Input } from 'components/Input';
import { Button } from 'component';

export default function PaymentList() {
    const id = uuid().slice(0, 8);

    const [itemName, setItemName] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        getPaymentList();
    }, []);

    const addedOrNot = () => {
        let temp = false;
        data.map((item) => {
            if (item.title.toLowerCase() == itemName.trim().toLocaleLowerCase()) temp = true;
        });
        return temp;
    };

    function handleSubmit(e) {
        e.preventDefault();
        try {
            if (itemName.trim() && !addedOrNot()) {
                const starCount = ref(database, `/ADMIN/PAYMENTTYPE/${id}`);
                set(starCount, {
                    ID: id,
                    title: itemName.trim()
                });
                setItemName('');
                setTimeout(() => {
                    notify('PaymentMethod Successfully Added!', 1);
                }, 100);
            } else {
                if (itemName.trim()) notify('Method Already Added!', 2);
                else notify('Invalid PaymentMethod!', 0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onchange = (event) => {
        setItemName(event.target.value);
    };

    const getPaymentList = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/PAYMENTTYPE');
            onValue(starCountRef, (snapshot) => {
                let arr = [];
                const data = snapshot.val();
                const isArray = Array.isArray(data);
                if (isArray) {
                    const newArr = data.filter((item) => item);
                    setData(newArr);
                } else {
                    let arr = [];
                    for (let key in data) {
                        if (data.hasOwnProperty(key)) {
                            let value = data[key];
                            arr.push(value);
                        }
                    }
                    const newArr = arr.filter((item) => item);
                    setData(newArr);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = (item) => {
        try {
            const starCount = ref(database, `/ADMIN/PAYMENTTYPE/${item.ID}`);
            set(starCount, null);
            setTimeout(() => {
                notify('PaymentMethod has been Deleted!', 0);
            }, 100);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col gap-10'>
            <form onSubmit={handleSubmit}>
                <div className='flex items-center gap-10 w-3/6'>
                    <Input value={itemName} onChange={onchange} />
                    <Button title='Add' />
                </div>
            </form>
            <section>
                <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
                    <h5 className='w-[100px]'>No</h5>
                    <div className='flex items-center justify-between flex-1 pr-10'>
                        <h5>ItemName</h5>
                        <h5>Action</h5>
                    </div>
                </div>
                {data &&
                    data.map((item, index) => (
                        <div
                            className={`flex border ${
                                index + 1 != data.length && 'border-b-0'
                            } flex-1 items-center font-bold text-black text-sm ${
                                index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
                            } p-4`}
                        >
                            <h5 className='w-[100px]'>{index + 1}</h5>
                            <div className='flex items-center justify-between flex-1 pr-10'>
                                <h5>{item.title}</h5>
                                <Delete
                                    onClick={() => onDelete(item)}
                                    className='text-red-600 cursor-pointer hover:text-red-900'
                                />
                            </div>
                        </div>
                    ))}
            </section>
            <ToastContainer className='toast' />
        </div>
    );
}
