import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import styled from 'styled-components';

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
width : 100%;
gap : 10px;
`;


function matchIsNumeric(text) {
    const num = Number(text)
    const isNumber = typeof num === 'number'
    return isNumber
}



const validateChar = (value, index) => {
    return matchIsNumeric(value)
}

const ResponsiveMuiOtpInput = ({ value, onChange, length, autoFocus, onComplete }) => {
    return (
        <MuiOtpInputStyled
            value={value}
            onChange={onChange}
            length={length}
            autoFocus={autoFocus}
            onComplete={onComplete}
            containerStyle={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
            validateChar={validateChar}
            TextFieldsProps={{ type: 'number' }}
        />
    );
}

export default ResponsiveMuiOtpInput