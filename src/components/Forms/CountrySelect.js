import React from "react";
import TextField from "~/components/Forms/TextField";
import csc from "country-state-city";
import { MenuItem } from "@material-ui/core";

const CountrySelect = (props) => {
  const { name, label, value, onChange, error, helperText, defaultCountrySet, ...restProps } = props;

  return (
    <TextField
        color="secondary"
      name={name}
      select
      label={label}
      value={value ? value : ""}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={true}
      variant="outlined"
      {...restProps}
    >
      {/* <MenuItem id="" value=""><em>Select</em></MenuItem> */}
      {csc.getAllCountries().filter(({ sortname }) => defaultCountrySet.includes(sortname)).map(({ name, sortname, phonecode }) => (
        <MenuItem key={sortname} value={sortname}>
          {`${name} (${sortname})`}
        </MenuItem>
      )).sort()}
    </TextField>
  );
};

export default CountrySelect;
