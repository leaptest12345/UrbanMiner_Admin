import React from 'react';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { useTheme } from 'react-jss';

export const ConfirmationCard = ({ type, isVisible, onClose, onDelete }) => {
    const theme = useTheme();

    const btnStyle = {
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        backgroundColor: theme.color.veryDarkGrayishBlue,
        color: 'white'
    };

    return (
        <Modal
            onClose={onClose}
            open={isVisible}
            style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    left: '45%',
                    top: '40%',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 20,
                    flexDirection: 'column'
                }}
            >
                <div
                    style={{
                        flexDirection: 'column',
                        display: 'flex'
                    }}
                >
                    <text>Are you sure you want to</text>
                    <text
                        style={{
                            color: 'red'
                        }}
                    >
                        detete {type}?
                    </text>
                </div>
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginTop: 20
                    }}
                >
                    <Button style={btnStyle} onClick={onClose}>
                        No
                    </Button>
                    <Button style={btnStyle} onClick={onDelete}>
                        Yes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
