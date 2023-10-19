import React, { useEffect, useState } from 'react';

import { useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';

import { database } from 'configs/firebaseConfig';
import { onValue, ref, set } from 'firebase/database';

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

import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';
import { ConfirmationCard } from 'components/ConfirmationCard';

export default function AdminList() {
    const theme = useTheme();
    const { push } = useHistory();

    const [users, setUsers] = useState([]);
    const [adminLevel, setAdminLevel] = useState('');
    const [subUserId, setSubUserId] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUserDetail = (id) => {
        let userData = null;
        const userRef = ref(database, `USERS/${id}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            userData = data;
        });
        return userData;
    };

    const getUsers = async () => {
        try {
            const id = await localStorage.getItem('userID');
            const userRef = ref(database, `/ADMIN/USERS/${id}`);
            const subUserRef = ref(database, `/ADMIN/USERS/${id}/SUB_USERS`);
            onValue(subUserRef, (snapShot1) => {
                setUsers(formateData(snapShot1.val()));
            });
            onValue(userRef, (snapShot) => {
                setAdminLevel(snapShot.val()?.adminLevel);
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

    const deleteSubUser = async () => {
        setIsVisible(false);
        const userId = await localStorage.getItem('userID');
        if (adminLevel == 1) {
            const userRef = ref(database, `/ADMIN/USERS/${subUserId}`);
            set(userRef, null);
        }
        const subUserRef = ref(database, `/ADMIN/USERS/${userId}/SUB_USERS/${subUserId}`);
        set(subUserRef, null);
        notify(`Your ${adminLevel == 1 ? 'Admin' : 'User'}  Successfully Deleted`, 0);
    };

    return (
        <div>
            <label className='form-check-label' htmlFor='flexCheckChecked'>
                AdminLevel:{parseInt(adminLevel) + 1}
            </label>
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => deleteSubUser()}
                type={adminLevel == 1 ? 'Admin' : 'SubUser'}
            />
            <Button type='submit' style={btn} onClick={() => onClick(SLUGS.AddAdmin, { id: null })}>
                {adminLevel == 1 ? 'Create New Admin' : 'Add New User'}
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
                            <StyledTableCell align='left'>
                                {adminLevel == 1 ? 'Admin List' : 'User List'}
                            </StyledTableCell>
                            {adminLevel != 1 ? null : (
                                <StyledTableCell align='left'>Actions</StyledTableCell>
                            )}
                            <StyledTableCell align='left'>Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formateData(users) &&
                            formateData(users).map((item, index) => {
                                const data = getUserDetail(item.ID);
                                return (
                                    <StyledTableRow align='left' key={item.ID + '-'}>
                                        <StyledTableCell component='th' scope='row'>
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align='left'>{data.email}</StyledTableCell>
                                        {adminLevel != 1 ? null : (
                                            <StyledTableCell align='left'>
                                                <Button
                                                    onClick={() =>
                                                        onClick(SLUGS.AddAdmin, { id: item.ID })
                                                    }
                                                >
                                                    Update Permission
                                                </Button>
                                            </StyledTableCell>
                                        )}
                                        <StyledTableCell align='left'>
                                            <Delete
                                                onClick={() => {
                                                    setSubUserId(item.ID);
                                                    setIsVisible(true);
                                                }}
                                            ></Delete>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
