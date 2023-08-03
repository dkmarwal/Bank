import React from "react";
import { Button as MUIButton, withStyles } from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  primarycontained: {
    backgroundColor: `${theme.palette.button.primary} !important`,
    color: theme.palette.text.default,
    // boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.25rem 2.15rem",
    textTransform: "uppercase",
    minWidth: 135,
    fontSize: 14,
  },
  primaryoutlined: {
    border: `1px solid ${theme.palette.button.primary} !important`,
    color: theme.palette.text.primary,
    // boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.25rem 2.15rem",
    textTransform: "uppercase",
    fontSize: 14,
    minWidth: 135,
  },
  primarytext: {
    border: `none`,
    color: theme.palette.button.primary,
    textTransform: "uppercase",
    fontSize: 14,
    minWidth: 135,
  },
});

const Button = (props) => {
  const { classes, className, ...restProps } = props;
  return (
    <MUIButton
      variant={props.variant || "contained"}
      className={clsx(classes[`${props.color}${props.variant}`], className)}
      onClick={props.onClick}
      {...restProps}
    >
      {props.children}
    </MUIButton>
  );
};

export default withStyles(styles)(Button);
