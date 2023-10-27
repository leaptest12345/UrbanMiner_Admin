import React from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import LOGO from 'assets/icons/urbanminer.png';

const useStyles = createUseStyles((theme) => ({
    container: {},
    title: {
        ...theme.typography.cardTitle,
        color: theme.color.white,
        opacity: 0.7,
        marginLeft: 12
    },
    img: {
        width: '50px',
        height: '50px',
        borderRadius: '10px'
    }
}));

function LogoComponent() {
    const theme = useTheme();
    const classes = useStyles({ theme });
    return (
        <Row className='flex items-center gap-4' horizontal='center' vertical='center'>
            <img src={LOGO} className={classes.img} />
            <span className='font-bold text-white'>Urban Miner</span>
        </Row>
    );
}

export default LogoComponent;
