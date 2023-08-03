import React from "react";
import {
  Box,
  makeStyles,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 768,
    margin: 0,
    padding: "0px 16px",
    backgroundColor: theme.palette.background.active,
    zIndex: 1,
    marginBottom: "10px",
    overflowY: "scroll",
    height: "95%",
  },
  paper: {
    width: "100%",
    paddingTop: "16px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 12px 10px 12px",
    boxShadow: "0 4px 6px -6px grey",
    alignItems: "center",
  },
  checkBox: {
    "& span": {
      color: "#000000",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.6,
    },
  },
  heading: {
    paddingTop: 0,
    color: "#0b1941",
    fontSize: 24,
    lineHeight: "24px",
    fontWeight: "normal",
  },
}));

export default function DetailView(props) {
  const classes = useStyles();

  const { open, title = "Details", handleClose, children } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      maxWidth="768px"
    >
      <Box style={{ display: "flex", flexDirection: "column" }}>
        <DialogTitle style={{ padding: "10px 0px 5px 0px" }}>
          <Box className={classes.header}>
            <Box p={1} justifyItems="center">
              <Typography className={classes.heading}>
                <Box
                  pr={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {" "}
                  <AccountBoxRoundedIcon />
                  <Box component="span" pl={2}>
                    {title}
                  </Box>{" "}
                </Box>
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label="Close"
                title="Close"
                component="span"
                onClick={() => handleClose()}
                style={{ padding: "4px" }}
              >
                <CloseIcon variant="contained" style={{color: "#0B1941"}} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.root} hidden={!open}>
          {children}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
