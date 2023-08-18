import React, { useState } from 'react';

const DropdownListWithLabel = ({ label, options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelect = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    const selectStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        paddingRight: 10
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            <select value={selectedOption} onChange={handleSelect} style={selectStyle}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownListWithLabel;
