import React from "react";
import { Grid, Typography, Box, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "#4bb8b0",
    backgroundColor: "white",
    "&:hover": {
      color: "#FFFFFF",
      border: "1px solid #4bb8b0",
      backgroundColor: "#4bb8b0",
    },
  },
}));

const InfoCardHeader = ({ title, onclickAdd }) => {
  const classes = useStyles();
  return (
    <Grid container direction="row" alignItems="center" spacing={1}>
      <Grid item xs={9}>
        <Typography variant="subtitle1">
          <Box fontWeight={700} fontSize={24}>
            {title}
          </Box>
        </Typography>
      </Grid>
      {onclickAdd ? (
        <Grid item xs={3}>
             <Button
                  size="small"
                  onClick={onclickAdd}
                  className={classes.button}
                >
                      ADD
                </Button>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};
export default InfoCardHeader;
