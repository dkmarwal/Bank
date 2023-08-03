import React from "react";
import { connect } from "react-redux";

import { Paper, Grid, withStyles, Button, MenuItem, Box, CircularProgress, Typography } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";

import { fetchSecurityQuestions } from "~/redux/actions/user";

const styles = () => ({
  container: {
    width: "40%",
    margin: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    background: "#fff",
    borderRadius: "7px",
    transform: "translate(-50%,-50%)",
    padding: "20px",
  },
  verifyBtn: {
    float: "right",
    marginTop: "10px",
  },
  inputField: {
    /*color: "#fff",*/
    margin: "14px 14px 14px 10px",
    width: "95%"
  },
  customStyle: {
    '& .MuiOutlinedInput-adornedEnd': {
      fontSize: 16
    },
    '& .MuiOutlinedInput-root': {
      fontSize: 16
    }
  }
});

class FirstLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      confirmPassword: null,
      securityQuestionId: null,
      securityAnswer: null,
      validation: {},
      securityQuestionList: null,
      processing: false,
      errors: [],
      error: null,
      buttonDisabled: true,
    };
  }

  componentDidMount = () => {
    this.fetchSQList();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error) {
      return {
        errors: [
          nextProps.error
        ]
      }
    }
    return null
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

      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList
      })
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateInput = () => {
    const { password, confirmPassword, securityQuestionId, securityAnswer } = this.state;
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
    if (!securityQuestionId || securityQuestionId === 0) {
      validation["securityQuestionId"] = true;
      valid = false;
    }
    if (!securityAnswer || securityAnswer.length > 0 && securityAnswer.length < 6) {
      validation["securityAnswer"] = "Security answer should be minimum 6 characters is required.";
      valid = false;
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  onSubmit = async () => {
    const isValid = this.validateInput();
    if (isValid) {
      this.setState({
        processing: true
      }, async () => {
        const { password, securityQuestionId, securityAnswer } = this.state;
        const { processReset } = this.props;
        await processReset({ password, securityQuestionId, securityAnswer }).then((response) => {
          if (!response) {
            this.setState({
              error: this.props.user.error,
              processing: false
            });

            return false;
          }

          this.setState({
            processing: false,
            buttonDisabled: true,
            error: null,
          })
        });
      })
    }
  };

  render() {
    const { classes } = this.props;
    const tooltipObj = {
      title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      arrow: true,
      placement: "top-end",
    }
    const { password, confirmPassword, securityQuestionId, securityAnswer, securityQuestionList, validation, error } = this.state;

    return (
      <Paper className={classes.container} elevation={5}>
        <Grid container className={classes.inner}>
          <Grid xs={12}>
            <Box display="flex" justifyContent="center"><h3>Set Up Password and Security Question</h3></Box>
          </Grid>
          <Grid xs={12} className={classes.customStyle}>
            <TextField
              required
              error={validation && validation.password}
              helperText={validation && validation.password}
              className={classes.inputField}
              name="password"
              id="password"
              label="New Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={this.handleChange}
              inputProps={{ minLength: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
              tooltipProps={tooltipObj}
            />
          </Grid>
          <Grid xs={12} className={classes.customStyle}>
            <TextField
              required
              error={validation && validation.confirmPassword}
              helperText={validation && validation.confirmPassword}
              className={classes.inputField}
              name="confirmPassword"
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={this.handleChange}
              inputProps={{ minLength: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>
          <Grid xs={12}>
            <Box>
              <TextField
                label="Security Question"
                required
                error={validation && validation.securityQuestionId}
                helperText={validation && validation.securityQuestionId}
                className={classes.inputField}
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
          </Grid>
          <Grid xs={12} className={classes.customStyle}>
            <TextField
              required
              error={validation && validation.securityAnswer}
              helperText={validation && validation.securityAnswer}
              className={classes.inputField}
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
            />
          </Grid>
          <Grid xs={12}>
            <Box display="flex" justifyContent="center">
              <Typography variant='subtitle1' color="error">
                {error}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                className={classes.verifyBtn}
                onClick={this.onSubmit}
              >
                SUBMIT
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(FirstLogin)
);
