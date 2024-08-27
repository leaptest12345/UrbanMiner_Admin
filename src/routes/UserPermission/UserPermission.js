import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';

import { PermissionCard } from './_Components';
import { getUserDetails, updateUserDetails } from '../../Firebase/user/index';
import { Button } from 'component';

import { notify } from 'util/notify';
import { Input } from 'components/Input';
import { Delete } from '@mui/icons-material';

export const UserPermission = (props) => {
    const { userId } = props.location.state;
    const history = useHistory();

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        getUserPermissionDetails();
    }, []);

    const getUserPermissionDetails = async () => {
        const user = await getUserDetails(userId);
        setUserDetails(user);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            ccEmails: userDetails?.ccEmails ?? '',
            isCalculator: userDetails?.permissionStatus?.isCalculator ?? true,
            isBuyEditable: userDetails?.permissionStatus?.isBuyEditable ?? true,
            isInventoryEditable: userDetails?.permissionStatus?.isInventoryEditable ?? true,
            isSalesContractEditable: userDetails?.permissionStatus?.isSalesContractEditable ?? true,
            isPackingEditable: userDetails?.permissionStatus?.isPackingEditable ?? true,
            isInvoiceEditable: userDetails?.permissionStatus?.isInvoiceEditable ?? true,
            isMaterialEditable: userDetails?.permissionStatus?.isMaterialEditable ?? true
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            await updateUserDetails(userId, {
                permissionStatus: values,
                ccEmails: [...values.ccEmails]
            });
            notify('Permission Successfully Updated!', 1);
            history.goBack();
        }
    });

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-1 items-end gap-4'>
                    <div className='w-1/2'>
                        <Input
                            value={formik.values.email}
                            onChange={(e) => formik.setFieldValue('email', e.target.value)}
                            label={'CC Emails'}
                            placeholder={'Enter CC Emails'}
                        />
                    </div>
                    <div
                        onClick={() => {
                            if (formik.values.email) {
                                formik.setFieldValue('ccEmails', [
                                    ...formik.values.ccEmails,
                                    formik.values.email
                                ]);
                                formik.setFieldValue('email', '');
                            }
                        }}
                        className='px-4 py-2 rounded-md bg-black text-white'
                    >
                        +
                    </div>
                </div>
                <div className='flex flex-col gap-2 w-1/2'>
                    {formik.values.ccEmails &&
                        formik.values.ccEmails?.map((item) => {
                            return (
                                <div className='flex w-full justify-between px-4 py-2 rounded-md bg-white items-center'>
                                    <div className='text-black'>{item}</div>
                                    <Delete
                                        className='text-red-500'
                                        onClick={() => {
                                            formik.setFieldValue(
                                                'ccEmails',
                                                formik.values.ccEmails.filter(
                                                    (email) => email !== item
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            );
                        })}
                </div>
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isInventoryEditable', e.target.checked)}
                    type={'Inventory Items'}
                    warningTypes={'EDIT'}
                    value={formik.values.isInventoryEditable}
                />
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isBuyEditable', e.target.checked)}
                    type={'Buy Items'}
                    warningTypes={'EDIT'}
                    value={formik.vaxlues.isBuyEditable}
                />
                <PermissionCard
                    onChange={(e) =>
                        formik.setFieldValue('isSalesContractEditable', e.target.checked)
                    }
                    type={'Sales Contract'}
                    warningTypes={'EDIT'}
                    value={formik.values.isSalesContractEditable}
                />
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isPackingEditable', e.target.checked)}
                    type={'Packing Items'}
                    warningTypes={'EDIT'}
                    value={formik.values.isPackingEditable}
                />
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isInvoiceEditable', e.target.checked)}
                    type={'Invoice Items'}
                    warningTypes={'EDIT'}
                    value={formik.values.isInvoiceEditable}
                />
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isMaterialEditable', e.target.checked)}
                    type={'Material Items'}
                    warningTypes={'EDIT'}
                    value={formik.values.isMaterialEditable}
                />
                <PermissionCard
                    onChange={(e) => formik.setFieldValue('isCalculator', e.target.checked)}
                    type={'calculator'}
                    value={formik.values.isCalculator}
                    warningTypes={'USE'}
                />
            </div>
            <Button onClick={formik.handleSubmit} title={'UPDATE'} />
        </div>
    );
};
