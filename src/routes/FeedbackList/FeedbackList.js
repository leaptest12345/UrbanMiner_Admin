import React, { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';
import { useTheme } from 'react-jss';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { database } from 'configs/firebaseConfig';
import { onValue, ref } from 'firebase/database';

export default function FeedBackList() {
    const theme = useTheme();
    const [data, setData] = useState([]);

    useEffect(() => {
        getFeedbackList();
    }, []);

    const ReadMore = ({ children }) => {
        const text = children;
        const [isReadMore, setIsReadMore] = useState(true);
        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };
        return (
            <p className='text'>
                {isReadMore ? text?.slice(0, 150) : text}
                {
                    <span
                        style={{
                            color: 'red'
                        }}
                        onClick={toggleReadMore}
                        className='read'
                    >
                        {isReadMore ? '...read more' : ' show less'}
                    </span>
                }
            </p>
        );
    };

    const getFeedbackList = () => {
        try {
            const starCountRef = ref(database, '/ADMIN/FeedBack');
            onValue(starCountRef, (snapshot) => {
                if (Array.isArray(snapshot.val())) {
                    let newArr = snapshot.val();
                    setData(newArr);
                } else {
                    let arr = [];
                    Object.keys(snapshot.val()).map((key) => arr.push(snapshot.val()[key]));
                    setData(arr);
                }
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

    return (
        <TableContainer component={Paper}>
            <Table aria-label='customized table'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='left'>No.</StyledTableCell>
                        <StyledTableCell align='left'>Name</StyledTableCell>
                        <StyledTableCell align='left'>Email</StyledTableCell>
                        <StyledTableCell align='left'>FeedBack</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((item, index) => (
                            <StyledTableRow align='left' key={item.id}>
                                <StyledTableCell component='th' scope='row'>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell component='th' scope='row'>
                                    {item.name}
                                </StyledTableCell>
                                <StyledTableCell component='th' scope='row'>
                                    {item.email}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <ReadMore>{item.feedBack}</ReadMore>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                </TableBody>
            </Table>
            <ToastContainer />
        </TableContainer>
    );
}
