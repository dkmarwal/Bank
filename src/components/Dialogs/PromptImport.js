import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import InfoIcon from "~/assets/icons/info-24px.svg";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  PromptWraper: {
    padding: "18px",
    minHeight: "82px",
    backgroundColor: theme.palette.background.active,
  },
  noDisplay: {
    display: "none",
  },
  promptText: {
    fontSize: "16px",
    lineHeight: "22px",
    color: "#0b1941",
    fontWeight: "500",
    position: "relative",
    display: "inherit",
  },
  ActiveButton: {
    fontSize: "16px",
    lineHeight: "22px",
    border: "2px solid #0b1941",
    minWidth: "184px",
    fontWeight: "bold",
    margin: "0 8px",
    color: "#0b1941",
    backgroundColor: "rgba(96,148,177,0.2)",
    boxShadow: "inset 0 1px 5px 1px rgba(96,148,177,0.52)",
  },
  ClearButton: {
    fontSize: "16px",
    lineHeight: "22px",
    border: "2px solid #0b1941",
    margin: "0 8px",
    minWidth: "194px",
    fontWeight: "bold",
  },
  infoIcon: {
    position: "relative",
    left: "-2%",
    width: "20px",
    height: "20px",
  },
  paddingClass: {
    padding: "5px",
  },
}));

export default function PromptImport(props) {
  const classes = useStyles();
  const [clearState, clearCb] = useState(true);
  const promptText = props.promptText;
  const importCb = () => {
    props.cancel !== "No" && clearCb(false);
    props.importCb();
  };
  const cancelClicked = () => {
    props.cancel === "No" ? props.clickedNo() : clearCb(false);
  };

  return clearState ? (
    <Grid container className={classes.PromptWraper}>
      <Grid
        container
        xs={7}
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.paddingClass}
      >
        <div className={classes.promptText}>
          <img src={InfoIcon} className={classes.infoIcon} alt={`InfoIcon`} />
          <Typography>{promptText}</Typography>
        </div>
      </Grid>
      <Grid item xs={5} className={classes.paddingClass}>
        <Button
          onClick={importCb}
          className={classes.ActiveButton}
          variant="outlined"
        >
          {props.import ? props.import : "Import"}
        </Button>
        <Button
          onClick={cancelClicked}
          className={classes.ClearButton}
          variant="outlined"
        >
          {props.cancel ? props.cancel : "Cancel"}
        </Button>
      </Grid>
    </Grid>
  ) : null;
}
