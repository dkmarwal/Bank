import React from "react";
import {
  Button,
  Grid,
  Box,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./styles.scss";

export function ConfirmDialog(props) {
  const { title, message, onConfirm, onCancel, open = true } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        onClose={onCancel}
        className="confirmModal"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/*<IconButton onClick={onConfirm} style={{position: 'relative',*/}
        {/*  left: '92%',*/}
        {/*  marginTop: '-24%'}}>*/}
        {/*  <CloseIcon fontSize="small" />*/}
        {/*</IconButton>*/}

        <Box textAlign="center" width={1} display="block">
          <DialogTitle className="dialogTitle">{title}</DialogTitle>
          <DialogContent>
            <div className="dialogConten">{message}</div>
          </DialogContent>
          <Box flexGrow={1} display="flex" justifyContent="center">
            <Button variant="outlined" onClick={onCancel} color="primary">
              No
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              color="primary"
              autoFocus
              style={{ marginLeft: "32px" }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}

export function AlertDialog(props) {
  const {
    dialogClassName = "",
    title,
    message,
    onConfirm,
    open = true,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      <Box py={6} px={6}>
        {title && (
          <DialogTitle className="alert-dialog-title dialogTitle">
            {title}
          </DialogTitle>
        )}
        {message && (
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" mb={2}>
              <div className="dialogConten">{message}</div>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Grid container justify="center">
            <Grid item>
              <Button
                variant="contained"
                fullWidth="true"
                onClick={onConfirm}
                color="primary"
                style={{ color: "white" }}
                autoFocus
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export function CustomDialog(props) {
  const { dialogClassName = "", onConfirm, open = true } = props;
  return (
    <div className="cstmDialog">
      <Dialog
        maxWidth="md"
        open={open}
        onClose={onConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        //style={props.width ? { width: `${props.width}px` } : null}
        className={`${dialogClassName} customDialog`}
      >
        {props.children}
      </Dialog>
    </div>
  );
}

export function SideDialog(props) {
  const {
    dialogClassName = "",
    title,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    icon,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      className={`${dialogClassName || ""}`}
    >
      <div className={`${alignSide ? "customSideDialog" : ""}`}>
        <Grid container className="heading">
          <Grid xs={1}></Grid>
          {icon && (
            <Grid xs={1}>
              <img src={require(`~/assets/icons/${icon}.svg`)} alt={"Icon"} />
            </Grid>
          )}
          <Grid item xs>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <Grid item xs={2}>
            {" "}
            <IconButton onClick={onConfirm}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
        <Box style={{ padding: 0 }}>
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" m={1}>
              {props.children}
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    OK
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

export function IdleTimeOutModal(props) {
  const { title, message, onConfirm, open = true } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box py={6} px={6}>
          <DialogTitle className="dialogTitle">{title}</DialogTitle>
          <DialogContent>
            <div className="dialogConten">{message}</div>
          </DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              className="yesBtn"
              onClick={onConfirm}
              color="primary"
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
