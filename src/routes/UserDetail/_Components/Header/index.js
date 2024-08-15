import React from 'react';
import ImageModal from 'components/ImageModal/ImageModal';

import { NavBar } from '../NavBar';
import { ActionButton } from '../ActionButton';

export const Header = ({
    photo,
    fullName,
    selectedTab,
    setSelectedTab,
    onEdit,
    onDelete,
    onApproved,
    isApproved,
    isEditable
}) => {
    return (
        <div className='bg-gradient-to-r rounded-md from-blue-100 via-blue-200 to-blue-300'>
            <div className='p-8 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    {photo ? (
                        <ImageModal
                            url={photo}
                            className='w-16 h-16 rounded-full border-4 border-white'
                        />
                    ) : null}
                    <h5 className='font-bold text-xl'>{fullName}</h5>
                </div>
                <div className='flex items-center gap-4'>
                    {!isApproved && <ActionButton onClick={onApproved} title={'Approve User'} />}
                    <ActionButton onClick={onEdit} title={isEditable ? 'Close' : 'Edit'} />
                    {!isEditable && <ActionButton onClick={onDelete} title={'Delete'} />}
                </div>
            </div>
            <div className='px-5'>
                <NavBar
                    selectedItem={selectedTab}
                    onSelect={setSelectedTab}
                    navBarList={['Overview', 'Permission']}
                />
            </div>
        </div>
    );
};
