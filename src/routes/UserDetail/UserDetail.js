import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { onValue, ref, set, update } from 'firebase/database';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { database } from 'configs/firebaseConfig';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';

import { convertSlugToUrl } from 'resources/utilities';
import SLUGS from 'resources/slugs';

import ImageModal from 'components/ImageModal/ImageModal';

import userDetailStyle from './styles';
import InputWithLabel from 'components/InputWithLabel';
import DatePickerWithLabel from 'components/DatePickerWithLabel';
import DropdownListWithLabel from 'components/DropdownListWithLabel';
import RadioButtonGroupWithLabel from 'components/RadioButtonGroupWithLabel';
import { Formik } from 'formik';
import { interactionType, materialTypes, recyclingMethod, referralSources } from './utils';
import ImagePickerWithLabel from 'components/ImagePickerWithLable';
import { uploadLicences, uploadProductImage } from 'util/uploadProductImage';
import ImagePicker from 'components/ImagePicker';

export default function UserDetail(props) {
    const theme = useTheme();
    const { push } = useHistory();
    const { styles } = userDetailStyle;
    const { id } = props.location.state;

    const [data, setData] = useState([]);
    const [user, setUser] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [userDetails, setUserDetails] = useState('');
    const [paymentTypes, setPaymentTypes] = useState([]);

    useEffect(() => {
        getUserDetail();
        getUserCustomer();
        getPaymentList();
    }, []);

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),

            state: data
        });
    }

    const btn = {
        position: 'absolute',
        top: '20%',
        right: '8%',
        height: 50,
        width: '10%',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        marginLeft: 40
    };

    const StyledTableCell = withStyles(() => ({
        head: {
            backgroundColor: theme.color.veryDarkGrayishBlue,
            color: theme.color.white
        },
        body: {
            fontSize: 14
        }
    }))(TableCell);
    const StyledTableRow = withStyles(() => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.color.lightGrayishBlue
            }
        }
    }))(TableRow);

    const getUserCustomer = () => {
        try {
            const refDetail = ref(database, `/USER_CUSTOMER/${id}`);
            onValue(refDetail, (snapShot) => {
                const data = snapShot.val();
                if (data) {
                    setData(formateData(data?.CUSTOMER));
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getPaymentList = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/PAYMENTTYPE');
            onValue(starCountRef, (snapshot) => {
                const data = formateData(snapshot.val());
                const labelValuePairs = data.map((item) => {
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

    const onDelete = async (item) => {
        try {
            const id = await localStorage.getItem('userID');
            const starCountRef = ref(database, `/USER_CUSTOMER/${id}/CUSTOMER/${item.ID}`);
            set(starCountRef, null);
            notify('Customer has been Deleted Successfully', 0);
        } catch (error) {
            console.log('error', error);
        }
    };

    const onViewDetailClick = (item) => {
        onClick(SLUGS.CustomerDetail, {
            userId: id,
            customerId: item.ID
        });
    };

    return (
        <div>
            <div style={styles.div}>
                {user?.photo ? <ImageModal url={user?.photo} imageStyle={styles.img} /> : null}

                <div style={{ marginTop: 20, width: '65%' }}>
                    {
                        <Formik
                            enableReinitialize
                            initialValues={{
                                firstName: userDetails?.firstName ?? user?.firstName ?? '',
                                lastName: userDetails?.lastName ?? user?.lastName ?? '',
                                phoneNumber: userDetails?.phoneNumber ?? user?.phoneNumber ?? '',
                                emailAddress: userDetails?.emailAddress ?? user?.email ?? ' ',
                                streetAddress: userDetails?.streetAddress ?? '',
                                city: userDetails?.city ?? '',
                                state: userDetails?.state ?? '',
                                postalCode: userDetails?.postalCode ?? '',
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
                                        streetAddress: values.streetAddress,
                                        city: values.city,
                                        state: values.state,
                                        postalCode: values.postalCode,
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
                                        }
                                    });
                                    await update(refDetail, {
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        email: values.emailAddress,
                                        cca2: values.country
                                    });
                                    notify('UserDetail Successfully Updated!', 1);
                                } catch (error) {
                                    console.log(error);
                                }
                            }}
                        >
                            {({ values, setFieldValue, handleSubmit, initialValues }) => {
                                return (
                                    <>
                                        <h3 style={{ marginTop: 10 }}>1) Full Name</h3>
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
                                        <h3 style={{ marginTop: 20 }}>1) Contact Information</h3>
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
                                        <h3 style={{ marginTop: 20 }}>3) Address</h3>
                                        <InputWithLabel
                                            value={values.streetAddress}
                                            onChange={(value) =>
                                                setFieldValue('streetAddress', value, false)
                                            }
                                            label='Street Address:'
                                        />
                                        <InputWithLabel
                                            label='City:'
                                            value={values.city}
                                            onChange={(value) =>
                                                setFieldValue('city', value, false)
                                            }
                                        />
                                        <InputWithLabel
                                            label='State/Province:'
                                            value={values.state}
                                            onChange={(value) =>
                                                setFieldValue('state', value, false)
                                            }
                                        />
                                        <InputWithLabel
                                            label='Postal/ZIP Code:'
                                            value={values.postalCode}
                                            onChange={(value) =>
                                                setFieldValue('postalCode', value, false)
                                            }
                                        />
                                        <InputWithLabel
                                            label='Country:'
                                            value={values.country}
                                            onChange={(value) =>
                                                setFieldValue('country', value, false)
                                            }
                                        />
                                        <h3 style={{ marginTop: 20 }}>4) Recycling History </h3>
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
                                        <h3 style={{ marginTop: 20 }}>
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
                                            label='Interaction Details:'
                                        />
                                        <h3 style={{ marginTop: 20 }}>
                                            6) Demographic Information
                                        </h3>
                                        <InputWithLabel
                                            type='number'
                                            label='Age:'
                                            value={values.age}
                                            onChange={(value) => setFieldValue('age', value, false)}
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
                                        <h3 style={{ marginTop: 20 }}>7) Recycling Preferences</h3>
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
                                        <h3 style={{ marginTop: 20 }}>
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
                                        <h3 style={{ marginTop: 20 }}>9) Social Media Profiles:</h3>
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
                                        <h3 style={{ marginTop: 20 }}>10) Referral Sources: </h3>
                                        <DropdownListWithLabel
                                            value={values.sourceOfReferral}
                                            label='How did you hear about our recycling program? Source of Referral:'
                                            onSelect={(value) =>
                                                setFieldValue('sourceOfReferral', value, false)
                                            }
                                            options={referralSources}
                                        />
                                        <h3 style={{ marginTop: 20 }}>
                                            11)Loyalty Program Participation:
                                        </h3>
                                        <InputWithLabel
                                            value={values.recyclingLoyaltyId}
                                            onChange={(value) =>
                                                setFieldValue('recyclingLoyaltyId', value, false)
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

                                        <Button
                                            type='submit'
                                            style={{
                                                ...styles.button,
                                                backgroundColor: theme.color.veryDarkGrayishBlue
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Update Details
                                        </Button>
                                    </>
                                );
                            }}
                        </Formik>
                    }
                </div>
            </div>
            {isApproved ? (
                <Button
                    type='Approve'
                    style={{
                        ...btn,
                        top: '18%'
                    }}
                    onClick={() => onApproved()}
                >
                    Approved
                </Button>
            ) : null}
            <Button
                type='Approve'
                style={{
                    ...btn,
                    top: '30%'
                }}
                onClick={() => {
                    onClick(SLUGS.UserPermission, {
                        userId: id
                    });
                }}
            >
                Edit Permission
            </Button>
            {data.length != 0 && <h1 style={styles.title}>CustomerList</h1>}
            <TableContainer component={Paper}>
                <Table aria-label='customized table'>
                    {data.length != 0 && (
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>Name</StyledTableCell>
                                <StyledTableCell align='left'>Email</StyledTableCell>
                                <StyledTableCell align='left'>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                    )}
                    <TableBody>
                        {data &&
                            data.map((item, index) => (
                                <StyledTableRow align='left' key={item.id}>
                                    <StyledTableCell component='th' scope='row'>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        {item?.UserFirstName + '  ' + item.UserLastName}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        {item.BusinessEmail}
                                    </StyledTableCell>
                                    <StyledTableCell align='left' style={styles.leftDiv}>
                                        <Button onClick={() => onViewDetailClick(item)}>
                                            View Detail
                                        </Button>
                                        <Delete onClick={() => onDelete(item)}></Delete>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
                <ToastContainer />
            </TableContainer>
        </div>
    );
}
