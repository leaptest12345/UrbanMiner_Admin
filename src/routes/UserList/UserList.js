import { database } from 'configs/firebaseConfig';
import { onValue, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-jss';
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
import { Delete } from '@material-ui/icons';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';
import { formateData } from 'util/formateData';
import SLUGS from 'resources/slugs';
import { convertSlugToUrl } from 'resources/utilities';
import ImageModal from 'components/ImageModal/ImageModal';

import styles from './styles';
import { getAuth } from 'firebase/auth';
export default function UserList() {
    const theme = useTheme();
    const { push } = useHistory();

    const [user, setUsers] = useState([1, 2]);
    const getUserList = () => {
        try {
            const starCountRef = ref(database, '/USERS');
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val();
                setUsers(formateData(data));
            });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getUserList();
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
    const onAction = async (item) => {
        try {
            const id = await localStorage.getItem('userID');
            if (id != item.ID) {
                const starCountRef = ref(database, `/USERS/${item.ID}`);
                if (starCountRef) {
                    update(starCountRef, {
                        isDeleted: !item.isDeleted
                    });
                    setTimeout(() => {
                        notify(
                            `User has been ${
                                !item.isDeleted ? 'DeActivated' : 'Activated'
                            } Successfully`,
                            !item.isDeleted ? 0 : 1
                        );
                    }, 200);
                }
            } else {
                notify("You can't delete this User", 0);
            }
        } catch (error) {
            console.log('error');
        }
    };
    return (
        <TableContainer component={Paper}>
            <Table aria-label='customized table'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='left'>No.</StyledTableCell>
                        <StyledTableCell align='left'>Photo</StyledTableCell>
                        <StyledTableCell align='left'>Name</StyledTableCell>
                        <StyledTableCell align='left'>PhoneNumber</StyledTableCell>
                        <StyledTableCell align='left'>Detail</StyledTableCell>
                        <StyledTableCell align='left'>Delete</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user &&
                        user.map((item, index) => (
                            <StyledTableRow align='left' key={item.id}>
                                <StyledTableCell component='th' scope='row'>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    {item.photo ? (
                                        <ImageModal url={item.photo} imageStyle={styles.img} />
                                    ) : (
                                        <div className={styles.img}>-</div>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell component='th' scope='row'>
                                    {item.firstName + '   ' + item.lastName}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    {item.phoneNumber
                                        ? (item.phoneNumber + '').substring(0, 3) +
                                          '   ' +
                                          (item.phoneNumber + '').substring(3, 6) +
                                          '   ' +
                                          (item.phoneNumber + '').substring(6, 10) +
                                          '   '
                                        : '-'}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <Button
                                        onClick={() => onClick(SLUGS.UserDetail, { id: item.ID })}
                                    >
                                        View Detail
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <Button
                                        style={{
                                            backgroundColor: 'grey'
                                        }}
                                        onClick={() => onAction(item)}
                                    >
                                        {!item.isDeleted ? 'DeActivate' : 'Activate'}
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                </TableBody>
            </Table>
            <ToastContainer />
        </TableContainer>
    );
}
