import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { database } from 'configs/firebaseConfig';
import { onValue, ref, update } from 'firebase/database';
import { Button } from '@material-ui/core';
import { notify } from 'util/notify';
import { useHistory } from 'react-router-dom';

export const UserPermission = (props) => {
    const { userId } = props.location.state;
    const history = useHistory();

    const [isCreateInvoice, setIsCreateInvoice] = useState(true);
    const [isProduct, setIsProduct] = useState(true);
    const [isPriceSheet, setIsPriceSheet] = useState(true);
    const [isCalculator, setIsCalculator] = useState(true);
    const [isProfileAndSettings, setIsProfileAndSettings] = useState(true);

    useEffect(() => {
        getUserPermissionDetails();
    }, []);

    const getUserPermissionDetails = () => {
        const userRef = ref(database, `USERS/${userId}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot?.val()?.permissionStatus;

            if (data) {
                setIsCreateInvoice(data?.createInvoice);
                setIsProduct(data?.product);
                setIsPriceSheet(data?.priceSheet);
                setIsCalculator(data?.calculator);
                setIsProfileAndSettings(data?.profileAndSettings);
            }
        });
    };

    const onChangePermission = async () => {
        try {
            const userRef = ref(database, `USERS/${userId}`);
            await update(userRef, {
                permissionStatus: {
                    createInvoice: isCreateInvoice,
                    product: isProduct,
                    priceSheet: isPriceSheet,
                    calculator: isCalculator,
                    profileAndSettings: isProfileAndSettings
                }
            });
            notify('Pemission Successfully Updated!', 1);
            history.goBack();
        } catch (error) {}
    };

    return (
        <div>
            <div style={{ marginLeft: 40 }}>
                <div className='form-check' style={styles.formCheckStyle}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        style={styles.checkboxStyle}
                        checked={isCreateInvoice}
                        onChange={() => setIsCreateInvoice(!isCreateInvoice)}
                    />
                    <label
                        style={styles.labelStyle}
                        className='form-check-label'
                        htmlFor='flexCheckChecked'
                    >
                        User can <label style={styles.dangerLabel}>CREATE</label> customers and
                        invoices
                    </label>
                </div>
                <div className='form-check' style={styles.formCheckStyle}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        style={styles.checkboxStyle}
                        checked={isProduct}
                        onChange={() => setIsProduct(!isProduct)}
                    />
                    <label
                        style={styles.labelStyle}
                        className='form-check-label'
                        htmlFor='flexCheckChecked'
                    >
                        User can <label style={styles.dangerLabel}>VIEW</label> products and
                        subProducts
                    </label>
                </div>
                <div className='form-check' style={styles.formCheckStyle}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        style={styles.checkboxStyle}
                        checked={isPriceSheet}
                        onChange={() => setIsPriceSheet(!isPriceSheet)}
                    />
                    <label
                        style={styles.labelStyle}
                        className='form-check-label'
                        htmlFor='flexCheckChecked'
                    >
                        User can <label style={styles.dangerLabel}>VIEW</label> CategoryList and
                        Prices
                    </label>
                </div>
                <div className='form-check' style={styles.formCheckStyle}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        style={styles.checkboxStyle}
                        checked={isCalculator}
                        onChange={() => setIsCalculator(!isCalculator)}
                    />
                    <label
                        style={styles.labelStyle}
                        className='form-check-label'
                        htmlFor='flexCheckChecked'
                    >
                        User will be able to<label style={styles.dangerLabel}> USE</label>{' '}
                        calculator
                    </label>
                </div>
                <div className='form-check' style={styles.formCheckStyle}>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        style={styles.checkboxStyle}
                        checked={isProfileAndSettings}
                        onChange={() => setIsProfileAndSettings(!isProfileAndSettings)}
                    />
                    <label
                        style={styles.labelStyle}
                        className='form-check-label'
                        htmlFor='flexCheckChecked'
                    >
                        User can<label style={styles.dangerLabel}>VIEW/UPDATE</label> Profile and
                        Settings
                    </label>
                </div>
            </div>
            <Button onClick={() => onChangePermission()} style={styles.btnStyle}>
                <span style={{ color: 'white' }}>UPDATE</span>
            </Button>
        </div>
    );
};
