import React from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { IconLogo } from 'assets/icons';
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
        <Row className={classes.container} horizontal='center' vertical='center'>
            <img src={LOGO} className={classes.img} />
            <span className={classes.title}>UrbanMiner</span>
        </Row>
    );
}

export default LogoComponent;
