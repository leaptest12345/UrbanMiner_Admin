import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Delete } from '@material-ui/icons';
import { Button } from '@material-ui/core';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { useStyles } from './styles';

export default function Items() {
    const theme = useTheme();
    const id = uuid().slice(0, 8);
    const classes = useStyles({ theme });

    const [itemName, setItemName] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        getItemValues();
    }, []);

    const btn = {
        height: 50,
        width: '20%',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        marginLeft: 40
    };

    const addedOrNot = () => {
        let temp = false;
        data.map((item) => {
            if (item.title.toLowerCase() == itemName.trim().toLocaleLowerCase()) temp = true;
        });
        return temp;
    };

    function handleSubmit(e) {
        e.preventDefault();
        try {
            if (itemName.trim() && !addedOrNot()) {
                const starCount = ref(database, `/ADMIN/ITEM/${id}`);
                set(starCount, {
                    ID: id,
                    title: itemName.trim()
                });
                setItemName('');
                notify('Item Successfully Added!', 1);
            } else {
                if (itemName.trim()) notify('Item Already Added!', 2);
                else notify('invalid itemName', 0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onchange = (event) => {
        setItemName(event.target.value);
    };

    const getItemValues = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/ITEM');
            onValue(starCountRef, (snapshot) => {
                const data = formateData(snapshot.val());
                setData(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = (item) => {
        try {
            const starCount = ref(database, `/ADMIN/ITEM/${item.ID}`);
            set(starCount, null);
            setTimeout(() => {
                notify('Item has been Deleted!', 0);
            }, 100);
        } catch (error) {
            console.log(error);
        }
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

    return (
        <div className={classes.mainDiv}>
            <form onSubmit={handleSubmit}>
                <div className={classes.addItemView}>
                    <input value={itemName} className={classes.input} onChange={onchange} />
                    <Button type='submit' style={btn}>
                        Add
                    </Button>
                </div>
            </form>
            <TableContainer
                style={{
                    marginTop: 100
                }}
                component={Paper}
            >
                <Table aria-label='customized table'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='left'>No.</StyledTableCell>
                            <StyledTableCell align='left'>ItemName</StyledTableCell>
                            <StyledTableCell align='left'>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.map((item, index) => (
                                <StyledTableRow align='left' key={item.id}>
                                    <StyledTableCell component='th' scope='row'>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align='left'>{item.title}</StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        <Delete onClick={() => onDelete(item)}></Delete>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ToastContainer />
        </div>
    );
}
