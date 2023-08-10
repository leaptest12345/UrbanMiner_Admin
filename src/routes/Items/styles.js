import { createUseStyles } from 'react-jss';

export const useStyles = createUseStyles((theme) => ({
    cardsContainer: {
        marginRight: -30,
        marginTop: -30
    },
    input: {
        height: 50,
        width: '50%',
        borderRadius: 10,
        padding: 20
    },
    btn: {
        height: 50,
        width: '20%',
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: 'black',
        color: 'white',
        marginLeft: 40
    },
    bottomView: {
        // backgroundColor:'red',
        widh: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50
    },
    bottomView1: {
        backgroundColor: theme.color.veryDarkGrayishBlue,
        widh: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        padding: 20
    },
    addItemView: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    h1: {
        color: 'white',
        fontSize: 23
    },
    h3: {
        color: theme.color.veryDarkGrayishBlue
    },
    img: {
        width: 100,
        height: 50
    }
}));
