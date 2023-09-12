import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerWithLabel = ({ label, selectedDate, onChange }) => {
    return (
        <div style={{ marginBottom: '10px' }}>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                placeholderText='Select Date'
                dateFormat='dd/MM/yyyy'
            />
        </div>
    );
};

export default DatePickerWithLabel;
