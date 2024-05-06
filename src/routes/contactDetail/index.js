import { getContactDetail } from '../../Firebase/contact/index';
import React, { useEffect } from 'react';
import { BusinessContact, IndividualContact } from './_Components';

export const ContactDetail = (props) => {
    const { userId, itemId, type } = props.location.state;

    const [contact, setContact] = React.useState({});

    useEffect(() => {
        (async () => {
            const detail = await getContactDetail(userId, itemId);

            setContact(detail);
        })();
    }, []);

    return (
        <div className='flex flex-col gap-6'>
            <div className='text-3xl font-bold'>
                {type == 'Business' ? 'Business Contact' : 'Individual Contact'}
            </div>
            {type == 'Business' ? (
                <BusinessContact businessInfo={contact?.businessInfo} />
            ) : (
                <IndividualContact individualInfo={contact?.individualInfo} />
            )}
        </div>
    );
};
