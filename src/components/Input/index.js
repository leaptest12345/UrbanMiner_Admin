import React from 'react';

export const Input = ({ value, onChange, label, error, type, placeholder }) => {
    return (
        <div className='flex flex-col gap-2 w-full'>
            {label && <h2 className='font-bold text-lg'>{label}</h2>}
            {type == 'textarea' ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className='h-96 p-2 text-base w-full bg-white outline-none border border-gray-300 rounded-md'
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className='h-12 px-2 text-base w-full bg-white outline-none border border-gray-300 rounded-md'
                />
            )}

            {error && <h5 className='text-sm text-red-600'>{error}</h5>}
        </div>
    );
};
