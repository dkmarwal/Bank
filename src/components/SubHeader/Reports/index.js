import React, { Component } from "react";
import {
  Typography,
  Paper,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import "../styles.scss";

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0px 48px",
    height: 130,
  },
  headingTop: {
    fontWeight: 400,
    margin: "5px 0px",
    padding: "21px 0px",
    fontSize: "34px",
    color: "#0b1941",
  },
  logoWrap: {
    padding: "0.70rem 1.875rem",
    fontSize: "16px",
    color: "#051b2",
  },
  headerBottom: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "500",
    marginBottom: "10px",
  },
});

class SubHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, title } = this.props;

    return (
      <Paper square className={classes.root}>
        <Box display="flex" flexDirection="column">
          <Box>
            <Typography variant="h2" className={classes.headingTop}>
              {title}
            </Typography>
          </Box>
          <Box>{/*<NavBar {...this.props} /> */}</Box>
        </Box>
      </Paper>
    );
  }
}

export default withStyles(styles)(SubHeader);
