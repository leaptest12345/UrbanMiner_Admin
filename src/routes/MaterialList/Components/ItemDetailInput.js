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
        'h-9 bg-white border rounded-lg outline-none px-4 font-bold text-sm placeholder:text-gray-400 placeholder:font-bold text-black';

    const MATERIAL_UM_TYPES = [
        { value: 'LBS', label: 'LBS' },
        { value: 'EACH', label: 'EACH' },
        { value: 'CTW', label: 'CTW' },
        { value: 'NT', label: 'NT' },
        { value: 'GT', label: 'GT' }
    ];

    return (
        <div className='flex items-center gap-2'>
            <div className='flex flex-col gap-1 w-[150px]'>
                <div className='text-sm'>CATEGORY</div>
                <input
                    value={category}
                    onChange={onCategoryChange}
                    placeholder={'category'}
                    className={`${inputClassName}`}
                />
            </div>

            <div className='flex flex-col gap-1 w-[100px]'>
                <div className='text-sm'>PRICE</div>
                <input
                    value={price}
                    onChange={onPriceChange}
                    placeholder={'Price'}
                    type='number'
                    className={`${inputClassName} w-[100px]`}
                />
            </div>
            <div className='flex flex-col gap-1 w-[100px]'>
                <div className='text-sm'>UM</div>
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
        </div>
    );
};
export default ItemDetailsInputs;
