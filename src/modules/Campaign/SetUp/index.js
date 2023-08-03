import React from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  MenuItem,
  input,
  label,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  Tooltip
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import CampaignPhone from "~/components/TextBox/Phone/CampaignPhone";

import PayerValidation from "~/modules/Campaign/PayerValidation/";
import TextField from "~/components/Forms/TextField";
import CheckboxGroupCampaign from "~/components/Forms/CheckboxGroupCampaign";

import { withStyles } from "@material-ui/styles";
import styles from "./styles";

const SetUpInfo = (props) => {
  const {
    classes,
    validationList,
    selectedPayerValidations,
    dataInfo,
    supplierFile,
    campaignList,
    campaignTypes,
    countryList,
    currencyList,
    isHippaEnabled,
    micrositesEnabled,
    autoloadEnabled,
    validationEnabled,
    PAFEnabled,
    PVTEnabled,
    handleChange,
    onSubmit,
    onBack,
    handleSelectAll,
    handleClearAll,
    updateProgress,
    valdationListProgress,
    validation,
  } = props;
  //const classes = useStyles();

  return (
    <Grid
      container
      direction="horizontal"
      xs={12}
      sm={12}
      className={classes.root}
    >
      <Paper elevation={3} square style={{ width: "100%" }}>
        <Grid item container justify="flex-start">
          <Grid item xs={5} sm={5}>
            <Box
              display="flex"
              p={2}
              justifyContent="center"
              flexDirection="column"
            >
              <Box p={1}>
                <TextField
                  required
                  select
                  error={validation.campaignName}
                  helperText={validation.campaignName}
                  value={(dataInfo && dataInfo.campaignName) || ""}
                  name="campaignName"
                  label="Campaign Name"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleChange("campaignName", event)}
                  dir="horizontal"
                >
                  {campaignList ? (
                    campaignList.map((option) => (
                      <MenuItem
                        key={option.campaignId}
                        value={option.campaignId}
                      >
                        {option.campaignName}
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
              <Box p={1}>
                <TextField
                  required
                  error={validation.campaignType}
                  helperText={validation.campaignType}
                  value={(dataInfo && dataInfo.campaignType) || ""}
                  name="campaignType"
                  label="Campaign Type"
                  variant="outlined"
                  select
                  disabled={true}
                  fullWidth
                  dir="horizontal"
                >
                  {campaignTypes ? (
                    campaignTypes
                      .filter((item) => {
                        if (
                          item.value == "ENROLL_ONLY" &&
                          (micrositesEnabled == 1 || autoloadEnabled == 1)
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((option) => (
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
                {/*<TextField
                            required
                            error={validation.campaignType}
                            helperText={validation.campaignType}
                            select
                            value={dataInfo && dataInfo.campaignType || ""}
                            name="campaignType"
                            label="Campaign Type"
                            variant="outlined"
                            disabled={true}
                            fullWidth
                            onChange={(event) =>
                              handleChange("campaignType", event)
                            }
                            dir="horizontal"
                          >
                            {campaignTypes ? (
                              campaignTypes.filter((item) => {
                                  if(item.value =='ENROLL_ONLY' && (micrositesEnabled==1 || autoloadEnabled ==1)){
                                      return false
                                  }
                                  return true
                              }).map((option) => (
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
                            </TextField>*/}
              </Box>
              <Box p={1}>
                <TextField
                  required
                  error={validation.country}
                  helperText={validation.country}
                  select
                  value={(dataInfo && dataInfo.country) || ""}
                  name="country"
                  label="Campaign Country"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleChange("country", event)}
                  dir="horizontal"
                >
                  {countryList ? (
                    countryList.map((option) => (
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
              <Box p={1}>
                <TextField
                  required
                  error={validation.currency}
                  helperText={validation.currency}
                  select
                  value={(dataInfo && dataInfo.currency) || ""}
                  name="currency"
                  label="Campaign Currency"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleChange("currency", event)}
                  dir="horizontal"
                >
                  {currencyList ? (
                    currencyList
                      .filter((item) => {
                        if (
                          item.value == "CAD" &&
                          dataInfo &&
                          dataInfo.country == "US"
                        ) {
                          return false;
                        }
                        return true;
                      })
                      .map((option) => (
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
            </Box>
          </Grid>
          <Grid item xs={5} sm={5}>
            <Box
              display="flex"
              p={2}
              py={3}
              justifyContent="center"
              alignItems="center"
            >
              <Box p={1}>
                <Typography variant="h2">Microsites </Typography>
              </Box>
              <Box p={1}>
                <CheckboxGroupCampaign
                  options={[
                    {
                      label: "On",
                      value: 1,
                    },
                    {
                      label: "Off",
                      value: 0,
                    },
                  ]}
                  disabled={true}
                  onChange={(value, index, event) =>
                    handleChange("micrositesEnabled", event, value)
                  }
                  selectedOption={micrositesEnabled || 0}
                />
              </Box>
            </Box>
            <Box
              display="flex"
              p={2}
              pl={3}
              py={4}
              justifyContent="center"
              alignItems="center"
            >
              <Box p={1}>
                <Typography variant="h2">Autoload </Typography>
              </Box>
              <Box p={1}>
                <CheckboxGroupCampaign
                  options={[
                    {
                      label: "On",
                      value: 1,
                    },
                    {
                      label: "Off",
                      value: 0,
                    },
                  ]}
                  disabled={micrositesEnabled == 1 ? true : false}
                  onChange={(value, index, event) =>
                    handleChange("autoloadEnabled", event, value)
                  }
                  selectedOption={autoloadEnabled || 0}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box
              display="flex"
              p={1}
              pl={4}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box pl={1} width="300px">
                <Typography variant="h3">Hippa Required</Typography>
              </Box>
              <Box pl={4}>
                <RadioGroup
                  row
                  aria-label="position"
                  name="isHippaEnabled"
                  value={isHippaEnabled || "no"}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio color="primary" />}
                    label="Yes"
                    disabled
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio color="primary" />}
                    label="No"
                    disabled
                    labelPlacement="end"
                  />
                </RadioGroup>
              </Box>
            </Box>
            <Box
              display="flex"
              p={1}
              pl={4}
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box pl={1} width="300px">
                <Typography variant="h3">Validations:</Typography>
              </Box>
              <Box pl={4}>
                <RadioGroup
                  row
                  aria-label="position"
                  name="validationEnabled"
                  value={validationEnabled || "no"}
                  onChange={(event) => handleChange("validationEnabled", event)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio color="primary" />}
                    label="Yes"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio color="primary" />}
                    label="No"
                    labelPlacement="end"
                  />
                </RadioGroup>
              </Box>
              {validationEnabled == "yes" && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  width="50%"
                >
                  <Box pl={4}>
                    <Typography variant="h4">PAF Required</Typography>
                  </Box>
                  <Box pl={2}>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="PAFEnabled"
                      value={PAFEnabled || "no"}
                      onChange={(event) => handleChange("PAFEnabled", event)}
                    >
                      <FormControlLabel
                        value={"yes"}
                        control={<Radio color="primary" />}
                        label="Yes"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value={"no"}
                        control={<Radio color="primary" />}
                        label="No"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </Box>
                </Box>
              )}
            </Box>
            <Box
              display="flex"
              pl={4}
              pr={1}
              justifyContent="flex-end"
              alignItems="center"
            >
              {validationEnabled == "yes" && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  width="50%"
                  px={5}
                >
                  <Tooltip title="Penny Verifiction Test" arrow
                  placement="left">
                  <Box pl={4}>
                    <Typography variant="h4">PVT Required</Typography>
                  </Box>
                  </Tooltip>
                  <Box pl={2}>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="PVTEnabled"
                      value={PVTEnabled || "no"}
                      onChange={(event) => handleChange("PVTEnabled", event)}
                    >
                      <FormControlLabel
                        value={"yes"}
                        control={<Radio color="primary" />}
                        label="Yes"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value={"no"}
                        control={<Radio color="primary" />}
                        label="No"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </Box>
                </Box>
              )}
            </Box>
            <Box
              display="flex"
              p={1}
              justifyContent="flex-start"
              alignItems="center"
            >
              <PayerValidation
                title="Select Background Validations for Payees"
                validationList={validationList}
                selectedPayerValidations={selectedPayerValidations}
                handleSelectAll={handleSelectAll}
                handleClearAll={handleClearAll}
                handleChange={handleChange}
                validation={validation}
                updateProgress={valdationListProgress}
              />
            </Box>
            {micrositesEnabled == 0 && (
              <Box
                display="flex"
                p={1}
                pl={4}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box pl={1}>
                  <input
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className={classes.input}
                    style={{ display: "none" }}
                    id="supplierFile"
                    type="file"
                    onChange={(event) => handleChange("supplierFile", event)}
                  />
                  <label htmlFor="supplierFile">
                    <Button
                      variant="outlined"
                      color="primary"
                      component="span"
                      size="small"
                      className={classes.uploadBtn}
                      startIcon={<AddIcon />}
                    >
                      UPLOAD SUPPLIER DETAILS FILE
                    </Button>
                    <Typography
                      variant="caption"
                      style={{ paddingLeft: "10px" }}
                    >
                      {supplierFile && supplierFile.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{ color: "red", paddingLeft: "10px" }}
                    >
                      {validation && validation.supplierFile}
                    </Typography>
                  </label>
                </Box>
              </Box>
            )}
          </Grid>
          <Grid item xs={5} sm={5}>
            <Box
              display="flex"
              p={1}
              pt={4}
              pl={2}
              justifyContent="center"
              flexDirection="column"
            >
              <Box pl={4} width="300px">
                <Typography variant="h2">Support Contact:</Typography>
              </Box>
              <Box pl={1}>
                <TextField
                  required
                  error={validation.email}
                  helperText={validation.email}
                  value={(dataInfo && dataInfo.email) || ""}
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleChange("email", event)}
                  dir="horizontal"
                />
              </Box>
              <Box mx={1}>
                <CampaignPhone
                  required
                  error={validation.phone}
                  helperText={validation.phone}
                  id="phone"
                  name="phone"
                  ext={(dataInfo && dataInfo.phoneExt) || ""}
                  value={(dataInfo && dataInfo.phone) || ""}
                  ccode={(dataInfo && dataInfo.phoneCountryCode) || ""}
                  prefixCcode="+1"
                  onChange={(event) => handleChange("phone", event)}
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
              onClick={() => onBack(0)}
            >
              BACK
            </Button>
            {updateProgress ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                variant="contained"
                style={{ marginLeft: "30px", color: "white" }}
                color="primary"
                onClick={() => onSubmit()}
              >
                Next
              </Button>
            )}
          </Box>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(SetUpInfo);
