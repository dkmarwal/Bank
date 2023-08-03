import React from "react";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Box,
  FormLabel,
} from "@material-ui/core";
import Divider from "~/components/Divider";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const expansionStyle = makeStyles((theme) => ({
  expanded: {
    margin: "20px 0px 0px",
  },
}));

const expansionSumStyle = makeStyles({
  root: {},
  expanded: {
    backgroundColor: "#FFFFFF",
    // margin: '20px 0px 0px',
  },
  content: {
    "&.Mui-expanded": {
      margin: "20px 0px 0px",
    },
  },
  expandIcon: {
    marginRight: "20px",
  },
});

const expansionDetailStyle = makeStyles({
  root: {},
  // expanded: {
  //     margin: '20px 0px 0px',
  // }
});

const useStyles = makeStyles((theme) => ({}));

const formControlStyle = makeStyles((theme) => ({
  root: {},
}));

const ExpansionBar = ({
  label,
  summary,
  name,
  checkBoxLabel,
  indeterminate,
  children,
  checked,
  oncheckedHandler,
  isExpended,
  ...restProps
}) => {
  const formControlClasses = formControlStyle();
  const handleChange = (event) => {
    const { checked } = event.target;
    oncheckedHandler(name, checked);
  };
  return (
    <ExpansionPanel key={label} {...restProps} square={true} expanded={true}>
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {checkBoxLabel ? (
          <FormControlLabel
            classes={formControlClasses}
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Checkbox
                indeterminate={indeterminate}
                checked={checked}
                onChange={handleChange}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
              />
            }
            label={label}
          />
        ) : (
          <FormLabel> {label}</FormLabel>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Box width={1}>
          {summary && <Typography color="initial">{summary}</Typography>}
          <Box width={1} mb={2} ml={4}>
            {children}
          </Box>
          <Divider />
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ExpansionBar;
