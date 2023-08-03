import React from "react";
import {
  TextField as MUITextField,
  withStyles,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const styles = (theme) => ({
  root: {
    //height: "70px",
  },
  textField: {
    fontSize: "10px",
  },

  cssLabel: {
    color: theme.palette.secondary.contrastText,
    fontSize: "14px",
  },
  cssDisabled: {
    "&::before": {
      borderBottomStyle: "solid",
    },
  },
  cssFilledInput: {
    lineHeight: "16px",
    fontSize: "14px",
    "&::before": {
      borderBottom: `1px solid ${theme.palette.primary.light}`,
    },
    "&$cssDisabled": {
      "&::before": {
        borderBottom: `1px solid rgba(0,0,0,0.42)`,
      },
    },
    "&$cssFocused": {
      //borderColor: `${theme.palette.primary.main} !important`,
    },
  },

  cssFocused: {},
});

const TextField = (props) => {
  const {
    classes,
    id,
    name,
    label,
    value,
    type,
    required,
    select,
    onChange,
    onBlur,
    helperText,
    error,
    tooltipProps,
    disabled,
    children,
    inputProps,
    ...restProps
  } = props;

  const info = tooltipProps && (
    <Tooltip title={tooltipProps.title} arrow placement="right">
      {tooltipProps.icon || <InfoOutlinedIcon />}
    </Tooltip>
  );

  return (
    <div className={classes.root}>
      <MUITextField
        select={select ? true : false}
        name={name}
        id={id}
        label={label}
        type={type}
        variant="outlined"
        autoComplete="off"
        autoFocus={false}
        value={value}
        required={required ? true : false}
        className={classes.textField}
        inputProps={{
          ...inputProps,
        }}
        InputLabelProps={{
          classes: {
            root: classes.cssLabel,
            focused: classes.cssFocused,
          },
        }}
        InputProps={{
          endAdornment: tooltipProps ? (
            <InputAdornment position="end">{info}</InputAdornment>
          ) : null,
          classes: {
            root: classes.cssFilledInput,
            focused: classes.cssFocused,
            disabled: classes.cssDisabled,
          },
        }}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        disabled={disabled}
        fullWidth
        {...restProps}
      >
        {select && children}
      </MUITextField>
    </div>
  );
};

export default withStyles(styles)(TextField);
