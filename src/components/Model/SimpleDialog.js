import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  makeStyles,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import { ReactComponent as SuccessCheck } from "./SuccessCheck.svg";
import { ReactComponent as CloseDialog } from "./CloseDialog.svg";

const useStyles = makeStyles({
  titleCheckIcon: {
    boxSizing: "border-box",
    height: "74px",
    borderRadius: "46px",
    width: "74px",
    border: "3px solid #FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  titleCloseIcon: {
    width: "30px",
    height: "29px",
    position: "absolute",
    right: "10px",
    top: "10px",
  },
  button: {
    paddingLeft: "33px",
    minWidth: "92px",
    paddingRight: "29px",
    height: 40,
  },
  title: {
    backgroundColor: "#008ce6",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  contentTitle: {
    color: "#4C4C4C",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: "24px",
    textAlign: "center",
  },
  contentSubtitle: {
    color: "#4C4C4C",
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: "22px",
    textAlign: "center",
    marginTop: "10px",
  },
  checkIcon: {
    boxSizing: "border-box",
    height: "29px",
    width: "38px",
  },
  closeIcon: {},
});

const dialogStyles = makeStyles({
  root: {},
  paperScrollPaper: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
});

const contentStyle = makeStyles({
  root: {
    padding: "20px",
    borderRadius: "0",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 5px 11px 4px rgba(0, 0, 0, 0.17)",
    maxHeight: 500,
    height: 150,
    overflow: "hidden",
  },
});

const SimpleDialog = ({
  open,
  modalActions,
  onCloseModal,
  title,
  subtitle,
}) => {
  const classes = useStyles();
  const dialogClasses = dialogStyles();
  const contentClasses = contentStyle();

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      classes={dialogClasses}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        className={classes.title}
        disableTypography
      >
        <div className={classes.titleCheckIcon}>
          <SuccessCheck className={classes.checkIcon} />
        </div>
        <div className={classes.titleCloseIcon} onClick={onCloseModal}>
          <CloseDialog className={classes.closeIcon} />
        </div>
      </DialogTitle>
      <DialogContent classes={contentClasses}>
        <Box>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid xs={12} item container justify="center">
              <Box my={2}>
                {title && (
                  <Typography className={classes.contentTitle}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography className={classes.contentSubtitle}>
                    {subtitle}
                  </Typography>
                )}
              </Box>

              <Box display="flex" justifyContent="center" width="100%" my={3}>
                {modalActions.map(({ label, onClickHandler, variant, disabled }) => (
                  <Button
                    key={label}
                    className={classes.button}
                    variant={variant}
                    color="primary"
                    onClick={onClickHandler}
                    disabled={disabled}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default SimpleDialog;
