import { Button } from '@material-ui/core';
import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-jss';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formateData } from 'util/formateData';
import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import { useHistory } from 'react-router-dom';

export default function AdminList() {
    const [users, setUsers] = useState([]);
    const theme = useTheme();
    const { push } = useHistory();
    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        try {
            const refDetail = ref(database, '/ADMIN/USERS');
            onValue(refDetail, (snapshOT) => {
                const data = snapshOT.val();
                setUsers(formateData(data));
            });
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

    const btn = {
        height: 50,
        width: '20%',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        position: 'absolute',
        right: 30,
        top: 30
    };

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),
            state: data
        });
    }
    return (
        <div>
            <Button type='submit' style={btn} onClick={() => onClick(SLUGS.AddAdmin, { id: null })}>
                Create New Admin
            </Button>
            <TableContainer
                style={{
                    marginTop: 30,
                    marginBottom: 20
                }}
                component={Paper}
            >
                <Table aria-label='customized table'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align='left'>No.</StyledTableCell>
                            <StyledTableCell align='left'>AdminList</StyledTableCell>
                            <StyledTableCell align='left'>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formateData(users) &&
                            formateData(users).map((item, index) => (
                                <StyledTableRow align='left' key={item.ID + '-'}>
                                    <StyledTableCell component='th' scope='row'>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align='left'>{item.email}</StyledTableCell>
                                    <StyledTableCell align='left'>
                                        <Button
                                            onClick={() => onClick(SLUGS.AddAdmin, { id: item.ID })}
                                        >
                                            Update Permission
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
