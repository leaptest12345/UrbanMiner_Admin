import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Column, Row } from 'simple-flexbox';
import { SidebarComponent, SidebarContext } from 'components/sidebar';
import HeaderComponent from 'components/header/HeaderComponent';
import PrivateRoutes from './PrivateRoutes';
import { onValue, ref } from 'firebase/database';
import { database } from 'configs/firebaseConfig';

const useStyles = createUseStyles({
    container: {
        height: '100%',
        minHeight: 850
    },
    mainBlock: {
        marginLeft: 270,
        '@media (max-width: 1080px)': {
            marginLeft: 0
        }
    },
    contentBlock: {
        marginTop: 54
    }
});

function PrivateSection() {
    const theme = useTheme();
    const [permissionStatus, setPermissionStatus] = useState(null);
    const classes = useStyles({ theme });
    const getUserPermissionDetail = async () => {
        try {
            const id = await localStorage.getItem('userID');
            if (id != null) {
                const refDetail = ref(database, `/ADMIN/USERS/${id}`);
                onValue(refDetail, (snapShot) => {
                    setPermissionStatus(snapShot.val()?.role?.PermissionStatus);
                });
            }
        } catch (error) {}
    };

    useEffect(() => {
        getUserPermissionDetail();
    }, []);

    return (
        <SidebarContext>
            <Row className={classes.container}>
                <SidebarComponent permission={permissionStatus} />
                <Column flexGrow={1} className={classes.mainBlock}>
                    <HeaderComponent />
                    <div className='p-9 mt-20'>
                        <PrivateRoutes />
                    </div>
                </Column>
            </Row>
        </SidebarContext>
    );
}

export default PrivateSection;
