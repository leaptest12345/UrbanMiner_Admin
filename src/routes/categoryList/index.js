import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import * as Config from '../../configs/index';
import { formateData } from 'util/formateData';
import { notify } from 'util/notify';
import { Delete } from '@mui/icons-material';
import { onValue, ref, remove, set } from 'firebase/database';

export default function CategoryList() {
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('');

    useEffect(() => {
        getAllCategoryList();
    }, []);

    const getAllCategoryList = async () => {
        const materialRef = ref(Config.database, '/ADMIN/MATERIAL_CATEGORY_LIST');

        await onValue(materialRef, (snapshot) => {
            const results = snapshot.val();

            const data = formateData(results);

            setCategoryList(data);
        });
    };

    const handleAddCategory = async () => {
        if (category) {
            const id = uuid().slice(0, 8);

            const materialRef = ref(Config.database, `/ADMIN/MATERIAL_CATEGORY_LIST/${id}`);

            await set(materialRef, {
                id: id,
                category: category
            });
            setCategory('');
            notify('Category Added Successfully!', 1);
        }
    };

    const handleDeleteCategory = async (id) => {
        const materialRef = ref(Config.database, `/ADMIN/MATERIAL_CATEGORY_LIST/${id}`);

        await remove(materialRef);

        notify('Category Deleted Successfully!', 1);
    };

    return (
        <div className='flex flex-col gap-10'>
            <div className='flex items-center gap-8'>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder='Enter Category Name'
                    className='h-12 bg-white border rounded-lg outline-none px-4 font-bold  
                    placeholder:text-gray-300 text-black placeholder:font-bold'
                />
                <div
                    onClick={handleAddCategory}
                    className='font-bold text-lg text-blue-700 cursor-pointer'
                >
                    ADD
                </div>
            </div>
            <div className='flex flex-col gap-2 w-1/2'>
                {categoryList?.map((item) => {
                    return (
                        <div className='flex items-center gap-8 bg-slate-200 justify-between p-2 rounded-md'>
                            <div className='font-bold text-lg text-black cursor-pointer'>
                                {item.category}
                            </div>
                            <div
                                className='font-bold text-lg text-red-500 cursor-pointer'
                                onClick={() => handleDeleteCategory(item.id)}
                            >
                                <Delete />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
