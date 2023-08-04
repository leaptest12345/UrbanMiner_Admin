import { database } from 'configs/firebaseConfig';
import { onValue, ref, set, update } from 'firebase/database';
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
import { Button } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { notify } from 'util/notify';
import { ToastContainer } from 'react-toastify';
import { formateData } from 'util/formateData';
import { useHistory } from 'react-router-dom';
import { convertSlugToUrl } from 'resources/utilities';
import SLUGS from 'resources/slugs';
import ImageModal from 'components/ImageModal/ImageModal';
import userDetailStyle from './styles';

export default function UserDetail(props) {
    const theme = useTheme();
    const { push } = useHistory();
    const [data, setData] = useState([]);
    const [user, setUser] = useState('');
    const { styles } = userDetailStyle;
    const [isApproved, setIsApproved] = useState(false);

    function onClick(slug, data, parameters = {}) {
        push({
            pathname: convertSlugToUrl(slug, parameters),

            state: data
        });
    }
    const btn = {
        position: 'absolute',
        top: '20%',
        right: '8%',
        height: 50,
        width: '10%',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white',
        marginLeft: 40
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

    const { id } = props.location.state;
    useEffect(() => {
        getUserDetail();
        getUserCustomer();
    }, []);
    const getUserCustomer = () => {
        try {
            const refDetail = ref(database, `/USER_CUSTOMER/${id}`);
            onValue(refDetail, (snapShot) => {
                const data = snapShot.val();
                if (data) {
                    setData(formateData(data?.CUSTOMER));
                }
            });
        } catch (error) {
            console.log(error);
        }
    };
    const getUserDetail = () => {
        try {
            const refDetail = ref(database, `USERS/${id}`);
            onValue(refDetail, (snapShot) => {
                setIsApproved(snapShot.val()?.isApproved);
                setUser(snapShot.val());
            });
        } catch (error) {
            console.log(error);
        }
    };
    const onApproved = () => {
        try {
            const refDetail = ref(database, `/USERS/${id}`);
            update(refDetail, {
                isApproved: true
            });
            setIsApproved(true);
        } catch (error) {
            console.log(error);
        }
    };
    const onDelete = async (item) => {
        try {
            const id = await localStorage.getItem('userID');
            const starCountRef = ref(database, `/USER_CUSTOMER/${id}/CUSTOMER/${item.ID}`);
            set(starCountRef, null);
            notify('Customer has been Deleted Successfully', 0);
        } catch (error) {
            console.log('error', error);
        }
    };
    const onViewDetailClick = (item) => {
        onClick(SLUGS.CustomerDetail, {
            userId: id,
            customerId: item.ID
        });
    };
    return (
        <div>
            <div style={styles.div}>
                {user?.photo ? <ImageModal url={user?.photo} imageStyle={styles.img} /> : null}
                <div style={styles.div1}>
                    <span style={styles.text}>
                        <h4>UserName </h4> : <h4> {user?.firstName + user?.lastName}</h4>
                    </span>
                    <br />
                    <span style={styles.text}>
                        <h4>Email </h4> : <h4> {user?.email}</h4>
                    </span>
                    <br />

                    <span style={styles.text}>
                        <h4>PhoneNumer</h4> : <h4>{user?.phoneNumber}</h4>
                    </span>
                    <br />
                </div>
            </div>
            {isApproved ? (
                <Button
                    type='Approve'
                    style={{
                        ...btn,
                        top: '18%'
                    }}
                    onClick={() => onApproved()}
                >
                    Approved
                </Button>
            ) : null}
            <Button
                type='Approve'
                style={{
                    ...btn,
                    top: '30%'
                }}
                onClick={() => {
                    onClick(SLUGS.UserPermission, {
                        userId: id
                    });
                }}
            >
                Edit Permission
            </Button>
            {data.length != 0 && <h1 style={styles.title}>CustomerList</h1>}
            <TableContainer component={Paper}>
                <Table aria-label='customized table'>
                    {data.length != 0 && (
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align='left'>No.</StyledTableCell>
                                <StyledTableCell align='left'>Name</StyledTableCell>
                                <StyledTableCell align='left'>Email</StyledTableCell>
                                <StyledTableCell align='left'>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                    )}
                    <TableBody>
                        {data &&
                            data.map((item, index) => (
                                <StyledTableRow align='left' key={item.id}>
                                    <StyledTableCell component='th' scope='row'>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        {item?.UserFirstName + '  ' + item.UserLastName}
                                    </StyledTableCell>
                                    <StyledTableCell component='th' scope='row'>
                                        {item.BusinessEmail}
                                    </StyledTableCell>
                                    <StyledTableCell align='left' style={styles.leftDiv}>
                                        <Button onClick={() => onViewDetailClick(item)}>
                                            View Detail
                                        </Button>
                                        <Delete onClick={() => onDelete(item)}></Delete>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
                <ToastContainer />
            </TableContainer>
        </div>
    );
}
