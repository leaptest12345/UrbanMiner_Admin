import React, { useEffect, useState } from 'react';
import { Column, Row } from 'simple-flexbox';
import MiniCardComponent from 'components/cards/MiniCardComponent';
import TodayTrendsComponent from './TodayTrendsComponent';
import UnresolvedTicketsComponent from './UnresolvedTicketsComponent';
import TasksComponent from './TasksComponent';
import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { async } from '@firebase/util';
import { Box, Button } from '@material-ui/core';
import { createUseStyles, useTheme } from 'react-jss';
import { formateData } from 'util/formateData';

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
  const [totalUser,setTotalUser]=useState('')
  const [totalItem,setTotalItem]=useState('')
  const [totalInvoice,setTotalInvoice]=useState('')
  const getAllData=async()=>{
    try{
        const starCountRef = ref(database, '/USERS');
        onValue(starCountRef, (snapshot) => {
        const newArr = snapshot.val();
        setTotalUser(formateData(newArr).length)
        });
        const starCountRef1 = ref(database, '/INVOICE');
        onValue(starCountRef1, (snapshot) => {
        const newArr = snapshot.val();
        setTotalInvoice(formateData(newArr).length)
        });
        const starCountRef2 = ref(database, '/ADMIN/ITEM');
        onValue(starCountRef2, (snapshot) => {
        const newArr = snapshot.val();
        setTotalItem(formateData(newArr).length)
        });
    }
    catch(error)
    {
        console.log(error)
    }
  }
    useEffect(()=>{
       getAllData()
    },[])
    const theme=useTheme()
  
  
    const classes = useStyles(theme);
    return (
        <Column>
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
                        title='Total User'
                        value={totalUser}
                   />
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='Total Items'
                        value={totalItem}
                    />
                   </Row>
                {/* <Row
                    className={classes.cardRow}
                    wrap
                    flexGrow={1}
                    horizontal='space-between'
                    breakpoints={{ 384: 'column' }}
                > */}
                    <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='TotalInvoice'
                        value={totalInvoice}
                    />
                    {/* <MiniCardComponent
                        className={classes.miniCardContainer}
                        title='On hold'
                        value='64'
                    /> */}
                {/* </Row> */}
                    </Row>
            {/* <div className={classes.todayTrends}>
                <TodayTrendsComponent />
            </div> */}
            {/* <Row
                horizontal='space-between'
                className={classes.lastRow}
                breakpoints={{ 1024: 'column' }}
            >
                <UnresolvedTicketsComponent containerStyles={classes.unresolvedTickets} />
                <TasksComponent containerStyles={classes.tasks} />
            </Row> */}
        </Column>
    );
}

export default DashboardComponent;
