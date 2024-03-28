import React from 'react';

export const UserTableHeader = () => {
    return (
        <div className='flex flex-1 items-center font-bold text-white text-base bg-veryDarkGrayishBlue p-4 rounded-t-md'>
            <h5 className='w-[100px]'>No</h5>
            <h5 className='w-[100px]'>Photo</h5>
            <div className='flex flex-1 items-center justify-between'>
                <h5 className='flex-1'>Name</h5>
                <div className='flex flex-1 items-center justify-between'>
                    <h5 className='flex-1'>PhoneNumber</h5>
                    <h5 className='flex-1'>Actions</h5>
                </div>
            </div>
        </div>
    );
};
