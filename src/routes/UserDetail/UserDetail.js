import React, { useEffect, useState } from 'react';

import { onValue, ref, update } from 'firebase/database';
import { useHistory } from 'react-router-dom';

import { database } from 'configs/firebaseConfig';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { uploadLicences } from 'util/uploadProductImage';

import { convertSlugToUrl } from 'resources/utilities';
import SLUGS from 'resources/slugs';

import ImageModal from 'components/ImageModal/ImageModal';
import InputWithLabel from 'components/InputWithLabel';
import DatePickerWithLabel from 'components/DatePickerWithLabel';
import DropdownListWithLabel from 'components/DropdownListWithLabel';
import RadioButtonGroupWithLabel from 'components/RadioButtonGroupWithLabel';
import ImagePicker from 'components/ImagePicker';
import MiniCardComponent from 'components/cards/MiniCardComponent';

import { Formik } from 'formik';
import { Button } from 'component';
import userDetailStyle from './styles';
import { interactionType, materialTypes, recyclingMethod, referralSources } from './utils';
import { getTotalInvoices } from '../../Firebase/contact/index';
import { UserTableHeader } from 'routes/UserList/UserTableHeader';
import { getAllMyUsers } from '../../Firebase/user/index';
import { UserCard } from 'routes/UserList/UserCard';
import { ArrowBack } from '@mui/icons-material';

export default function UserDetail(props) {
    const history = useHistory();
    const { styles } = userDetailStyle;

    const { id: givenId } = props.location.state;

    const [id, setId] = useState(givenId);
    const [user, setUser] = useState('');
    const [subUserList, setSubUserList] = useState([]);
    const [isApproved, setIsApproved] = useState(false);
    const [userDetails, setUserDetails] = useState('');
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [parentUserId, setParentUserId] = useState(null);
    const [userLevel, setUserLevel] = useState(1);

    const [invoicesTotal, setInvoicesTotal] = useState({
        totalContacts: 0,
        totalBuyInvoices: 0,
        totalSellInvoices: 0,
        totalPackingInvoices: 0,
        totalSalesInvoices: 0,
        totalInventoryItems: 0
    });

    useEffect(() => {
        getUserDetail();
        getPaymentList();
        getInitialValues();
    }, [refetch]);

    const getInitialValues = async () => {
        try {
            const totalContacts = await getTotalInvoices(id, 'CONTACTS');
            const totalBuyInvoices = await getTotalInvoices(id, 'BUY');
            const totalSellInvoices = await getTotalInvoices(id, 'SELL');
            const totalPackingInvoices = await getTotalInvoices(id, 'PACKING');
            const totalSalesInvoices = await getTotalInvoices(id, 'SALES');
            const totalInventoryItems = await getTotalInvoices(id, 'INVENTORY');

            const allUserLevel2 = await getAllMyUsers(id);
            const users = [];

            for (const user of allUserLevel2) {
                if (user?.userLevel != 3) {
                    users.push(user);
                    const allUserLevel3 = await getAllMyUsers(user?.ID);

                    for (const user3 of allUserLevel3) {
                        users.push(user3);
                    }
                }
            }

            setSubUserList(users.filter((item) => item.isDeleted != true));

            setInvoicesTotal({
                totalBuyInvoices: totalBuyInvoices,
                totalSellInvoices: totalSellInvoices,
                totalPackingInvoices: totalPackingInvoices,
                totalSalesInvoices: totalSalesInvoices,
                totalInventoryItems: totalInventoryItems,
                totalContacts: totalContacts
            });
        } catch (error) {
            console.log(error);
        }
    };

    function onClick(slug, data, parameters = {}) {
        history.push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

    const getPaymentList = async () => {
        try {
            const starCountRef = ref(database, '/ADMIN/PAYMENTTYPE');
            onValue(starCountRef, (snapshot) => {
                const data = formateData(snapshot.val());
                const labelValuePairs = data?.map((item) => {
                    return { label: item.title, value: item.title };
                });
                setPaymentTypes(labelValuePairs);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getUserDetail = () => {
        try {
            const refDetail = ref(database, `USERS/${id}`);
            const starCountRef = ref(database, `/USER_DETAILS/${id}`);
            onValue(starCountRef, (snapShot) => {
                setUserDetails(snapShot.val());
            });

            onValue(refDetail, (snapShot) => {
                setIsApproved(snapShot.val()?.isApproved);

                setUser(snapShot.val());

                setUserLevel(snapShot?.val()?.userLevel ?? 1);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onApproved = () => {
        try {
            const refDetail = ref(database, `/USERS/${id}`);
            update(refDetail, {
                isApproved: true
            });
            setIsApproved(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {/* {userLevel === 2 || userLevel === 3 ? (
                <div
                    onClick={() => {
                        setId(parentUserId);
                        setRefetch(!refetch);
                    }}
                    className='cursor-pointer p-4'
                >
                    <ArrowBack />
                </div>
            ) : null} */}
            <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4'>
                        <MiniCardComponent
                            onClick={() =>
                                onClick(SLUGS.invoiceList, { userId: id, type: 'CONTACT' })
                            }
                            title={'Contacts'}
                            value={invoicesTotal.totalContacts}
                        />
                        <MiniCardComponent
                            onClick={() => onClick(SLUGS.invoiceList, { userId: id, type: 'BUY' })}
                            title={'Buy Invoice'}
                            value={invoicesTotal?.totalBuyInvoices}
                        />
                        <MiniCardComponent
                            onClick={() => onClick(SLUGS.invoiceList, { userId: id, type: 'SELL' })}
                            title={'Sell Invoice'}
                            value={invoicesTotal?.totalSellInvoices}
                        />
                    </div>
                    <div className='flex flex-row gap-4'>
                        <MiniCardComponent
                            onClick={() =>
                                onClick(SLUGS.invoiceList, { userId: id, type: 'PACKING' })
                            }
                            title={'Packing Invoice'}
                            value={invoicesTotal?.totalPackingInvoices}
                        />
                        <MiniCardComponent
                            onClick={() =>
                                onClick(SLUGS.invoiceList, { userId: id, type: 'SALES' })
                            }
                            title={'Sales Invoice'}
                            value={invoicesTotal?.totalSalesInvoices}
                        />
                        <MiniCardComponent
                            onClick={() =>
                                onClick(SLUGS.invoiceList, { userId: id, type: 'INVENTORY' })
                            }
                            title={'Inventory Items'}
                            value={invoicesTotal?.totalInventoryItems}
                        />
                    </div>
                </div>

                {user?.photo ? <ImageModal url={user?.photo} imageStyle={styles.img} /> : null}
                {!isApproved ? <Button title='Approve User' onClick={() => onApproved()} /> : null}
                <Button
                    title='Edit Permission'
                    onClick={() => {
                        onClick(SLUGS.UserPermission, {
                            userId: id
                        });
                    }}
                />
                {subUserList?.length > 0 && (
                    <>
                        <div className='text-2xl font-bold text-black'>My Sub Users</div>
                        <UserTableHeader isSecondary={true} />
                        {subUserList &&
                            subUserList.map((item, index) => {
                                return (
                                    <UserCard
                                        userType={
                                            item?.userLevel === 2 ? 'Individual Yard' : 'Employee'
                                        }
                                        key={'user' + index}
                                        index={index}
                                        // totalUsers={subUserList.length}
                                        totalUsers={0}
                                        photo={item?.photo}
                                        name={item?.firstName + ' ' + item?.lastName}
                                        phoneNumber={item?.phoneNumber}
                                        onViewDetails={() => {
                                            // history.goBack();
                                            setId(item?.ID);
                                            setParentUserId(givenId);
                                            setRefetch(!refetch);
                                        }}
                                        // onDelete={() => {
                                        //     setUserDeletionData(item);
                                        //     setIsVisible(true);
                                        // }}
                                    />
                                );
                            })}
                    </>
                )}

                <div style={{ marginTop: 20, width: '65%' }}>
                    {
                        <Formik
                            enableReinitialize
                            initialValues={{
                                firstName: user?.firstName ?? '',
                                lastName: user?.lastName ?? '',
                                phoneNumber: user?.phoneNumber ?? '',
                                emailAddress: user?.email ?? ' ',
                                companyName: user?.companyName ?? '',
                                companyEmail: user?.companyEmail ?? '',
                                companyPhone: user?.companyPhone ?? '',
                                address: {
                                    street: user?.address?.street ?? '',
                                    city: user?.address?.city ?? '',
                                    state: user?.address?.state ?? '',
                                    zipCode: user?.address?.zipCode ?? ''
                                },
                                country: userDetails?.country ?? user?.cca2 ?? '',
                                recyclingDate: userDetails?.recyclingDate
                                    ? new Date(userDetails?.recyclingDate)
                                    : '',
                                materialType: userDetails?.materialType ?? '',
                                quantityRecycled: userDetails?.quantityRecycled ?? '',
                                interactionDate: userDetails?.interactionDate
                                    ? new Date(userDetails?.interactionDate)
                                    : '',
                                interactionType: userDetails?.interactionType ?? '',
                                interactionDetail: userDetails?.interactionDetail ?? '',
                                age: userDetails?.age ?? '',
                                gender: userDetails?.gender ?? '',
                                occupation: userDetails?.occupation ?? '',
                                recyclingMethod: userDetails?.recyclingMethod ?? '',
                                facebookProfile: userDetails?.facebookProfile ?? '',
                                recyclingEnNo: userDetails?.recyclingEnNo ?? '',
                                paymentType: userDetails?.paymentType ?? '',
                                twitterProfile: userDetails?.twitterProfile ?? '',
                                instagramProfile: userDetails?.instagramProfile ?? '',
                                sourceOfReferral: userDetails?.sourceOfReferral ?? '',
                                recyclingLoyaltyId: userDetails?.recyclingLoyaltyId ?? '',
                                recyclingLoyaltyCurrentPoint:
                                    userDetails?.recyclingLoyaltyCurrentPoint ?? '',
                                license: {
                                    driver: {
                                        photo: userDetails?.license?.driver?.photo ?? '',
                                        expireDate: userDetails?.license?.driver?.expireDate
                                            ? new Date(userDetails?.license?.driver?.expireDate)
                                            : ''
                                    },
                                    business: {
                                        photo: userDetails?.license?.business?.photo ?? '',
                                        expireDate: userDetails?.license?.business?.expireDate
                                            ? new Date(userDetails?.license?.business?.expireDate)
                                            : ''
                                    },
                                    scrapRecycling: {
                                        photo: userDetails?.license?.scrapRecycling?.photo ?? '',
                                        expireDate: userDetails?.license?.scrapRecycling?.expireDate
                                            ? new Date(
                                                  userDetails?.license?.scrapRecycling?.expireDate
                                              )
                                            : ''
                                    },
                                    federal: {
                                        photo: userDetails?.license?.federal?.photo ?? '',
                                        expireDate: userDetails?.license?.federal?.expireDate
                                            ? new Date(userDetails?.license?.federal?.expireDate)
                                            : ''
                                    }
                                }
                            }}
                            onSubmit={async (values) => {
                                const starCountRef = ref(database, `/USER_DETAILS/${id}`);
                                const refDetail = ref(database, `USERS/${id}`);

                                try {
                                    await update(starCountRef, {
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        phoneNumber: values.phoneNumber,
                                        emailAddress: values.emailAddress,
                                        country: values.country,
                                        recyclingDate: values.recyclingDate,
                                        materialType: values.materialType,
                                        quantityRecycled: values.quantityRecycled,
                                        interactionDate: values.interactionDate,
                                        interactionType: values.interactionType,
                                        interactionDetail: values.interactionDetail,
                                        age: values.age,
                                        gender: values.gender,
                                        occupation: values.occupation,
                                        recyclingMethod: values.recyclingMethod,
                                        facebookProfile: values.facebookProfile,
                                        recyclingEnNo: values.recyclingEnNo,
                                        paymentType: values.paymentType,
                                        twitterProfile: values.twitterProfile,
                                        instagramProfile: values.instagramProfile,
                                        sourceOfReferral: values.sourceOfReferral,
                                        recyclingLoyaltyId: values.recyclingLoyaltyId,
                                        recyclingLoyaltyCurrentPoint:
                                            values.recyclingLoyaltyCurrentPoint,
                                        license: {
                                            driver: {
                                                photo: values?.license?.driver?.photo ?? '',
                                                expireDate: values?.license?.driver?.expireDate
                                            },
                                            business: {
                                                photo: values?.license?.business?.photo ?? '',
                                                expireDate: values?.license?.business?.expireDate
                                            },
                                            scrapRecycling: {
                                                photo: values?.license?.scrapRecycling?.photo ?? '',
                                                expireDate:
                                                    values?.license?.scrapRecycling?.expireDate
                                            },
                                            federal: {
                                                photo: values?.license?.federal?.photo ?? '',
                                                expireDate: values?.license?.federal?.expireDate
                                            }
                                        },
                                        companyName: values.companyName
                                    });
                                    await update(refDetail, {
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        email: values.emailAddress,
                                        phoneNumber: values.phoneNumber,
                                        companyName: values.companyName,
                                        address: values.address,
                                        companyEmail: values.companyEmail,
                                        companyPhone: values.companyPhone
                                    });
                                    notify('UserDetail Successfully Updated!', 1);
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            {({ values, setFieldValue, handleSubmit, initialValues }) => {
                                return (
                                    <div className='flex flex-col gap-6'>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                1) Personal Information
                                            </h3>
                                            <InputWithLabel
                                                value={values.firstName}
                                                onChange={(value) =>
                                                    setFieldValue('firstName', value, false)
                                                }
                                                label='firstName:'
                                            />
                                            <InputWithLabel
                                                value={values.lastName}
                                                onChange={(value) =>
                                                    setFieldValue('lastName', value, false)
                                                }
                                                label='LastName:'
                                            />
                                            <InputWithLabel
                                                value={values.companyName}
                                                onChange={(value) =>
                                                    setFieldValue('companyName', value, false)
                                                }
                                                label='companyName:'
                                            />
                                            <InputWithLabel
                                                value={values.companyEmail}
                                                onChange={(value) =>
                                                    setFieldValue('companyEmail', value, false)
                                                }
                                                label='companyEmail:'
                                            />
                                            <InputWithLabel
                                                value={values.companyPhone}
                                                onChange={(value) =>
                                                    setFieldValue('companyPhone', value, false)
                                                }
                                                label='companyPhone:'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                2) Contact Information
                                            </h3>
                                            <InputWithLabel
                                                type='number'
                                                value={values.phoneNumber}
                                                onChange={(value) =>
                                                    setFieldValue('phoneNumber', value, false)
                                                }
                                                label='Phone Number:'
                                            />
                                            <InputWithLabel
                                                value={values.emailAddress}
                                                type='email'
                                                onChange={(value) =>
                                                    setFieldValue('emailAddress', value, false)
                                                }
                                                label='Email Address:'
                                            />
                                        </div>
                                        <div style={styles.rowView}>
                                            <div style={styles.view}>
                                                <ImagePicker
                                                    label='DriversLicense:'
                                                    onChange={async (value) => {
                                                        const url = await uploadLicences(value);
                                                        setFieldValue(
                                                            'license.driver.photo',
                                                            url,
                                                            false
                                                        );
                                                    }}
                                                    selectedImage={values?.license?.driver?.photo}
                                                />
                                                <DatePickerWithLabel
                                                    label='expireDate'
                                                    selectedDate={values.license.driver.expireDate}
                                                    onChange={(value) => {
                                                        setFieldValue(
                                                            'license.driver.expireDate',
                                                            value,
                                                            false
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div style={styles.view}>
                                                <ImagePicker
                                                    label='BusinessLicense:'
                                                    onChange={async (value) => {
                                                        const url = await uploadLicences(value);
                                                        setFieldValue(
                                                            'license.business.photo',
                                                            url,
                                                            false
                                                        );
                                                    }}
                                                    selectedImage={values?.license?.business?.photo}
                                                />
                                                <DatePickerWithLabel
                                                    label='expireDate'
                                                    selectedDate={
                                                        values.license.business.expireDate
                                                    }
                                                    onChange={(value) => {
                                                        setFieldValue(
                                                            'license.business.expireDate',
                                                            value,
                                                            false
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div style={styles.view}>
                                                <ImagePicker
                                                    label='ScrapRecyclingLicense:'
                                                    onChange={async (value) => {
                                                        const url = await uploadLicences(value);
                                                        setFieldValue(
                                                            'license.scrapRecycling.photo',
                                                            url,
                                                            false
                                                        );
                                                    }}
                                                    selectedImage={
                                                        values?.license?.scrapRecycling?.photo
                                                    }
                                                />
                                                <DatePickerWithLabel
                                                    label='expireDate'
                                                    selectedDate={
                                                        values.license.scrapRecycling.expireDate
                                                    }
                                                    onChange={(value) => {
                                                        setFieldValue(
                                                            'license.scrapRecycling.expireDate',
                                                            value,
                                                            false
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div style={styles.view}>
                                                <ImagePicker
                                                    label='FederalLicense:'
                                                    onChange={async (value) => {
                                                        const url = await uploadLicences(value);
                                                        setFieldValue(
                                                            'license.federal.photo',
                                                            url,
                                                            false
                                                        );
                                                    }}
                                                    selectedImage={values?.license?.federal?.photo}
                                                />
                                                <DatePickerWithLabel
                                                    label='expireDate'
                                                    selectedDate={values.license.federal.expireDate}
                                                    onChange={(value) => {
                                                        setFieldValue(
                                                            'license.federal.expireDate',
                                                            value,
                                                            false
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                3) Address
                                            </h3>
                                            <InputWithLabel
                                                value={values.address.street}
                                                onChange={(value) =>
                                                    setFieldValue('address.street', value, false)
                                                }
                                                label='Street Address:'
                                            />
                                            <InputWithLabel
                                                label='City:'
                                                value={values.address.city}
                                                onChange={(value) =>
                                                    setFieldValue('address.city', value, false)
                                                }
                                            />
                                            <InputWithLabel
                                                label='State/Province:'
                                                value={values.address.state}
                                                onChange={(value) =>
                                                    setFieldValue('address.state', value, false)
                                                }
                                            />
                                            <InputWithLabel
                                                label='Postal/ZIP Code:'
                                                value={values.address.zipCode}
                                                onChange={(value) =>
                                                    setFieldValue('address.zipCode', value, false)
                                                }
                                            />
                                            <InputWithLabel
                                                label='Country:'
                                                value={values.country}
                                                onChange={(value) =>
                                                    setFieldValue('country', value, false)
                                                }
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                4) Recycling History
                                            </h3>
                                            <DatePickerWithLabel
                                                label='Recycling Date:'
                                                selectedDate={values.recyclingDate}
                                                onChange={(value) => {
                                                    setFieldValue('recyclingDate', value, false);
                                                }}
                                            />
                                            <DropdownListWithLabel
                                                value={values.materialType}
                                                label='Material Type:'
                                                onSelect={(value) =>
                                                    setFieldValue('materialType', value, false)
                                                }
                                                options={materialTypes}
                                            />
                                            <InputWithLabel
                                                label='Quantity Recycled:'
                                                value={values.quantityRecycled}
                                                onChange={(value) =>
                                                    setFieldValue('quantityRecycled', value, false)
                                                }
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                5) Interactions and Communication
                                            </h3>

                                            <DatePickerWithLabel
                                                selectedDate={values.interactionDate}
                                                onChange={(value) =>
                                                    setFieldValue('interactionDate', value, false)
                                                }
                                                label='Interaction Date:'
                                            />
                                            <DropdownListWithLabel
                                                value={values.interactionType}
                                                label='Interaction Type:'
                                                onSelect={(value) =>
                                                    setFieldValue('interactionType', value, false)
                                                }
                                                options={interactionType}
                                            />
                                            <InputWithLabel
                                                value={values.interactionDetail}
                                                onChange={(value) =>
                                                    setFieldValue('interactionDetail', value, false)
                                                }
                                                isTextArea={true}
                                                label='Interaction Details:'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                6) Demographic Information
                                            </h3>

                                            <InputWithLabel
                                                type='number'
                                                label='Age:'
                                                value={values.age}
                                                onChange={(value) =>
                                                    setFieldValue('age', value, false)
                                                }
                                            />
                                            <RadioButtonGroupWithLabel
                                                label='Gender:'
                                                selectedValue={values.gender}
                                                onSelect={(value) =>
                                                    setFieldValue('gender', value, false)
                                                }
                                                options={[
                                                    { value: 'male', label: 'Male' },
                                                    { value: 'female', label: 'Female' }
                                                ]}
                                            />
                                            <InputWithLabel
                                                value={values.occupation}
                                                onChange={(value) =>
                                                    setFieldValue('occupation', value, false)
                                                }
                                                label='Occupation:'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                7) Recycling Preferences
                                            </h3>

                                            <DropdownListWithLabel
                                                value={values.recyclingMethod}
                                                label='Preferred Recycling Method:'
                                                onSelect={(value) =>
                                                    setFieldValue('recyclingMethod', value, false)
                                                }
                                                options={recyclingMethod}
                                            />
                                            <RadioButtonGroupWithLabel
                                                label='Recycling Program Enrollment:'
                                                selectedValue={values.recyclingEnNo}
                                                onSelect={(value) =>
                                                    setFieldValue('recyclingEnNo', value, false)
                                                }
                                                options={[
                                                    { value: 'yes', label: 'Yes' },
                                                    { value: 'no', label: 'No' }
                                                ]}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                8) Payment performance type
                                            </h3>

                                            <DropdownListWithLabel
                                                label='type:'
                                                value={values.paymentType}
                                                onSelect={(value) =>
                                                    setFieldValue('paymentType', value, false)
                                                }
                                                options={paymentTypes}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                9) Social Media Profiles:
                                            </h3>

                                            <InputWithLabel
                                                value={values.facebookProfile}
                                                onChange={(value) =>
                                                    setFieldValue('facebookProfile', value, false)
                                                }
                                                label='Facebook Handle:'
                                            />
                                            <InputWithLabel
                                                value={values.twitterProfile}
                                                onChange={(value) =>
                                                    setFieldValue('twitterProfile', value, false)
                                                }
                                                label='Twitter Handle:'
                                            />
                                            <InputWithLabel
                                                value={values.instagramProfile}
                                                onChange={(value) =>
                                                    setFieldValue('instagramProfile', value, false)
                                                }
                                                label='Instagram Handle:'
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                10) Referral Sources:
                                            </h3>

                                            <DropdownListWithLabel
                                                value={values.sourceOfReferral}
                                                label='How did you hear about our recycling program? Source of Referral:'
                                                onSelect={(value) =>
                                                    setFieldValue('sourceOfReferral', value, false)
                                                }
                                                options={referralSources}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='font-bold text-xl text-black'>
                                                11)Loyalty Program Participation:
                                            </h3>

                                            <InputWithLabel
                                                value={values.recyclingLoyaltyId}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'recyclingLoyaltyId',
                                                        value,
                                                        false
                                                    )
                                                }
                                                label='Recycling Loyalty Program ID:'
                                            />
                                            <InputWithLabel
                                                value={values.recyclingLoyaltyCurrentPoint}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'recyclingLoyaltyCurrentPoint',
                                                        value,
                                                        false
                                                    )
                                                }
                                                label='Current Recycling Loyalty Points:'
                                            />
                                        </div>
                                        <Button title='Update Details' onClick={handleSubmit} />
                                    </div>
                                );
                            }}
                        </Formik>
                    }
                </div>
            </div>
        </div>
    );
}
