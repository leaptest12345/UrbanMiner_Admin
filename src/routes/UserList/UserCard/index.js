import React from 'react';
import ImageModal from 'components/ImageModal/ImageModal';

import {
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    RemoveRedEye,
    RestorePageSharp
} from '@mui/icons-material';
import { Button } from 'component';

export const UserCard = ({
    index,
    totalUsers,
    photo,
    name,
    phoneNumber,
    onViewDetails,
    onRestore,
    onDelete,
    onApprove,
    userType,
    type,
    onOpenSubUser,
    leftIndex,
    isOpen
}) => {
    const textColor = type === 'user3' ? 'text-black' : 'text-white';

    return (
        <div
            className={`flex border ${
                index + 1 != totalUsers && 'border-b-0'
            } flex-1 items-center font-bold text-black text-sm rounded-md ${
                type === 'user2'
                    ? 'bg-grayishBlue'
                    : type === 'user3'
                    ? 'bg-lightGrayishBlue2'
                    : 'bg-slate-600'
            } p-4`}
        >
            <h5
                className={`w-[100px] ${
                    type === 'user2'
                        ? 'font-medium text-base text-white'
                        : type === 'user3'
                        ? 'font-normal text-sm'
                        : 'font-bold text-xl text-white'
                }`}
            >
                {leftIndex ? `${leftIndex} -` : null}
                {type === 'user2'
                    ? `${index + 1}`
                    : type === 'user3'
                    ? `${index + 1}`
                    : `${index + 1}`}
            </h5>
            <h5 className='w-[100px] h-12 items-center flex'>
                {photo ? (
                    <ImageModal url={photo} className='w-14 h-12 -ml-2 rounded-full' />
                ) : (
                    <div className={textColor}>-------</div>
                )}
            </h5>
            <div className={`flex flex-1 items-center justify-between ${textColor}`}>
                <h5 className={`flex-1`}>{name}</h5>
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
                            className={`cursor-pointer ${textColor}`}
                        />
                        {onApprove ? (
                            <Button title={'Approve'} onClick={onApprove} />
                        ) : onRestore ? (
                            <div
                                className='flex items-center gap-2 cursor-pointer  text-white'
                                onClick={onRestore}
                            >
                                <RestorePageSharp className='cursor-pointer' />
                                <h5>Restore User</h5>
                            </div>
                        ) : onDelete ? (
                            <Delete className='text-red-600' onClick={onDelete} />
                        ) : null}
                        {onOpenSubUser ? (
                            !isOpen ? (
                                <KeyboardArrowDown
                                    onClick={onOpenSubUser}
                                    className={`cursor-pointer ${textColor}`}
                                />
                            ) : (
                                <KeyboardArrowUp
                                    onClick={onOpenSubUser}
                                    className={`cursor-pointer ${textColor}`}
                                />
                            )
                        ) : null}
                    </div>
                </div>
                {userType && <h5 className='flex-1'>{userType}</h5>}
            </div>
        </div>
    );
};
