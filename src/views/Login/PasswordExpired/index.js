import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Box, Typography, Button, MenuItem, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import styles from "./../styles";
import { resetExpiredPassword, fetchSecurityQuestions } from '~/redux/actions/user';

import Footer from "~/components/Footer";
import TextField from "~/components/Forms/TextField";
import config from '~/config'
import { fetchSecurityQuestion } from '~/redux/helpers/user';
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'
// import Notification from "~/components/Notification";

class PasswordExpired extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSecurityQuestion: 0,
			selectedQuestion: "",
            progress: false,
            buttonDisabled: true,
            confirmPassword: null,
            password: null,
            securityQuestionId: null,
            securityAnswer: null,
            securityQuestionList: null,
            error: null,
            validation: {},
            oldPassword: null,
            variant: "",
            modalMessage: ""
        };
    }
	
	componentDidMount = async() => {
		await this.getSecurityQuestion();
		this.fetchSQList();
	};

    getSecurityQuestion = () => {
        const { userName } = this.props;
        fetchSecurityQuestion(userName, 1).then(res => {
            this.setState({ selectedSecurityQuestion: res && res.data && res.data.securityQuestionId });
        })
    }

    fetchSQList = () => {
        this.props.dispatch(fetchSecurityQuestions()).then((response) => {
            if (!response) {
                this.setState({
                    error: this.props.user.error,
                    alertMessageCallbackType: null,
                    isLoading: false,
                });
                return false;
            }

            const selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId == this.state.selectedSecurityQuestion);
            this.setState({
                isLoading: false,
                securityQuestionList: this.props.user.securityQuestionList,
				selectedQuestion: typeof (selectedQuestionobj) !== "undefined" ? selectedQuestionobj["question"] : ""
            })
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    validateInput = () => {
        const { password, confirmPassword, securityAnswer } = this.state;
        let valid = true;
        const validation = {};

        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (!password || !re.test(password.trim())) {
            validation["password"] = "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
            valid = false;
        }
        if (!confirmPassword || confirmPassword !== password || confirmPassword.length === 0) {
            validation["confirmPassword"] = "Password does not match";
            valid = false;
        }
        if (!securityAnswer || securityAnswer.length === 0) {
            validation["securityAnswer"] = "Security answer is required";
            valid = false;
        }
        if (!securityAnswer || securityAnswer.length > 0 && securityAnswer.length < 6) {
            validation["securityAnswer"] = "Security answer should be minimum 6 characters is required";
            valid = false;
        }
        this.setState({ validation: { ...validation } });
        return valid;
    };

    getQueryVar = (key) => {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === key) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    onSubmit = async () => {
        const isValid = this.validateInput();
        if (isValid) {
            this.setState({
                progress: true
            }, async () => {
                const { password, selectedSecurityQuestion, securityAnswer, oldPassword } = this.state;
                const { userName } = this.props;

                this.props.dispatch(resetExpiredPassword({ userName, oldPassword, updatedPassword: password, securityQuestionId: selectedSecurityQuestion, securityAnswer })).then((response) => {
                    if (!response) {
                        this.setState({
                            error: this.props.user.error,
                            progress: false,
                            variant: "error",
                            modalMessage: this.props.user.error
                        });
                        return false;
                    }
                    this.setState({
                        progress: false,
                        buttonDisabled: true,
                        error: null,
                        variant: "success",
                        modalMessage: this.props.user.error
                    })
                    this.props.history.push(`${config.baseName}/`);
                });
            })
        }
    };

    render() {
        const { securityQuestionList, oldPassword, password, confirmPassword, securityAnswer, error, validation, selectedSecurityQuestion, selectedQuestion } = this.state;
        const { classes } = this.props;
        const tooltipObj = {
            title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            arrow: true,
            placement: "top-end",
        }
        return (
            <Fragment>
                <Grid container justify="center" className={classes.root}>
                    <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
                        <Box display="flex" mt={2}></Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} className={classes.startupContainer}>
                        <Box m={2} >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems='center'
                                className={classes.clientLogo}
                            >

                                <Grid item xs={4} md={4} lg={4} className={classes.logoImg}>
                                    {/* <img src={CitiLogo} alt="Citi Logo" height="34" width="58" /> */}
                                    <PortalLogo/>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6} className={classes.logoLabel}>
                                    {/* Payment Exchange  */}
                                    <PortalBankLabel/>
                                </Grid>
                            </Box>
                            <Box display="flex" pt={3} justifyContent="center">
                                <Typography variant='body1' className={classes.heading}>
                                    Reset Password
                                </Typography>
                            </Box>
                            <Box p={2}>
                                <Box p={1}>
                                    <TextField
                                        required
                                        name="oldPassword"
                                        id="oldPassword"
                                        placeholder="Old Password"
                                        type="password"
                                        value={oldPassword}
                                        onChange={this.handleChange}
                                        inputProps={{ minLength: 8 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        tooltipProps={tooltipObj}
                                    />
                                </Box>
                                <Box p={1} >
                                    <TextField
                                        required
                                        error={validation && validation.password}
                                        helperText={validation && validation.password}
                                        name="password"
                                        id="password"
                                        placeholder="New Password"
                                        type="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        inputProps={{ minLength: 8 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Box>
                                <Box p={1} >
                                    <TextField
                                        required
                                        error={validation && validation.confirmPassword}
                                        helperText={validation && validation.confirmPassword}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirm New Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                        inputProps={{ minLength: 8 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Box>
                                <Box p={1} >
                                    <TextField
                                        disabled={true}
                                        label="Security Question"
                                        required
                                        error={validation && validation.securityQuestionId}
                                        helperText={validation && validation.securityQuestionId}
										title={selectedQuestion || ""}
                                        fullWidth={true}
                                        select
                                        value={selectedSecurityQuestion}
                                        autoComplete="off"
                                        variant="outlined"
                                        name="securityQuestionId"
                                        onChange={this.handleChange}
                                    >
                                        {securityQuestionList ? securityQuestionList.map(option => (
                                            <MenuItem key={option.questionId} value={option.questionId}>
                                                {option.question}
                                            </MenuItem>
                                        )) :
                                            (
                                                <Box width="100px" display="flex" mt={1.875} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
                                            )
                                        }
                                    </TextField>
                                </Box>
                                <Box p={1}>
                                    <TextField
                                        required
                                        error={validation && validation.securityAnswer}
                                        helperText={validation && validation.securityAnswer}
                                        name="securityAnswer"
                                        id="securityAnswer"
                                        label="Security Answer"
                                        type="password"
                                        variant="outlined"
                                        value={securityAnswer}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{ minLength: 6 }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant='subtitle1' color="error">
                                        {error}
                                    </Typography>
                                </Box>
                                <Box mt={4} justifyContent="center" display="flex">
                                    <Button variant="contained" color="primary" onClick={() => this.onSubmit()} size="smaill" >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Footer {...this.props} />
                        </Box>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default connect(state => ({ ...state.user }))(withStyles(styles)(PasswordExpired));