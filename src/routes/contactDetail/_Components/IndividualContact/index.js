import InputWithLabel from 'components/InputWithLabel';
import { useFormik } from 'formik';

export const IndividualContact = ({ individualInfo }) => {
    const formik = useFormik({
        initialValues: individualInfo || {
            name: '',
            address: {
                city: '',
                state: '',
                streetAddress: '',
                zip: ''
            },
            contactInfo: {
                email: '',
                phoneNumber: ''
            }
        },
        enableReinitialize: true,
        onSubmit: (values) => {}
    });

    return (
        <div>
            <InputWithLabel
                label={'Name'}
                name={'name'}
                value={formik.values.name}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Street Address'}
                name={'streetAddress'}
                value={formik.values.address.streetAddress}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'City'}
                name={'city'}
                value={formik.values.address.city}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'State'}
                name={'state'}
                value={formik.values.address.state}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Zip'}
                name={'zip'}
                value={formik.values.address.zip}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Email'}
                name={'email'}
                value={formik.values.contactInfo.email}
                onChange={formik.handleChange}
            />
            <InputWithLabel
                label={'Phone Number'}
                name={'phoneNumber'}
                value={formik.values.contactInfo.phoneNumber}
                onChange={formik.handleChange}
            />
        </div>
    );
};
