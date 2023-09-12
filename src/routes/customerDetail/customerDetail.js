import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, update } from 'firebase/database';

import { convertSlugToUrl } from 'resources/utilities';
import slugs from 'resources/slugs';

import ImageModal from 'components/ImageModal/ImageModal';

import { formateData } from 'util/formateData';
import { convertIntoDoller } from 'util/convertIntoDoller';

import customerStyle from './styles';
import { Formik } from 'formik';
import InputWithLabel from 'components/InputWithLabel';
import ImagePicker from 'components/ImagePicker';
import DatePickerWithLabel from 'components/DatePickerWithLabel';
import { uploadLicences } from 'util/uploadProductImage';
import RadioButtonGroupWithLabel from 'components/RadioButtonGroupWithLabel';
import DropdownListWithLabel from 'components/DropdownListWithLabel';
import { customerTypes, formateDate, jobTitles } from './utilts';
import { notify } from 'util/notify';
import moment from 'moment';

export default function CustomerDetail(props) {
    const theme = useTheme();
    const { styles } = customerStyle;
    const { userId, customerId } = props.location.state;
    const { push } = useHistory();

    const [data, setData] = useState([]);
    const [customerImages, setCustomerImages] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        getCustomerDetail();
        getInvoiceList();
        getCustomerImages();
    }, []);

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }

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

    const getCustomerImages = () => {
        try {
            const refDetail = ref(database, `/CUSTOMER_IMG/user:${userId}/customer:${customerId}`);
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                setCustomerImages(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomerDetail = () => {
        try {
            const refDetail = ref(database, `/USER_CUSTOMER/${userId}/CUSTOMER/${customerId}`);
            onValue(refDetail, (snapShot) => {
                const data = snapShot.val();
                setUser(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getInvoiceList = () => {
        try {
            const refDetail = ref(database, `/INVOICE_LIST`);
            let arr = [];
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                data.map((item) => {
                    if (item.userId == userId && item.customerId == customerId) {
                        arr.push(item);
                    }
                });
                setData(arr);
            });
        } catch (error) {
            console.log(error);
        }
    };

    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    const viewPdf = (id) => {
        // .ref(`/PDF/user:${userId}/customer:${customerId}/invoiceid:${ID}/1`)
        try {
            const refDetail = ref(
                database,
                `/PDF/user:${userId}/customer:${customerId}/invoiceid:${id}/`
            );
            onValue(refDetail, (snapShot) => {
                const data = formateData(snapShot.val());
                openInNewTab(data[0]?.url);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onActions = (item) => {
        if (item.type == 'draft') {
            onClick(slugs.ViewDraft, {
                userId,
                customerId,
                invoiceId: item.ID
            });
        } else viewPdf(item.ID);
    };

    return (
        <div>
            <div style={{ marginTop: 20, width: '65%' }}>
                {
                    <Formik
                        enableReinitialize
                        initialValues={{
                            userFirstName: user?.UserFirstName ?? '',
                            userLastName: user?.UserLastName ?? '',
                            businessEmail: user?.BusinessEmail ?? '',
                            businessAddress: user?.BusinessAddress ?? '',
                            businessName: user?.BusinessName ?? '',
                            nickName: user?.NickName ?? '',
                            ccEmail: user?.ccEmail ?? '',
                            positionAtTheCompany: user?.PositionAtTheCompany ?? '',
                            phoneNumber: {
                                cell: user?.phoneNumber?.cell,
                                work: user?.phoneNumber?.work,
                                extension: user?.phoneNumber?.extension
                            },
                            email: {
                                work: user?.email?.work,
                                personal: user?.email?.personal
                            },
                            customerType: user?.customerType,
                            typeOfProduct: user?.typeOfProduct,
                            age: user?.age,
                            gender: user?.gender,
                            firstInteractionDate: user?.firstInteractionDate
                                ? formateDate(user?.firstInteractionDate)
                                : '',
                            lastInteractionDate: user?.lastInteractionDate
                                ? formateDate(user?.lastInteractionDate)
                                : '',
                            family: {
                                marriedStatus: user?.family?.marriedStatus,
                                wifeName: user?.family?.wifeName,
                                childName: user?.family?.childName,
                                wifeDob: user?.family?.wifeDob
                                    ? formateDate(user?.family?.wifeDob)
                                    : '',
                                childDob: user?.family?.childDob
                                    ? formateDate(user?.family?.childDob)
                                    : ''
                            },
                            hobbyAndInterest: user?.hobbyAndInterest,
                            contactPreference: user?.contactPreference,
                            businessCard: user?.businessCard ?? '',
                            scrapCard: user?.scrapCard ?? '',
                            thumbPrint: user?.thumbPrint ?? ''
                        }}
                        onSubmit={async (values) => {
                            console.log('insde');
                            const refDetail = ref(
                                database,
                                `/USER_CUSTOMER/${userId}/CUSTOMER/${customerId}`
                            );
                            try {
                                await update(refDetail, {
                                    UserFirstName: values.userFirstName,
                                    UserLastName: values.userLastName,
                                    BusinessName: values.businessName,
                                    BusinessEmail: values.businessEmail,
                                    BusinessAddress: values.businessAddress,
                                    NickName: values.nickName,
                                    ccEmail: values.ccEmail,
                                    PositionAtTheCompany: values.positionAtTheCompany,
                                    phoneNumber: {
                                        cell: values.phoneNumber.cell,
                                        work: values.phoneNumber.work,
                                        extension: values.phoneNumber.extension
                                    },
                                    email: {
                                        work: values.email.work,
                                        personal: values.email.personal
                                    },
                                    customerType: values.customerType,
                                    typeOfProduct: values.typeOfProduct,
                                    age: values.age,
                                    gender: values.gender,
                                    firstInteractionDate: values.firstInteractionDate,
                                    lastInteractionDate: values.lastInteractionDate,
                                    family: {
                                        marriedStatus: values.family.marriedStatus,
                                        wifeName: values.family.wifeName,
                                        childName: values.family.childName,
                                        wifeDob: values.family.wifeDob,
                                        childDob: values.family.childDob
                                    },
                                    hobbyAndInterest: values.hobbyAndInterest,
                                    contactPreference: values.contactPreference,
                                    businessCard: values?.businessCard,
                                    scrapCard: values?.scrapCard,
                                    thumbPrint: values?.thumbPrint
                                });
                            } catch (error) {
                                console.log(error);
                            }
                            notify('Customer Detail Successfully Updated!', 1);
                        }}
                    >
                        {({ values, setFieldValue, handleSubmit, initialValues }) => {
                            return (
                                <>
                                    <h3 style={{ marginTop: 10 }}>1) Personal Info:</h3>
                                    <InputWithLabel
                                        value={values.userFirstName}
                                        onChange={(value) =>
                                            setFieldValue('userFirstName', value, false)
                                        }
                                        label='userFirstName:'
                                    />
                                    <InputWithLabel
                                        value={values.userLastName}
                                        onChange={(value) =>
                                            setFieldValue('userLastName', value, false)
                                        }
                                        label='userLastName:'
                                    />{' '}
                                    <InputWithLabel
                                        value={values.nickName}
                                        onChange={(value) =>
                                            setFieldValue('nickName', value, false)
                                        }
                                        label='nickName:'
                                    />
                                    <h3 style={{ marginTop: 20 }}>2) Business Information</h3>
                                    <InputWithLabel
                                        value={values.businessName}
                                        onChange={(value) =>
                                            setFieldValue('businessName', value, false)
                                        }
                                        label='businessName:'
                                    />
                                    <InputWithLabel
                                        value={values.businessEmail}
                                        onChange={(value) =>
                                            setFieldValue('businessEmail', value, false)
                                        }
                                        label='businessEmail:'
                                    />
                                    <InputWithLabel
                                        value={values.ccEmail}
                                        onChange={(value) => setFieldValue('ccEmail', value, false)}
                                        label='ccEmail:'
                                    />
                                    <InputWithLabel
                                        value={values.businessAddress}
                                        onChange={(value) =>
                                            setFieldValue('businessAddress', value, false)
                                        }
                                        label='businessAddress:'
                                    />
                                    <div style={styles.rowView}>
                                        <div style={styles.view}>
                                            <ImagePicker
                                                label='businessCard:'
                                                onChange={async (value) => {
                                                    const url = await uploadLicences(value);
                                                    setFieldValue('businessCard', url, false);
                                                }}
                                                selectedImage={values?.businessCard}
                                            />
                                        </div>
                                        <div style={styles.view}>
                                            <ImagePicker
                                                label='scrapCard:'
                                                onChange={async (value) => {
                                                    const url = await uploadLicences(value);
                                                    setFieldValue('scrapCard', url, false);
                                                }}
                                                selectedImage={values?.scrapCard}
                                            />
                                        </div>
                                        <div style={styles.view}>
                                            <ImagePicker
                                                label='thumbPrint:'
                                                onChange={async (value) => {
                                                    const url = await uploadLicences(value);
                                                    setFieldValue('thumbPrint', url, false);
                                                }}
                                                selectedImage={values?.thumbPrint}
                                            />
                                        </div>
                                    </div>
                                    <DropdownListWithLabel
                                        label='positionAtTheCompany'
                                        onSelect={(date) =>
                                            setFieldValue('positionAtTheCompany', date, false)
                                        }
                                        options={jobTitles}
                                    />
                                    <h3 style={{ marginTop: 20 }}>3) phone number </h3>
                                    <InputWithLabel
                                        value={values.phoneNumber.cell}
                                        onChange={(value) =>
                                            setFieldValue('phoneNumber.cell', value, false)
                                        }
                                        label='Cell Phone:'
                                    />
                                    <InputWithLabel
                                        value={values.phoneNumber.work}
                                        onChange={(value) =>
                                            setFieldValue('phoneNumber.work', value, false)
                                        }
                                        label='Work Phone:'
                                    />
                                    <InputWithLabel
                                        value={values.phoneNumber.extension}
                                        onChange={(value) =>
                                            setFieldValue('phoneNumber.extension', value, false)
                                        }
                                        label='Extension Phone:'
                                    />
                                    <h3 style={{ marginTop: 20 }}>4) Email </h3>
                                    <InputWithLabel
                                        value={values.email.personal}
                                        onChange={(value) =>
                                            setFieldValue('email.personal', value, false)
                                        }
                                        label='Personal Email:'
                                    />
                                    <InputWithLabel
                                        value={values.email.work}
                                        onChange={(value) =>
                                            setFieldValue('email.work', value, false)
                                        }
                                        label='Work Email:'
                                    />
                                    <h3 style={{ marginTop: 20 }}>4) Customer Information </h3>
                                    <DropdownListWithLabel
                                        value={values.customerType}
                                        label='Customer type:'
                                        onSelect={(value) =>
                                            setFieldValue('customerType', value, false)
                                        }
                                        options={customerTypes}
                                    />
                                    <InputWithLabel
                                        isTextArea={true}
                                        label="Type's of products customer produce’s"
                                        value={values.typeOfProduct}
                                        onChange={(value) =>
                                            setFieldValue('typeOfProduct', value, false)
                                        }
                                    />
                                    <h3 style={{ marginTop: 20 }}>
                                        5) Interactions and Communication
                                    </h3>
                                    <DatePickerWithLabel
                                        selectedDate={values.firstInteractionDate}
                                        onChange={(value) =>
                                            setFieldValue('firstInteractionDate', value, false)
                                        }
                                        label='First interaction date:'
                                    />
                                    <DatePickerWithLabel
                                        selectedDate={values.lastInteractionDate}
                                        onChange={(value) =>
                                            setFieldValue('lastInteractionDate', value, false)
                                        }
                                        label='Last interaction date:'
                                    />
                                    <h3 style={{ marginTop: 20 }}>6) Demographic Information</h3>
                                    <InputWithLabel
                                        type='number'
                                        label='Age:'
                                        value={values.age}
                                        onChange={(value) => setFieldValue('age', value, false)}
                                    />
                                    <RadioButtonGroupWithLabel
                                        label='Gender:'
                                        selectedValue={values.gender}
                                        onSelect={(value) => setFieldValue('gender', value, false)}
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' }
                                        ]}
                                    />
                                    <h3 style={{ marginTop: 20 }}>6) Family Information</h3>
                                    <RadioButtonGroupWithLabel
                                        label='Married Stat:'
                                        selectedValue={values.family.marriedStatus}
                                        onSelect={(value) =>
                                            setFieldValue('family.marriedStatus', value, false)
                                        }
                                        options={[
                                            { value: 'Married', label: 'Married' },
                                            { value: 'Single', label: 'Single' }
                                        ]}
                                    />
                                    {values.family.marriedStatus == 'Married' && (
                                        <>
                                            <InputWithLabel
                                                label="Wife's name:"
                                                value={values.family.wifeName}
                                                onChange={(value) =>
                                                    setFieldValue('family.wifeName', value, false)
                                                }
                                            />
                                            <DatePickerWithLabel
                                                selectedDate={values.family.wifeDob}
                                                onChange={(value) =>
                                                    setFieldValue('family.wifeDob', value, false)
                                                }
                                                label='WifeDob:'
                                            />
                                            <InputWithLabel
                                                label="Kid's name:"
                                                value={values.family.childName}
                                                onChange={(value) =>
                                                    setFieldValue('family.childName', value, false)
                                                }
                                            />
                                            <DatePickerWithLabel
                                                selectedDate={values.family.childDob}
                                                onChange={(value) =>
                                                    setFieldValue('family.childDob', value, false)
                                                }
                                                label='ChildDob:'
                                            />
                                        </>
                                    )}
                                    <h3 style={{ marginTop: 20 }}>6) Preferences </h3>
                                    <InputWithLabel
                                        isTextArea={true}
                                        label='hobbies and Interest:'
                                        value={values.hobbyAndInterest}
                                        onChange={(value) =>
                                            setFieldValue('hobbyAndInterest', value, false)
                                        }
                                    />
                                    <InputWithLabel
                                        isTextArea={true}
                                        label='Contact preference notes:'
                                        value={values.contactPreference}
                                        onChange={(value) =>
                                            setFieldValue('contactPreference', value, false)
                                        }
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
            {data.length != 0 ? (
                <TableContainer component={Paper}>
                    <Table aria-label='customized table'>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>InvoiceDate</StyledTableCell>
                                <StyledTableCell align='left'>TotalItems</StyledTableCell>
                                <StyledTableCell align='left'>Type</StyledTableCell>
                                <StyledTableCell align='left'>Amount</StyledTableCell>
                                <StyledTableCell align='left'>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data &&
                                data.map((item, index) => (
                                    <StyledTableRow align='left' key={item.id}>
                                        <StyledTableCell component='th' scope='row'>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.invoiceDate}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.totalItems}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {item.type}
                                        </StyledTableCell>
                                        <StyledTableCell component='th' scope='row'>
                                            {convertIntoDoller(item.Amount)}
                                        </StyledTableCell>
                                        <StyledTableCell align='left' style={styles.flexDiv}>
                                            <Button
                                                onClick={() => onActions(item)}
                                                style={{
                                                    backgroundColor: theme.color.BORDER,
                                                    color: theme.color.WHITE
                                                }}
                                            >
                                                {item.type == 'sent' ? 'View PDF' : 'View Detail'}
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <ToastContainer />
                </TableContainer>
            ) : null}
        </div>
    );
}
