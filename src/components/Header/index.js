import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  MenuItem,
  Paper,
  Link,
  Box,
  Divider,
  Avatar,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import { withStyles } from "@material-ui/styles";
import CitiLogo from "~/assets/images/CitiLogo.svg";
import Popover from "@material-ui/core/Popover";
import USBankLogo from '~/assets/images/USBANK 1.svg';
import { logout } from "~/redux/actions/user";
import styles from "./styles";
import { BankLabel } from '~/config/bankTypes';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      anchorEl: null,
      dialogActive: false,
      title: "",
      message: "",
    };
  }

  handleToggle = (event) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null,
    });
  };

  logout() {
    this.props.dispatch(logout());
    this.props.history.push("/logout");
  }

  render() {
    const { menuOpen, anchorEl } = this.state;
    const { classes, info } = this.props;
    const {isPayeeChoicePortal} = this.props.user
    //console.log("user",user);
    return (
      <Fragment>
        <Paper square className={classes.headerContainer}>
          <Box className={classes.logoContainer}>
            <Box className={classes.citiLogo}>
              <img src={isPayeeChoicePortal ? USBankLogo : CitiLogo} alt={isPayeeChoicePortal ? 'USBank' :`Citibank`} height={24} />
            </Box>
            <Box
              color="rgba(0,0,0,0.74)"
              fontFamily="'Roboto', sans-serif"
              fontWeight={600}
              fontSize={16}
              pl={4}
              pt={0.5}
            >
              {/* Payment Exchange */}
              {isPayeeChoicePortal ? BankLabel.USBANK : BankLabel.CITIBANK}
            </Box>
          </Box>
          <Box className={classes.rightNavContainer}>            
            <Box className={classes.rightNavDropdownContainer}>
              <div className={classes.headerMenuList}>
                <Link
                  underline="none"
                  size="small"
                  aria-controls="header-menu"
                  aria-haspopup="menu"
                  onClick={(event) => this.handleToggle(event)}
                >
                  <span className={classes.userIconBg}>
                    <PersonIcon fontSize="medium"/>
                  </span>
                  {/* <span style={{ margin: "0px 8px" }}>
                    {info && info.displayName}
                  </span> */}
                </Link>

                <Popover
                  className={classes.headerMenu}
                  anchorEl={anchorEl}
                  keepMounted                  
                  open={menuOpen}
                  onClose={() => this.handleClose()}
                >
                  <Box
                    pt={2}
                    px={5}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Avatar
                      alt="user pic"
                      src="/static/images/avatar/1.jpg"
                      className={classes.large}
                    >
                      {info &&
                        info.displayName &&
                        info.displayName
                          .match(/(\b\S)?/g)
                          .join("")
                          .match(/(^\S|\S$)?/g)
                          .join("")
                          .toUpperCase()}
                    </Avatar>
                    <Box pt={2}>
                      <span className={classes.profileHeading}>
                        {info && info.displayName}
                      </span>
                    </Box>
                    <Box>
                      <span className={classes.profileEmail}>
                        {info && info.email}
                      </span>
                    </Box>
                    <Box
                      mt={0.5}
                      width="36px"
                      height="1.5px"
                      style={{ backgroundColor: "#999999" }}
                    ></Box>
                    <Box mt={2} mb={1}>
                      <MenuItem
                        onClick={() => {
                          this.handleClose();
                          this.props.history.push("/user");
                        }}
                      >
                        <span className={classes.profileManage}>
                          Manage Your Account
                        </span>
                      </MenuItem>
                    </Box>
                  </Box>

                  <Divider />
                  <MenuItem
                    onClick={() => {
                      this.props.dispatch(logout());
                    }}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    LOGOUT
                  </MenuItem>
                </Popover>                
              </div>
            </Box>
          </Box>
        </Paper>
      </Fragment>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withStyles(styles)(Header)
);
