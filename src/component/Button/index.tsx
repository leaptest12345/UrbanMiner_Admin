import React from 'react';
import { Props } from './types';

export const Button = ({ title, onClick, width, isDisabled, type }: Props) => {
    return (
        <button
            onClick={isDisabled ? undefined : onClick}
            className={`h-12
            ${width == 'full' ? 'w-full' : 'w-fit'}  px-10 rounded-md ${
                type == 'primary'
                    ? 'bg-green-700 hover:bg-green-900'
                    : !isDisabled
                    ? 'bg-slate-900 hover:bg-slate-600'
                    : 'bg-slate-500'
            }`}
            title='Submit'
        >
            <h5 className='font-bold text-base text-white'>
                {isDisabled ? 'Uploading...' : title}
            </h5>
        </button>
    );
};
