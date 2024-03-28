import { Delete, RemoveRedEye, RestorePageSharp } from '@mui/icons-material';
import { Button } from 'component';
import ImageModal from 'components/ImageModal/ImageModal';
import React from 'react';

export const UserCard = ({
    index,
    totalUsers,
    photo,
    name,
    phoneNumber,
    onViewDetails,
    onRestore,
    onDelete,
    onApprove
}) => {
    return (
        <div
            className={`flex border ${
                index + 1 != totalUsers && 'border-b-0'
            } flex-1 items-center font-bold text-black text-sm ${
                index % 2 == 0 ? 'bg-lightGrayishBlue' : 'bg-white'
            } p-4`}
        >
            <h5 className='w-[100px]'>{index + 1}</h5>
            <h5 className='w-[100px]'>
                {photo ? (
                    <ImageModal url={photo} className='w-12 h-12 -ml-2 rounded-full' />
                ) : (
                    <div className='w-12 h-12  rounded-full'>-----</div>
                )}
            </h5>
            <div className='flex flex-1 items-center justify-between'>
                <h5 className='flex-1'>{name}</h5>
                <div className='flex flex-1 items-center justify-between'>
                    <h5 className='flex-1'>
                        {phoneNumber
                            ? (phoneNumber + '').substring(0, 3) +
                              '   ' +
                              (phoneNumber + '').substring(3, 6) +
                              '   ' +
                              (phoneNumber + '').substring(6, 10) +
                              '   '
                            : '--- --- --- ----'}
                    </h5>
                    <div className='flex-1 flex items-center gap-14'>
                        <RemoveRedEye
                            onClick={onViewDetails}
                            className='cursor-pointer text-blue-900 hover:text-blue-700'
                        />
                        {onApprove ? (
                            <Button title={'Approve'} onClick={onApprove} />
                        ) : onRestore ? (
                            <div
                                className='flex items-center gap-2 cursor-pointer  text-red-600 hover:text-red-800'
                                onClick={onRestore}
                            >
                                <RestorePageSharp className='cursor-pointer' />
                                <h5>Restore User</h5>
                            </div>
                        ) : onDelete ? (
                            <Delete className='text-red-600' onClick={onDelete} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
