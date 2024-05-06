import React, { useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { Button } from 'component';
import { Input } from 'components/Input';
import { CustomizedTable } from 'components/CustomizedTable';

export default function Items() {
    const id = uuid().slice(0, 8);

    const [itemName, setItemName] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        getItemValues();
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
                const starCount = ref(database, `/ADMIN/ITEM/${id}`);
                set(starCount, {
                    ID: id,
                    title: itemName.trim()
                });
                setItemName('');
                notify('Item Successfully Added!', 1);
            } else {
                if (itemName.trim()) notify('Item Already Added!', 2);
                else notify('invalid itemName', 0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onchange = (event) => {
        setItemName(event.target.value);
    };

    const getItemValues = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/ITEM');
            onValue(starCountRef, (snapshot) => {
                const data = formateData(snapshot.val());
                setData(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = (id) => {
        try {
            const starCount = ref(database, `/ADMIN/ITEM/${id}`);
            set(starCount, null);
            setTimeout(() => {
                notify('Item has been Deleted!', 0);
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
            <CustomizedTable
                headerLabelList={['ItemName']}
                bodyItemList={data.map((item, index) => {
                    return {
                        list: [item.title],
                        itemDetail: item
                    };
                })}
                type={'ITEM'}
                onDelete={(id) => {
                    onDelete(id);
                }}
            />
        </div>
    );
}
