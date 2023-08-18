import React from 'react';

const RadioButtonGroupWithLabel = ({ label, options, selectedValue, onSelect }) => {
    const handleSelect = (value) => {
        onSelect(value);
    };

    return (
        <div>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            {options.map((option) => (
                <div key={option.value} style={{ marginBottom: '10px' }}>
                    <input
                        type='radio'
                        id={option.value}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={() => handleSelect(option.value)}
                        style={{ marginRight: '5px' }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                </div>
            ))}
        </div>
    );
};

export default RadioButtonGroupWithLabel;
