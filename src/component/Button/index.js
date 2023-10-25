import React from 'react';

export const Button = ({ title, onClick, isDisabled }) => {
    return (
        <button
            onClick={isDisabled ? undefined : onClick}
            className={`h-12 w-fit px-10 rounded-md ${
                !isDisabled ? 'bg-slate-900 hover:bg-slate-600' : 'bg-slate-500'
            }`}
            title='Submit'
        >
            <h5 className='font-bold text-base text-white'>{isDisabled ? 'Loading...' : title}</h5>
        </button>
    );
};
