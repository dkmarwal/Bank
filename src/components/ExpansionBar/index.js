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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const expansionStyle = makeStyles((theme) => ({
  root: {
    marginBottom: "20px",
    width: "100%",
    borderRadius: "4px",
    borderBottom: "3px solid #002D43 !important",
  },
  expanded: {
    margin: "20px 0px 0px",
  },
}));

const expansionSumStyle = makeStyles({
  root: {
    backgroundColor: `rgba(239,239,239,0.54)`,
  },
  expanded: {
    backgroundColor: "#FFFFFF",
    // margin: '20px 0px 0px',
  },
  content: {
    "&.Mui-expanded": {
      margin: "20px 8px 0px",
    },
  },
  expandIcon: {
    marginRight: "20px",
  },
});

const expansionDetailStyle = makeStyles({
  root: {
    // borderBottom: '3px solid #6094B1',
  },
  // expanded: {
  //     margin: '20px 0px 0px',
  // }
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  divider: {
    height: "1px",
    width: "100%",
    marginBottom: "20px",
  },
  summary: {
    height: "43px",
    width: "557px",
    color: "#4C4C4C",
    fontFamily: theme.typography.fontFamily,
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "300",
    letterSpacing: "0",
    lineHeight: "22px",
  },
}));

const formControlStyle = makeStyles((theme) => ({
  root: {},
  label: {
    color: "#4C4C4C",
    fontFamily: theme.typography.fontFamily,
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0",
    lineHeight: "16px",
  },
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
  const expansionClasses = expansionStyle();
  const expansionSumClasses = expansionSumStyle();
  const expansionDetailClasses = expansionDetailStyle();
  const formControlClasses = formControlStyle();
  const classes = useStyles();
  const handleChange = (event) => {
    const { checked } = event.target;
    oncheckedHandler(name, checked);
  };
  return (
    <ExpansionPanel key={label} classes={expansionClasses} {...restProps}>
      <ExpansionPanelSummary
        classes={expansionSumClasses}
        expandIcon={<ArrowDropDownIcon />}
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
                icon={<CheckBoxOutlineBlankIcon style={{ color: "#0b1941" }} />}
                checkedIcon={<CheckBoxIcon style={{ color: "#0b1941" }} />}
              />
            }
            label={label}
          />
        ) : (
          <FormLabel className={formControlClasses.label}> {label}</FormLabel>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={expansionDetailClasses}>
        <Box m={2} width="100%">
          {summary && (
            <Typography className={classes.summary}>{summary}</Typography>
          )}
          <Box mb={2} width="100%">
            <Divider />
          </Box>
          {children}
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ExpansionBar;
