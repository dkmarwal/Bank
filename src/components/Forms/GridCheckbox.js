import React from "react";
import { withStyles } from "@material-ui/core";
import ACH from "~/assets/icons/ACH_main.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import CHK from "~/assets/icons/CHK_main.svg";

const styles = (theme) => ({
  boxWrap: {
    cursor: "pointer",
    position: "relative",
    backgroundColor: theme.palette.background.active,
    padding: "10px",
    textAlign: "center",
    margin: "0px 18px",
    color: "#7F7F7F",
    fontSize: "14px !important",
    fontWeight: "bold",
    lineHeight: "22px",
    borderRadius: "4px",
    boxSizing: "border-box",
    border: "1px solid #fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },

  checkedIcon: {
    position: "absolute",
    left: "5px",
    top: "5px",
    height: "15px",
    width: "15px",
    "& svg": {
      height: "15px",
      width: "15px",
    },
  },
  boxWrapActive: {
    cursor: "pointer",
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    padding: "10px",
    margin: "0px 18px",
    textAlign: "center",
    color: theme.palette.text.default,
    fontSize: "14px !important",
    fontWeight: "bold",
    lineHeight: "22px",
    borderRadius: "4px",
    boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
  },
  iconClass: {
    backgroundColor: theme.palette.background.active,
    display: "block",
    margin: "0 auto",
    marginBottom: "5px",
  },

  checkClass: {
    height: "15px",
    width: "15px",
  },
});

const GridCheckBox = (props) => {
  const { classes } = props;
  const handleClick = (index, e) => {
    e.target.checked = !e.target.checked;
    props.onChange(e, index);
  };
  const returnIcon = () => {
    if (props.icon === "ACH" || props.icon === "EFT") {
      return <img className={classes.iconClass} src={ACH} alt="" />;
    } else if (props.icon === "VCA") {
      return <img className={classes.iconClass} src={VCA} alt="" />;
    } else if (props.icon === "CHK") {
      return <img className={classes.iconClass} src={CHK} alt="" />;
    }
  };
  return (
    <div
      className={props.checked ? classes.boxWrapActive : classes.boxWrap}
      checked={props.checked}
      onClick={(e) => handleClick(props.index, e)}
    >
      {props.checked ? (
        <span className={classes.checkedIcon}>
          <img
            className={classes.checkClass}
            src={require(`~/assets/icons/checkTick.svg`)}
            alt=""
          />
        </span>
      ) : null}
      {props.icon && returnIcon()}
      {props.label}
    </div>
  );
};

export default withStyles(styles)(GridCheckBox);
