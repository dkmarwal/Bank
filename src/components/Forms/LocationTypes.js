import React from "react";
import csc from "country-state-city";
import { FormControl, Select, InputLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
     width: '100%',
    fontSize: "14px",
  },
}));

const LocationTypes = (props) => {
  const {
    value,
    onChange,
    label,
    name,
    countryCode,
    error,
    helperText,
    children,
    ...restProps
  } = props;

  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        // autoWidth
        name={name}
        select
        label={label}
        value={value}
        // renderValue={(phonecode) => `+${phonecode}`}
        onChange={onChange}
        error={error}
        helperText={helperText}
        InputProps={{
          classes: {
            root: classes.cssFilledInput,
            focused: classes.cssFocused,
            disabled: classes.cssDisabled,
          },
        }}
        {...restProps}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default LocationTypes;
