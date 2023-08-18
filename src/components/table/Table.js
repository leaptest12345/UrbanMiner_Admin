import { useTheme } from 'react-jss';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const Table = () => {
    const theme = useTheme();

    const StyledTableCell = withStyles(() => ({
        head: {
            backgroundColor: theme.color.veryDarkGrayishBlue,
            color: theme.color.white
        },
        body: {
            fontSize: 14,
            backgroundColor: theme.color.BG
        }
    }))(TableCell);

    const StyledTableCell1 = withStyles(() => ({
        head: {
            backgroundColor: theme.color.veryDarkGrayishBlue,
            color: theme.color.white
        },
        body: {
            fontSize: 14,
            backgroundColor: theme.color.lightGrayishBlue
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
        <Table aria-label='customized table' style={styles.marginTopView}>
            <TableHead>
                <TableRow>
                    <StyledTableCell align='left'>No.</StyledTableCell>
                    <StyledTableCell align='left'>Photo</StyledTableCell>
                    <StyledTableCell align='left'>Sub_ProductName</StyledTableCell>
                    <StyledTableCell align='left'>Sub_ProductDescription</StyledTableCell>
                    <StyledTableCell align='left'>Delete</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {subProduct &&
                    subProduct.map((item, index) => (
                        <>
                            <StyledTableRow align='left' key={item.id}>
                                <StyledTableCell component='th' scope='row'>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    {item.img ? (
                                        <ImageModal
                                            imageStyle={styles.img}
                                            url={
                                                item.img != ''
                                                    ? window.URL.createObjectURL(item.img)
                                                    : ''
                                            }
                                        />
                                    ) : (
                                        <div style={styles.img}>-</div>
                                    )}
                                </StyledTableCell>
                                <StyledTableCell component='th' scope='row'>
                                    {item?.name}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    {item.description ? item.description : '-'}
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <Delete onClick={() => deleteSubProduct(item)}></Delete>
                                </StyledTableCell>
                            </StyledTableRow>
                        </>
                    ))}
            </TableBody>
        </Table>
    );
};
