import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import FooterNav from './FooterNav';

class Footer extends Component {
    render() {
        return (
            <Box display="flex" justifyContent="center" marginLeft="3%">
                <FooterNav />
            </Box>
        )
    }
}

export default Footer;
