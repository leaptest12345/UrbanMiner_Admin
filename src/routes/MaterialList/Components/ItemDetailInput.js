// ItemDetailsInputs.js
import React from 'react';

const ItemDetailsInputs = ({
    category,
    price,
    um,
    onCategoryChange,
    onPriceChange,
    onUmChange
}) => {
    const inputClassName =
        'h-9 bg-white border rounded-lg outline-none px-4 font-bold text-base placeholder:text-gray-400 placeholder:font-bold text-black';

    const MATERIAL_UM_TYPES = [
        { value: 'LBS', label: 'LBS' },
        { value: 'EACH', label: 'EACH' },
        { value: 'CTW', label: 'CTW' },
        { value: 'NT', label: 'NT' },
        { value: 'GT', label: 'GT' }
    ];

    return (
        <div className='flex items-center gap-10'>
            <input
                value={category}
                onChange={onCategoryChange}
                placeholder={'category'}
                className={`${inputClassName} w-[200px]`}
            />
            <input
                value={price}
                onChange={onPriceChange}
                placeholder={'Price'}
                type='number'
                className={`${inputClassName} w-[100px]`}
            />
            <select
                value={um}
                onChange={onUmChange}
                placeholder={'UM'}
                className={`${inputClassName} w-[100px]`}
            >
                {MATERIAL_UM_TYPES.map((item) => {
                    return <option value={item.value}>{item.label}</option>;
                })}
            </select>
        </div>
    );
};
export default ItemDetailsInputs;
