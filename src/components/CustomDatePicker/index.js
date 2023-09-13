import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

function CustomDatePicker({ label, onChange, selectedDate }) {
    const handleDateChange = (date) => {
        const dateObj = new Date(date);
        const dateMoment = moment(dateObj);
        const formattedDate = dateMoment.format('DD/MM/YYYY');
        onChange(formattedDate);
    };
    return (
        <div style={{ marginBottom: '10px' }}>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            <DatePicker
                onChange={handleDateChange}
                placeholderText={selectedDate}
                dateFormat='dd/MM/yyyy'
                className='date-picker-input'
            />
        </div>
    );
}

export default CustomDatePicker;
