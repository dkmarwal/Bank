import React from "react";
import {
  Grid,
  Paper,
  Box,
  makeStyles,
  Typography,
  Button,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";

import TextField from "~/components/Forms/TextField";
import bestPlace from "~/assets/images/undraw_subscriptions_1xdv.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1.5),
    },
    "& .MuiFormControlLabel-root": {
      margin: theme.spacing(1),
    },
    paper: {
      width: "100%",
    },
    checkBox: {
      "& span": {
        color: "#000000",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: 1.6,
      },
    },
  },
}));

const PayerInfo = (props) => {
  const {
    payerList,
    selectedPayer,
    handleChange,
    onSubmit,
    onCancel,
    updateProgress,
    validation,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={3} square className={classes.paper}>
        <Grid container direction="horizontal" xs={12} sm={12}>
          <Box p={{ xs: 2, sm: 3, md: 3, lg: 4 }} width="100%">
            <Grid item container xs={12} justify="space-between">
              <Grid item xs={6}>
                <Box py={2} width="100%">
                  <Typography variant="caption">
                    {" "}
                    Fields mark with asterik (
                    <span style={{ color: "red" }}>*</span>) are required.{" "}
                  </Typography>
                  <Typography variant="body2" style={{ width: "650px" }}>
                    Please provide corporate information.
                  </Typography>
                </Box>
                <Box py={3}>
                  <TextField
                    required
                    error={validation.selectedPayer}
                    helperText={validation.selectedPayer}
                    select
                    value={selectedPayer || ""}
                    name="selectedPayer"
                    label="Select Payer"
                    variant="outlined"
                    fullWidth
                    onChange={(event) => handleChange("selectedPayer", event)}
                    dir="horizontal"
                  >
                    {payerList ? (
                      payerList.map((option) => (
                        <MenuItem key={option.clientId} value={option.clientId}>
                          {option.clientName}
                        </MenuItem>
                      ))
                    ) : (
                      <Box
                        width="100px"
                        display="flex"
                        mt={1.875}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <CircularProgress color="primary" />
                      </Box>
                    )}
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box py={9}>
                  <Box pt={5}>
                    {" "}
                    <img
                      src={bestPlace}
                      alt="bestPlace"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid item container xs={12} justify="center">
              <Box display="flex" mb={5} mt={3} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => onCancel()}
                >
                  CANCEL
                </Button>
                {updateProgress ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "30px",
                      color: "white",
                      padding: "5px 32px",
                    }}
                    color="primary"
                    onClick={() => onSubmit()}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Paper>
    </div>
  );
};

export default PayerInfo;
