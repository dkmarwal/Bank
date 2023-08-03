import React from "react";
import { Button as MUIButton, withStyles, Typography } from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  primarycontained: {
    backgroundColor: `${theme.palette.button.primary} !important`,
    color: theme.palette.text.default,
    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.25rem 4.15rem",
  },
  primaryoutlined: {
    border: `1px solid #0b1941 !important`,
    color: `#0b1941`,
    boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.19)",
    padding: "0.25rem 1.5rem",
    borderRadius: `10rem`,
  },
  primarytext: {
    border: `none`,
    color: theme.palette.button.primary,
  },
});

const CurvedButton = (props) => {
  const { classes, className, icon, label, ...restProps } = props;
  return (
    <MUIButton
      variant={props.variant || "contained"}
      className={clsx(classes[`${props.color}${props.variant}`], className)}
      onClick={props.onClick}
      {...restProps}
    >
      {icon ? icon : ""}
      {label ? <Typography variant="body2">{label}</Typography> : ""}
      {props.children}
    </MUIButton>
  );
};

export default withStyles(styles)(CurvedButton);
