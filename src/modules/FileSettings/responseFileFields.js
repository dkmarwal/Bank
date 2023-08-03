import React, { Component } from "react";
import {
  Grid,
  Box,
  CircularProgress,
  FormGroup,
  FormControl,
  FormLabel,
  Typography,
  MenuItem,
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";

class ResponseFileFields extends Component {
  constructor(props) {
    super(props);
  }
  getResponseValue = (item) => {
    const { returnFileSettings } = this.props;
    return returnFileSettings[item] ? returnFileSettings[item] : "";
  };
  render() {
    const {
      getScheduledTime,
      ediResponsePaymentFile,
      validation,
      returnFileSettings,
      onChange,
      delimiters,
      segmentDelimiters,
      classes,
      handleScheduleSettingsChange,
      returnEDI,
      onBlurResponseChange,
      responseValidation,
    } = this.props;
    return (
      <Grid item xs={12} className={classes.gridMArgin}>
        <FormControl component="fieldset" className={classes.fieldset}>
          <Typography variant="caption" className={classes.legend}>
            Return EDI 824/997 File Setting
          </Typography>
          <FormGroup aria-label="position" row={true} justify="space-between">
            <Grid container direction="row" spacing={2} style={{ margin: 0 }}>
              {Object.keys(returnEDI).map((ediItem, index) =>
                ediItem === "isPaymentMethodEnabled" ? (
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    className={classes.gridItem}
                    key={`edi-824-997-${index}`}
                  >
                    <Box mx={1}>
                      <TextField
                        select
                        label={returnEDI[ediItem].label}
                        name={ediItem}
                        error={validation[ediItem]}
                        value={
                          returnFileSettings.isPaymentMethodEnabled
                            ? returnFileSettings.isPaymentMethodEnabled
                            : returnEDI[ediItem].value
                        }
                        id={ediResponsePaymentFile["824/997 File"]}
                        onChange={(e) => onChange(e, ediItem)}
                      >
                        <MenuItem key="select" value="">
                          Select
                        </MenuItem>
                        <MenuItem
                          key="2"
                          id={ediResponsePaymentFile["824/997 File"]}
                          value="2"
                        >
                          2 Characters
                        </MenuItem>
                        <MenuItem
                          key="1"
                          id={ediResponsePaymentFile["824/997 File"]}
                          value="1"
                        >
                          3 Characters
                        </MenuItem>
                      </TextField>
                    </Box>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    className={classes.gridItem}
                    key={`edi-824-997-${index}`}
                  >
                    <Box mx={1}>
                      <TextField
                        label={returnEDI[ediItem].label}
                        name={ediItem}
                        helperText={responseValidation[ediItem]}
                        error={
                          responseValidation[ediItem] &&
                          responseValidation[ediItem].length > 0
                            ? true
                            : false
                        }
                        inputProps={{
                          maxLength: returnEDI[ediItem].length,
                        }}
                        value={this.getResponseValue(ediItem)}
                        id={ediResponsePaymentFile["824/997 File"]}
                        onChange={(e) => onChange(e, ediItem)}
                        onBlur={(e) => onBlurResponseChange(e, ediItem)}
                      />
                    </Box>
                  </Grid>
                )
              )}
              <Grid
                item
                xs={3}
                sm={3}
                className={classes.gridItem}
                key={`edi-824-997-deliveryTime`}
              >
                <Box mx={1}>
                  <TextField
                    label="Delivery Time"
                    name="Delivery Time"
                    helperText={
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                      ]
                    }
                    value={getScheduledTime("824/997 File")}
                    id={ediResponsePaymentFile["824/997 File"]}
                    onChange={(event) => handleScheduleSettingsChange(event)}
                    onBlur={(e) =>
                      onBlurResponseChange(
                        e,
                        `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                      )
                    }
                    error={
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                      ] &&
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                      ].length > 0
                    }
                    inputProps={{
                      maxLength: 8,
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                className={classes.gridItem}
                key={`edi-824-997-deltaDelivery`}
              >
                <Box mx={1}>
                  <TextField
                    label="Delta Delivery Time"
                    name="Delta Delivery Time"
                    error={
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                      ] &&
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                      ].length > 0
                    }
                    helperText={
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                      ] &&
                      responseValidation[
                        `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                      ].length > 0
                        ? responseValidation[
                            `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                          ]
                        : "*Note – Delta Delivery Time must be later than the 824/997 Delivery Time."
                    }
                    value={getScheduledTime("DeltaFile")}
                    id={ediResponsePaymentFile["DeltaFile"]}
                    onChange={(event) => handleScheduleSettingsChange(event)}
                    onBlur={(e) =>
                      onBlurResponseChange(
                        e,
                        `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                      )
                    }
                    inputProps={{
                      maxLength: 8,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={6} sm={12} className={classes.gridItem}>
              <Box mx={1}>
                <FormLabel component="legend" className={classes.legend}>
                  Return EDI 824/997 Delimiter Setting
                </FormLabel>
              </Box>
            </Grid>
            <Grid item xs={3} sm={3} className={classes.gridItem}>
              <Box mx={1}>
                <TextField
                  error={validation.segmentDelimiter}
                  label="Segment Delimiter"
                  name="segmentDelimiter"
                  fullWidth={true}
                  select
                  value={returnFileSettings.segmentDelimiter || " "}
                  autoComplete="off"
                  variant="outlined"
                  onChange={(e) => onChange(e, "segmentDelimiter")}
                >
                  <MenuItem value=" ">
                    <em>Select</em>
                  </MenuItem>
                  {segmentDelimiters ? (
                    segmentDelimiters.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
            <Grid item xs={3} sm={3} className={classes.gridItem}>
              <Box mx={1}>
                <TextField
                  error={validation.elementDelimiter}
                  name="elementDelimiter"
                  label="Element Delimiter"
                  fullWidth={true}
                  select
                  value={returnFileSettings.elementDelimiter || " "}
                  autoComplete="off"
                  variant="outlined"
                  onChange={(e) => onChange(e, "elementDelimiter")}
                >
                  <MenuItem value=" ">
                    <em>Select</em>
                  </MenuItem>
                  {delimiters ? (
                    delimiters.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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
          </FormGroup>
        </FormControl>
      </Grid>
    );
  }
}

export default ResponseFileFields;
