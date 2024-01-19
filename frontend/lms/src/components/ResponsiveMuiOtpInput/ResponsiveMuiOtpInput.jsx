import React from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from 'styled-components';

const MuiOtpInputStyled = styled(MuiOtpInput)`
  display: flex;
width : 100%;
gap : 10px;
`;

const ResponsiveMuiOtpInput = ({ value, onChange, length, autoFocus, onComplete }) => {
    const isSmallScreen = useMediaQuery('(max-width: 480px)');
    return (
        <MuiOtpInputStyled
            value={value}
            onChange={onChange}
            length={length}
            autoFocus={autoFocus}
            onComplete={onComplete}
            containerStyle={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}

        />
    );
}

export default ResponsiveMuiOtpInput