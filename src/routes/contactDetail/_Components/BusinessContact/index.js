import React from 'react';
import { useFormik } from 'formik';
import InputWithLabel from 'components/InputWithLabel';

export const BusinessContact = ({ businessInfo }) => {
    const BusinessContactDefaultInfo = {
        email: '',
        personalContact: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            Notes: ''
        },
        phoneNumber: ''
    };

    const formik = useFormik({
        initialValues: businessInfo || {
            businessName: '',
            businessType: '',
            businessAddress: {
                streetAddress: '',
                city: '',
                state: '',
                zip: ''
            },
            businessContactInfo: [BusinessContactDefaultInfo]
        },
        enableReinitialize: true,
        onSubmit: (values) => {}
    });

    return (
        <div className='w-10/12'>
            <InputWithLabel
                label={'Business Name'}
                name={'businessName'}
                value={formik.values.businessName}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Business Type'}
                name={'businessType'}
                value={formik.values.businessType}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Street Address'}
                name={'streetAddress'}
                value={formik.values.businessAddress.streetAddress}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'City'}
                name={'city'}
                value={formik.values.businessAddress.city}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'State'}
                name={'state'}
                value={formik.values.businessAddress.state}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Zip'}
                name={'zip'}
                value={formik.values.businessAddress.zip}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Email'}
                name={'email'}
                value={formik.values.email}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Phone Number'}
                name={'phoneNumber'}
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
            />

            <div className='flex flex-col gap-4 mt-2'>
                {formik.values.businessContactInfo.map((item, index) => (
                    <div className='flex flex-col bg-slate-200 rounded-md p-4' key={index}>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-bold'>firstName</div>
                            <div className='text-base font-medium'>
                                {item.personalContact.firstName}
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-bold'>lastName</div>
                            <div className='text-base font-medium'>
                                {item.personalContact.lastName}
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-bold'>email</div>
                            <div className='text-base font-medium'>
                                {item.personalContact.email ?? '--'}
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-bold'>phoneNumber</div>
                            <div className='text-base font-medium'>
                                {item.personalContact.phoneNumber ?? '--'}
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-lg font-bold'>Notes</div>
                            <div className='text-base font-medium'>
                                {item.personalContact.Notes ?? '---'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
