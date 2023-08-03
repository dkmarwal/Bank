import React from "react";
import TextField from "~/components/Forms/TextField";
import { MenuItem } from "@material-ui/core";
import csc from "country-state-city";

const CityListField = (props) => {
  const {
    value,
    onChange,
    label,
    name,
    state,
    countryCode,
    error,
    helperText,
    ...restProps
  } = props;

  const getStatesList = () => {
    return csc.getStatesOfCountry(csc.getCountryByCode(countryCode).id);
  };
  const getStateIdfromStateName = (name) => {
    let obj = getStatesList().find((s) => s.name === name);
    if (typeof obj === "undefined") return "";
    else return obj.id;
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
      {state &&
        csc.getCitiesOfState(getStateIdfromStateName(state)).map((option) => (
          <MenuItem key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default CityListField;
