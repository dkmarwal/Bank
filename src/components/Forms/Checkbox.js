import React from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0.25rem`,
    flex: 1,
    cursor: "pointer",
    border: `2px solid ${theme.palette.secondary.main}`,
    borderRadius: "4px",
  },
  checked: {
    backgroundColor: "#008ce6",
    color: "#FFFFFF",
    borderRadius: `4px`,
    position: "relative",
    border: `3px solid`,
  },
  checkedIcon: {
    maxWidth: "3rem",
    width: "1rem",
    position: "absolute",
    left: "1rem",
    // bottom: "1rem",
    top: "1rem",
  },
  hasIconChecked: {},
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: theme.spacing(1, 0),
  },
  hasIcon: {
    padding: theme.spacing(2, 0),
  },
  textWithIcon: {
    marginTop: theme.spacing(1),
  }
});

const Checkbox = (props) => {
  const {
    classes,
    onChange,
    label,
    checked,
    icon,
    index,
    paymentClassName,
    ...restProps
  } = props;
  const isChecked = checked;

  return (
    <Box
      className={clsx(classes.checkBoxItem, {
        [classes.checked]: isChecked,
      }, !isChecked ? paymentClassName ? paymentClassName : '' : '')}
      onClick={(e) => {
        onChange && onChange(e, index, !isChecked);
      }}
    >
      {checked && (
        <img
          className={clsx(classes.checkedIcon, {
            [classes.hasIconChecked]: icon !== undefined,
          })}
          src={require(`~/assets/icons/checkTick.svg`)}
          alt=""
        />
      )}
      <Box
        className={clsx(classes.itemContainer, {
          [classes.hasIcon]: icon !== undefined,
        })}
      >
        {icon ? icon : null}
        <Typography
          className={clsx({
            [classes.textWithIcon]: icon !== undefined,
          })}
          variant={isChecked ? "body2" : "caption"}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Checkbox);
