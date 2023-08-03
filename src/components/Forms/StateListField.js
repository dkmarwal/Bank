import React from "react";
import TextField from "~/components/Forms/TextField";
import csc from "country-state-city";
import { MenuItem } from "@material-ui/core";

const StateListField = (props) => {
  const {
    value,
    onChange,
    label,
    name,
    countryCode,
    error,
    helperText,
    ...restProps
  } = props;

  const getStatesList = () => {
    return csc.getStatesOfCountry(csc.getCountryByCode(countryCode).id);
  };

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
      required
      {...restProps}
    >
      <MenuItem id="" value=""><em>Select</em></MenuItem>
      {getStatesList().length > 0 &&
        getStatesList().map((option) => (
          <MenuItem id={option.id} key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default StateListField;
