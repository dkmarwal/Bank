import React, { useState, useEffect } from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxGroupContainer: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: `4px`,
    padding: theme.spacing(0.5, 1),
    display: "flex",
  },
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    cursor: "pointer",
    padding: "5px 25px",
  },
  checked: {
    backgroundColor: "#0b1941",
    color: "#FFFFFF",
    borderRadius: `4px`,
    position: "relative",
  },
  checkedIcon: {
    maxWidth: "15px",
    position: "absolute",
    left: "10px",
  },
});

const CheckboxGroupCampaign = (props) => {
  const {
    classes,
    className,
    options,
    selectedOption,
    onChange,
    disabled,
    ...restProps
  } = props;
  const [checkedIndex, setCheckedIndex] = useState(
    selectedOption ? selectedOption : 0
  );
  useEffect(() => {
    setCheckedIndex(selectedOption);
  }, [selectedOption]);

  const readOnly = disabled || false;
  return (
    <Box className={classes.checkBoxGroupContainer}>
      {options.map((option, index) => (
        <Box
          pl={2}
          pr={2}
          width="100%"
          key={`checkbox-group-item-${index}`}
          className={clsx(classes.checkBoxItem, {
            [classes.checked]: option.value === checkedIndex,
          })}
          onClick={(e) => {
            !readOnly && onChange && onChange(option, index, e);
          }}
        >
          <Typography variant={option.value === checkedIndex ? "body2" : "caption"}>
            {option.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default withStyles(styles)(CheckboxGroupCampaign);
