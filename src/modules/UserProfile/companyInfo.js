﻿import React, { useState, useEffect } from "react";
import { Grid, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import StateListField from "~/components/Forms/StateListField";
import CityListField from "~/components/Forms/CityListField";
import { fetchLocationsList } from "~/redux/helpers/userProfile";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";

export default function CompanyInfo(props) {
  const { companyInfoObj, checkInput, validation, onBlurValidate } = props;
  const [location, setlocation] = useState({});
  const country = ["USA"];

  const getlocationType = () => {
    fetchLocationsList()
      .then((response) => {
        if (response.error) {
          throw response.error;
        }
        const responseData = response.data.rows;
        setlocation(responseData);
      })
      .catch((error) => {
      });
  };
  useEffect(() => {
    getlocationType();
  }, []);
  return (
    <form autoComplete="off" className="companyDetails">
      <div className="title">Company Details:</div>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} container direction="row" spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="companyName"
              label="Company Name"
              type="text"
              value={companyInfoObj.companyName.value}
              inputProps={{ maxLength: 100 }}
              onChange={checkInput}
              onBlur={onBlurValidate}
              error={
                validation.companyName && validation.companyName.length > 0
              }
              helperText={validation.companyName}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="duns_number"
              id="duns_number"
              label="Duns Number"
              type="text"
              value={companyInfoObj.duns_number.value}
              onChange={checkInput}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 9 }}
              error={validation.dunsNumber && validation.dunsNumber.length > 0}
              helperText={validation.dunsNumber}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CountryPhoneCode
              name={'countryCode'}
              id={'countryCode'}
              label={'Country'}
              type={"select"}
              value={companyInfoObj.countryCode.value}
              required
              onChange={checkInput}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 4 }}
              excludeCountryCode={["CA", "UM"]}
            />
          </Grid>
          <Grid item xs={12} sm={5} >
            <TextField
              name="phoneNumber"
              id="phoneNumber"
              label="Phone Number"
              type="text"
              value={companyInfoObj.phoneNumber.value}
              onChange={checkInput}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 10 }}
              error={validation.phoneNumberError && validation.phoneNumberError.length > 0}
              helperText={validation.phoneNumberError}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="phoneExt"
              id="phoneExt"
              label="Extension"
              type="text"
              value={companyInfoObj.phoneExt.value}
              onChange={checkInput}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 10 }}
              error={validation.phoneExtError && validation.phoneExtError.length > 0}
              helperText={validation.phoneExtError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="fax"
              id="fax"
              label="Fax"
              type="text"
              value={companyInfoObj.fax.value}
              onBlur={onBlurValidate}
              onChange={checkInput}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="taxid_SSNNumber"
              id="taxid_SSN_text"
              label={companyInfoObj.taxidOrSSN.value}
              type="text"
              value={companyInfoObj.taxidOrSSN.taxidOrSSNnumber}
              onBlur={onBlurValidate}
              disabled
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container direction="row" spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="website"
              label="Website"
              type="text"
              value={companyInfoObj.website.value}
              onBlur={onBlurValidate}
              error={validation.website && validation.website.length > 0}
              helperText={validation.website}
              onChange={checkInput}
              inputProps={{
                    maxLength:200,
                }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              rows={2}
              type="text"
              value={companyInfoObj.address.value}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 1000 }}
              onChange={checkInput}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="country"
              select
              label="Country"
              value={companyInfoObj.country.value}
              SelectProps={{
                native: true,
              }}
              onChange={checkInput}
              onBlur={onBlurValidate}
              required
            >
              {country.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StateListField
              name="state"
              label="State/Province"
              value={companyInfoObj.state.value}
              countryCode="US"
              onChange={checkInput}
              onBlur={onBlurValidate}
              error={validation.state && validation.state.length > 0}
              helperText={validation.state}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CityListField
              name="city"
              label="City/Town"
              value={companyInfoObj.city.value}
              countryCode="US"
              state={companyInfoObj.state.value}
              onChange={checkInput}
              onBlur={onBlurValidate}
              error={validation.city && validation.city.length > 0}
              helperText={validation.city}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="zip_code"
              id="Zip Code"
              label="Zip Code"
              type="text"
              value={companyInfoObj.zip_code.value}
              onChange={checkInput}
              onBlur={onBlurValidate}
              inputProps={{ maxLength: 5 }}
              error={validation.zipCode}
              helperText={validation.zipCode}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="locationType"
              select
              label="Location Type"
              value={companyInfoObj.locationType.value}
              SelectProps={{
                native: true,
              }}
              onChange={checkInput}
              onBlur={onBlurValidate}
            >
              {location &&
                Object.keys(location).map((option) => (
                  <MenuItem
                    id={`locationType_${location[option].locationTypeId}`}
                    key={`locationType_${location[option].locationTypeId}`}
                    value={location[option].locationTypeId}
                  >
                    {location[option].description}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
