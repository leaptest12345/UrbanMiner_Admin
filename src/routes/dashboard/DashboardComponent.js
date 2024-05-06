import React, { useEffect, useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { createUseStyles, useTheme } from 'react-jss';
import { formateData } from 'util/formateData';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import { getAllInvoiceTotal } from '../../Firebase/contact/index';

const useStyles = createUseStyles({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    cardRow: {
        marginTop: 30,
        '@media (max-width: 768px)': {
            marginTop: 0
        }
    },
    miniCardContainer: {
        flexGrow: 1,
        marginRight: 30,
        '@media (max-width: 768px)': {
            marginTop: 30,
            maxWidth: 'none'
        }
    },
    todayTrends: {
        marginTop: 30
    },
    lastRow: {
        marginTop: 30
    },
    unresolvedTickets: {
        marginRight: 30,
        '@media (max-width: 1024px)': {
            marginRight: 0
        }
    },
    tasks: {
        marginTop: 0,
        '@media (max-width: 1024px)': {
            marginTop: 30
        }
    }
});

function DashboardComponent() {
    const [totalUser, setTotalUser] = useState('');
    const [totalSubUser, setTotalSubUser] = useState('');
    const [totalItem, setTotalItem] = useState('');
    const [adminLevel, setAdminLevel] = useState(1);
    const [subUserIds, setSubUserId] = useState([]);

    const [listOfInvoiceCount, setListOfInvoiceCount] = useState([]);

    const getAllData = async () => {
        try {
            const list = await getAllInvoiceTotal();
            setListOfInvoiceCount(list);
            const id = await localStorage.getItem('userID');
            const userRef = ref(database, `/ADMIN/USERS/${id}`);
            onValue(userRef, (snapshot) => {
                setAdminLevel(snapshot.val()?.adminLevel);
            });
            const subUserRef = ref(database, `/ADMIN/USERS/${id}/SUB_USERS`);
            onValue(subUserRef, (snapshot) => {
                const newArr = snapshot.val();
                snapshot.forEach((child) => {
                    if (child.val()) {
                        if (child.val().isDeleted != true) {
                            subUserIds.push(child.val().ID);
                        }
                    }
                });
                setTotalSubUser(
                    formateData(newArr).filter((item) => item.isDeleted != true).length
                );
            });
            const starCountRef = ref(database, '/USERS');
            onValue(starCountRef, (snapshot) => {
                const newArr = snapshot.val();
                setTotalUser(formateData(newArr).filter((item) => item.isDeleted != true).length);
            });
            const starCountRef2 = ref(database, '/ADMIN/ITEM');
            onValue(starCountRef2, (snapshot) => {
                const newArr = snapshot.val();
                setTotalItem(formateData(newArr).length);
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getAllData();
    }, []);
    const theme = useTheme();

    const classes = useStyles(theme);
    return (
        <Column className='flex flex-col gap-8'>
            <Row
                className={classes.cardsContainer}
                wrap
                flexGrow={1}
                horizontal='space-between'
                breakpoints={{ 768: 'column' }}
            >
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='AdminLevel'
                        value={adminLevel}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total User'
                        value={adminLevel == 1 ? totalUser : totalSubUser}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Items'
                        value={totalItem}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Contacts'
                        value={listOfInvoiceCount[0]?.total}
                    />
                </Row>
                <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                >
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Buy Items'
                        value={listOfInvoiceCount[1]?.total}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Sell Items'
                        value={listOfInvoiceCount[2]?.total}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Packing Items'
                        value={listOfInvoiceCount[3]?.total}
                    />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Sales Items'
                        value={listOfInvoiceCount[4]?.total}
                    />
                </Row>
            </Row>
            <MiniCardComponent
                className={classes.miniCardContainer}
                title='Total Inventory Items'
                value={listOfInvoiceCount[5]?.total}
            />
        </Column>
    );
}

export default DashboardComponent;
