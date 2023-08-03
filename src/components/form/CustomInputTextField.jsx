import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  makeStyles,
  Box,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

const useStyle = makeStyles({
  root: {
    margin: "10px 10px 10px 0px",
    width: "95%",
  },
  formLabel: {
    textAlign: "left",
    marginLeft: "20px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },
});

const CustomInputTextField = ({
  id,
  name,
  select = false,
  label,
  value,
  onChangeHandler,
  editMode,
  options,
  error = "",
  ...restProps
}) => {
  const disabled = editMode ? false : true;
  const classes = useStyle();
  return (
    <FormControl
    id={id}
      disabled={disabled}
      classes={{ root: classes.root }}
      disabled={!editMode}
    >
      <InputLabel
        shrink
        htmlFor={editMode ? "component-simple" : "component-disabled"}
      >
        <Box fontWeight={500} fontSize={20}>
          {label}
        </Box>
      </InputLabel>
      {select ? (
        <>
          <Select
            name={name}
            labelId={id}
            id={id}
            value={value}
            onChange={onChangeHandler}
          >
            {options &&
              options.map(({ key, value, label }, i) => (
                <MenuItem key={key} value={value}>
                  {label}
                </MenuItem>
              ))}
          </Select>
        </>
      ) : (
        <Input
          name={name}
          id={id}
          value={value}
          onChange={onChangeHandler}
          disableUnderline={!editMode}
          inputProps={{
              maxLength:200,
          }}
          {...restProps}
        />
      )}
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomInputTextField;
