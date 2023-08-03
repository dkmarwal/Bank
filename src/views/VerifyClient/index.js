import React from 'react';
import { connect } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import { verifyClient } from '~/API/dataServices';
import { Paper, withStyles, TextField, Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
const styles = () => ({
    container: {
        width: '35%',
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        background: '#fff',
        borderRadius: '7px',
        transform: 'translate(-50%,-50%)',
        padding: '20px',
    },
    inner: {
        background: '#fff',
        padding: '0',
        width: '90%',
        display: 'inline-block',
        textAlign: 'left',
    },
    error_txt: {
        color: '#f44336',
        padding: '5px'
    },
    verifyBtn: {
        width: '100%',
        marginTop: '5px',
        color: '#fff',
        lineHeight: '36px',
        textTransform: 'none',
        fontSize: '20px',
        backgroundColor: '#243d7d',
    },
});
const ValidationTextField = withStyles({
    root: {
        color: '#fff',
        margin: '14px 0',
    },
})(TextField);

class VerifyClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = { code: '', taxid: '', isSSN: "id", isVerified: false, errorText: '' };
        this.myRef = React.createRef();
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit = async () => {
        if (this.state.isVerified) {
            let data = {
                "activationCode": this.state.code,
                "taxId": this.state.taxid,
                "taxIdIsSSN": this.state.isSSN === "id" ? 0 : 1
            };
            try {
                const res = await verifyClient(data);
                const responseBody = await res.data;
                if (!responseBody.error) {
                    this.props.history.push({
                        pathname: '/userprofile'
                    });
                    sessionStorage.setItem('clientId', responseBody.data.clientId);
                } else {
                    this.setState({ errorText: responseBody.error });
                }
            } catch (err) {
                this.setState({ errorText: "Something went wrong" });
            }
        }
    }
    recaptchaChange = () => {
        const recaptchaValue = this.myRef.current.getValue();
        if (recaptchaValue.length === 0) {
            this.setState({ isVerified: false });
        }
        else {
            this.setState({ isVerified: true });
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.container} elevation={5}>
                <div className={classes.inner}>
                    <h4>Client Verification</h4>
                    <ValidationTextField name="code" id="activation_code" label="Activation Code" type="text" variant="outlined"
                        value={this.state.code}
                        onChange={this.handleChange}
                        fullWidth />
                    <FormControl component="fieldset">
                        <RadioGroup row aria-label="position" name="isSSN" defaultValue="top" value={this.state.isSSN} onChange={this.handleChange}>
                            <FormControlLabel value="id" control={<Radio color="primary" />} label="Federal Tax ID" />
                            <FormControlLabel value="ssn" control={<Radio color="primary" />} label="SSN" />
                        </RadioGroup>
                    </FormControl>
                    <ValidationTextField name="taxid" id="identification_number" label="Identification Number" type="text" variant="outlined"
                        value={this.state.taxid}
                        onChange={this.handleChange}
                        fullWidth />
                    <ReCAPTCHA
                        ref={this.myRef}
                        sitekey="6Ld6MKYZAAAAALnTmc5dxhHMr5FWc4IEVTAGZLa6"
                        onChange={this.recaptchaChange}
                    />
                    <div className={classes.error_txt}>{this.state.errorText}</div>
                    <Button variant="contained" color="primary" className={classes.verifyBtn} onClick={this.onSubmit} disabled={this.state.isVerified ? false : true}>Verify</Button>
                </div>
            </Paper>
        );
    }
}


export default connect(state => (
    { ...state.user }))(withStyles(styles)(VerifyClient));