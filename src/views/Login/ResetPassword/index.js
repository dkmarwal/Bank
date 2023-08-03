import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Box,
    Typography,
    Button,
    MenuItem,
    CircularProgress,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import styles from "./../styles";
import { resetPassword, fetchSecurityQuestions, fetchSecurityQuestion } from '~/redux/actions/user';

import Notification from '~/components/Notification'
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'
import TextField from "~/components/Forms/TextField";
import config from '~/config'

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: false,
            buttonDisabled: true,
            confirmPassword: null,
            password: null,
            securityQuestionId: null,
            securityAnswer: null,
            securityQuestionList: null,
			selectedQuestion: "",
            error: null,
            validation: {},
            gotoLogin: false,
        };
    }

	componentDidMount = async() => {
		await this.fetchSecurityQuestion();
		this.fetchSQList();
	};

    fetchSecurityQuestion = () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const resetCode = params.get('resetCode');
        this.props.dispatch(fetchSecurityQuestion(resetCode)).then((response) => {
            if (!response) {
                this.setState({
                    error: this.props.user.error,
                    alertMessageCallbackType: null,
                    isLoading: false,
                });
                return false;
            }

            this.setState({
                isLoading: false,
                securityQuestionId: this.props?.user?.securityQuestionId || null
            })
        });
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
			const selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId == this.state.securityQuestionId);
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

        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
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
        if ((!securityAnswer || securityAnswer.length > 0 )&& securityAnswer.length < 6) {
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
                const { password, securityQuestionId, securityAnswer } = this.state;
                const token = this.getQueryVar('resetCode');

                this.props.dispatch(resetPassword({ password, securityQuestionId, securityAnswer, token: token })).then((response) => {
                    if (response.error) {
                        if (response.data === "redirect") {
                            this.setState({
                                error: response.message,
                                progress: false,
                                message: response.message,
                                successDialogEnabled: true,
                                variant: "error",
                            });
                            return false;
                        }
                        this.setState({
                            error: response.message,
                            progress: false,
                            message: response.message,
                            successDialogEnabled: true,
                            variant: "error"
                        });
                        return false;
                    }
                    this.setState({
                        progress: false,
                        buttonDisabled: true,
                        error: null,
                        successDialogEnabled: true,
                        variant: "success",
                        message: this.props.user.error
                    })
                });
            })
        }
    };

    render() {
        const {
            securityQuestionList,
            password,
            confirmPassword,
            securityQuestionId,
            securityAnswer,
            error,
            validation,
            successDialogEnabled,
            variant,
            message,
            selectedQuestion
        } = this.state;
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
                                    <PortalLogo/>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6} className={classes.logoLabel}>
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
                                        error={validation && validation.password}
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
                                        tooltipProps={tooltipObj}
                                    />
                                </Box>
                                {validation && validation.password && <Box>
                                    <Typography variant='subtitle2' color="error" style={{ paddingLeft: "20px", fontSize: "0.75rem" }}>
                                        {validation && validation.password}
                                    </Typography>
                                </Box>
                                }
                                <Box p={1} >
                                    <TextField
                                        required
                                        error={validation && validation.confirmPassword}
                                        helperText={validation && validation.confirmPassword}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
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
                                        label="Security Question"
                                        required
                                        disabled={false}
                                        error={validation && validation.securityQuestionId}
                                        helperText={validation && validation.securityQuestionId}
										title={selectedQuestion || ""}
                                        fullWidth={true}
                                        select
                                        value={securityQuestionId || ""}
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
                                <Box p={1} className={classes.customStyle}>
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
                                    <Button disabled={variant === "success"} variant="contained" color="primary" onClick={() => this.onSubmit()} size="smaill" >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                {successDialogEnabled && <Notification variant={variant} message={message}
                    handleClose={() => {
                        this.setState({ successDialogEnabled: false })
                        if (variant === "success") {
                            this.props.history.push(`${config.baseName}/`);
                        }
                    }}
                />}
            </Fragment>
        )
    }
}

export default connect(state => ({ ...state.user }))(withStyles(styles)(ResetPassword));
