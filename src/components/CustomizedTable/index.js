import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { ToastContainer } from 'react-toastify';
import { Delete } from '@mui/icons-material';
import { ConfirmationCard } from 'components/ConfirmationCard';
import { useState } from 'react';

export const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: '#373a47',
        color: 'white'
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

export const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#F7F8FC'
        }
    }
}))(TableRow);

export const CustomizedTable = ({ headerLabelList, type, bodyItemList, onClick, onDelete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    return (
        <TableContainer component={Paper}>
            <ConfirmationCard
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                onDelete={() => {
                    if (onDelete) {
                        onDelete(deleteItemId);
                    }
                    setIsVisible(false);
                }}
                type={type?.toLowerCase()}
            />

            <Table aria-label='customized table'>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='left'>No</StyledTableCell>
                        {headerLabelList?.map((item, index) => (
                            <StyledTableCell key={index} align='left'>
                                {item}
                            </StyledTableCell>
                        ))}
                        <StyledTableCell align='left'>Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bodyItemList?.length === 0 && (
                        <StyledTableRow>
                            <StyledTableCell colSpan={headerLabelList.length + 1} align='center'>
                                No data available
                            </StyledTableCell>
                        </StyledTableRow>
                    )}
                    {bodyItemList?.map((item, index) => (
                        <StyledTableRow>
                            <StyledTableCell align='left'>{index + 1}</StyledTableCell>
                            {item?.list?.map((subItem, subIndex) => (
                                <StyledTableCell key={subIndex} align='left'>
                                    {subItem}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>
                                <div className='flex flex-row items-center gap-4'>
                                    {onClick && (
                                        <div
                                            onClick={() => {
                                                onClick && onClick(item.itemDetail);
                                            }}
                                            className='p-2 bg-slate-500 text-white font-medium rounded-md text-sm cursor-pointer'
                                        >
                                            View Detail
                                        </div>
                                    )}
                                    <div
                                        onClick={() => {
                                            setIsVisible(true);
                                            setDeleteItemId(
                                                item.itemDetail.id ?? item.itemDetail.ID
                                            );
                                        }}
                                        className='cursor-pointer'
                                    >
                                        <Delete
                                            color='red'
                                            className='text-red-600 cursor-pointer hover:text-red-900'
                                        />
                                    </div>
                                </div>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <ToastContainer />
        </TableContainer>
    );
};
