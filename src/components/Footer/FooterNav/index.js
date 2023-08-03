import React, { Component } from "react";
import { Box, withStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import USBankLogo from '~/assets/images/USBANK 1.svg';

const styles = (theme) => ({
  link: {
    // "&:last-child": {
    //   paddingLeft: "5px",
    // },
    display: "flex",
    alignItems: "center",
    position: "relative",
    fontWeight: "500",
    lineHeight: "normal",
    paddingRight: 20,
    color: "#4C4C4C",
    transition: " all .3s ease",
    whiteSpace: "nowrap"
  },
  copyRight: {
    whiteSpace: "nowrap",
    lineHeight: "20px",
    textAlign: "right",
    fontWeight: "500",
    fontSize: "10px",
    color: "#4C4C4C",
  },
  img: {
    paddingRight: "15px",
    verticalAlign: "text-bottom",
    float: "left",
  },

  fontSizeSmall: {
    fontSize: 12,
    verticalAlign: "middle",
    paddingRight: 5,
  },
});

class FooterNav extends Component {
  render() {
    const { classes } = this.props;
    const {isPayeeChoicePortal} = this.props.user
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexGrow={1}
        bgcolor="#EFEFEF"
        px={6}
        py={1}
        alignItems="center"
      >
        <Box width="45%">
          {/* Powered by <Link to="#" className={classes.link} key={1}>
                      <img alt="Citi" className={classes.img} src={require('~/assets/images/incedopay_logo.png')} width="84" />
                      </Link>
                  */}
          <Typography>
            <span className={classes.link}>
              <Link to="#" className={classes.link} key={1}>
                <img
                  alt="Citi"
                  className={classes.img}
                  src={isPayeeChoicePortal ? USBankLogo : require("~/assets/images/citi-color-logo.svg")}
                  width="35"
                />
                {!isPayeeChoicePortal && `Citigroup.com is the global source of information about and
                access to financial services provided by the Citigroup
                companies.`}
              </Link>
            </span>
          </Typography>
        </Box>
        <Box>
          <Typography className={classes.copyRight}>
            {isPayeeChoicePortal ? `© 2022 U.S. Bank`:`Copyright © 2021 Citi. All rights reserved.`}
          </Typography>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user }))(withStyles(styles)(FooterNav));
