import { ArrowForwardIos } from '@mui/icons-material';
import React from 'react';

const ItemDescriptionInput = ({ description, onChange, onClick, open }) => {
    const inputClassName =
        'h-9 bg-white border rounded-lg outline-none px-4 font-bold text-base placeholder:text-gray-400 placeholder:font-bold text-black';

    return (
        <div className='flex items-center gap-2 w-[400px]'>
            {onClick && (
                <div onClick={onClick} className='cursor-pointer'>
                    <ArrowForwardIos className={open ? 'rotate-90' : 'rotate-0'} />
                </div>
            )}
            <input
                value={description}
                onChange={onChange}
                placeholder={'Description'}
                className={`${inputClassName} w-full`}
            />
        </div>
    );
};

export default ItemDescriptionInput;
