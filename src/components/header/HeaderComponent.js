import React, { useContext, useEffect, useState } from 'react';
import { string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { SidebarContext } from 'hooks/useSidebar';
import SLUGS from 'resources/slugs';
import { IconBell, IconSearch } from 'assets/icons';
import DropdownComponent from 'components/dropdown';
import { onValue, ref } from 'firebase/database';
import { database } from 'configs/firebaseConfig';
import { UserContext } from 'util/userContext';
import { useSelector } from 'react-redux';
const useStyles = createUseStyles((theme) => ({
    avatar: {
        height: 35,
        width: 35,
        minWidth: 35,
        borderRadius: 50,
        marginLeft: 14,
        border: `1px solid ${theme.color.lightGrayishBlue2}`,
        '@media (max-width: 768px)': {
            marginLeft: 14
        }
    },
    container: {
        height: 40
    },
    name: {
        ...theme.typography.itemTitle,
        textAlign: 'right',
        '@media (max-width: 768px)': {
            display: 'none'
        }
    },
    separator: {
        borderLeft: `1px solid ${theme.color.lightGrayishBlue2}`,
        marginLeft: 32,
        marginRight: 32,
        height: 32,
        width: 2,
        '@media (max-width: 768px)': {
            marginLeft: 14,
            marginRight: 0
        }
    },
    title: {
        ...theme.typography.title,
        '@media (max-width: 1080px)': {
            marginLeft: 50
        },
        '@media (max-width: 468px)': {
            fontSize: 20
        }
    },
    iconStyles: {
        cursor: 'pointer',
        marginLeft: 25,
        '@media (max-width: 768px)': {
            marginLeft: 12
        }
    }
}));

function HeaderComponent() {
    const { push } = useHistory();
    const { currentItem } = useContext(SidebarContext);
    const theme = useTheme();
    const classes = useStyles({ theme });
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const { signOut1 } = React.useContext(UserContext);
    const user = useSelector((state) => state);
    console.log('userdetail from header', user.userReducer);
    let title;
    switch (true) {
        case currentItem === SLUGS.dashboard:
            title = 'Dashboard';
            break;
        case currentItem === SLUGS.items:
            title = 'items';
            break;
        case currentItem === SLUGS.UserList:
            title = 'UserList';
            break;
        case currentItem === SLUGS.AddAdmin:
            title = 'AddAdmin';
            break;
        case currentItem === SLUGS.AddProduct:
            title = 'AddProduct';
            break;
        case currentItem === SLUGS.UserDetail:
            title = 'UserDetail';
            break;
        case currentItem === SLUGS.ViewDraft:
            title = 'ViewDraft';
            break;
        case currentItem === SLUGS.PaymentList:
            title = 'PaymentList';
            break;
        case currentItem === SLUGS.CustomerDetail:
            title = 'CustomerDetail';
            break;
        case currentItem === SLUGS.FeedBack:
            title = 'FeedBack';
            break;
        case currentItem === SLUGS.TermAndCondition:
            title = 'TermAndCondition';
            break;
        case currentItem === SLUGS.privacyPolicy:
            title = 'privacyPolicy';
            break;
        case currentItem === SLUGS.settings:
            title = 'Settings';
            break;
        default:
            title = '';
    }

    function onSettingsClick() {
        push(SLUGS.settings);
    }

    useEffect(() => {
        getUserDetail();
    }, []);
    const getUserDetail = async () => {
        try {
            const userID = await localStorage.getItem('userID');
            if (userID != null) {
                const result = ref(database, `/ADMIN/USERS/${userID}`);
                onValue(result, (snapshot) => {
                    const { firstName, lastName, photo } = snapshot.val();
                    console.log('getting user Detail', firstName, lastName, photo);
                    setName(firstName + lastName);
                    setPhoto(photo);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Row className={classes.container} vertical='center' horizontal='space-between'>
            <span className={classes.title}>{title}</span>
            <Row vertical='center'>
                <div className={classes.iconStyles}>{/* <IconSearch /> */}</div>
                <div className={classes.iconStyles}>
                    {/* <DropdownComponent
                        label={<IconBell />}
                        options={[
                            {
                                label: 'Notification #1',
                                onClick: () => console.log('Notification #1')
                            },
                            {
                                label: 'Notification #2',
                                onClick: () => console.log('Notification #2')
                            },
                            {
                                label: 'Notification #3',
                                onClick: () => console.log('Notification #3')
                            },
                            {
                                label: 'Notification #4',
                                onClick: () => console.log('Notification #4')
                            }
                        ]}
                        position={{
                            top: 42,
                            right: -14
                        }}
                    /> */}
                </div>
                <div className={classes.separator}></div>
                <DropdownComponent
                    label={
                        <>
                            {/* <span className={classes.name}>{name ? name : 'Germán Llorente'}</span> */}
                            <img
                                src={
                                    photo
                                        ? photo
                                        : 'https://avatars3.githubusercontent.com/u/21162888?s=460&v=4'
                                }
                                alt='avatar'
                                className={classes.avatar}
                            />
                        </>
                    }
                    options={[
                        {
                            label: 'Settings',
                            onClick: onSettingsClick
                        },
                        {
                            label: 'Logout',
                            onClick: () => signOut1()
                        }
                    ]}
                    position={{
                        top: 52,
                        right: -6
                    }}
                />
            </Row>
        </Row>
    );
}

HeaderComponent.propTypes = {
    title: string
};

export default HeaderComponent;
