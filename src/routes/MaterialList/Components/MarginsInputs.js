// ItemDetailsInputs.js
import { Delete } from '@mui/icons-material';
import React from 'react';

const MarginsInputs = ({
    tier1,
    tier2,
    tier3,
    onTier1Change,
    onTier2Change,
    onTier3Change,
    onDelete
}) => {
    const inputClassName =
        'h-9 bg-white border rounded-lg outline-none px-4 font-bold text-sm placeholder:text-gray-400 placeholder:font-bold text-black';

    return (
        <div className='flex items-center gap-2 pl-4'>
            <div className='flex flex-col gap-1 w-[100px]'>
                <div className='text-sm'>TIER 1</div>
                <input
                    value={tier1}
                    onChange={onTier1Change}
                    className={`${inputClassName}`}
                    type='number'
                />
            </div>
            <div className='flex flex-col gap-1 w-[100px]'>
                <div className='text-sm'>TIER 2</div>
                <input
                    value={tier2}
                    onChange={onTier2Change}
                    className={`${inputClassName}`}
                    type='number'
                />
            </div>
            <div className='flex flex-col gap-1 w-[100px]'>
                <div className='text-sm'>TIER 3</div>
                <input
                    value={tier3}
                    onChange={onTier3Change}
                    className={`${inputClassName}`}
                    type='number'
                />
            </div>
            <Delete onClick={onDelete} className='text-red-500 cursor-pointer mt-6' />
        </div>
    );
};
export default MarginsInputs;
