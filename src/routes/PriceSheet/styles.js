const styles = {
    img: {
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
    },
    rowDiv: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '1%'
    },
    rowWrap: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    modalDiv: {
        backgroundColor: 'white',
        borderRadius: '10px',
        // height: '70vh',
        width: '70vw',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    modalDiv1: {
        backgroundColor: 'white',
        borderRadius: '10px',
        height: '35vh',
        width: '70vw',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    modal1: {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '10px',
        boxShadow: '2px 5px solid black',
        height: '35vh',
        width: '70vw',
        margin: 'auto',
        left: '10%',
        top: '10%'
    },
    modal: {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: '10px',
        boxShadow: '2px 5px solid black',
        height: '45vh',
        width: '70vw',
        margin: 'auto',
        left: '10%',
        top: '-40%'
    },
    inputStyle: {
        height: '45px',
        width: '40vw',
        borderRadius: 10,
        outline: 'none',
        paddingInline: '10px',
        border: '2px solid black',
        marginTop: '10px'
    },
    textareaStyle: {
        height: '45px',
        width: '40vw',
        borderRadius: 10,
        outline: 'none',
        paddingInline: '10px',
        border: '2px solid black',
        marginTop: '10px',
        height: '100px',
        padding: '10px',
        width: '50vw'
    },
    btnStyle: {
        background: '#707070',
        color: 'white',
        position: 'absolute',
        right: '15%',
        top: '10%',
        paddingInline: '1em'
    },
    btnStyle1: {
        background: '#373a47',
        color: 'white'
    },
    dangerBtn: {
        background: '#ff8785',
        color: 'white',
        marginBottom: '5%'
    },
    dangerBtn1: {
        background: 'grey',
        color: 'white',
        marginBottom: '5%'
    },
    imgStyle: {
        height: '30vh',
        width: '20vw',
        borderRadius: 10,
        marginTop: '20px'
    },
    imgStyle2: {
        height: '10vh',
        width: '20vh',
        borderRadius: 10,
        marginTop: '10px'
    },
    imgStyle1: {
        height: '15vh',
        width: '10vw',
        borderRadius: 10,
        marginTop: '20px'
    },
    closeBtn: {
        position: 'absolute',
        right: '3%',
        top: '5%',
        background: '#707070',
        color: 'white'
    },
    title: {
        fontSize: '25px',
        color: 'black',
        fontWeight: 'bold'
    },
    productDescView: { marginTop: '20px', marginBottom: '20px' },
    marginTopView: { marginTop: '20px' },
    width10: { width: '10%' }
};
export default {
    styles
};
