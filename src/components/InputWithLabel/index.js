import React from 'react';

const InputWithLabel = ({ label, value, onChange, type }) => {
    const inputStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <h5 style={{ display: 'block', marginBottom: '5px' }}>{label}</h5>
            <input
                type={type ?? 'text'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
};

export default InputWithLabel;
