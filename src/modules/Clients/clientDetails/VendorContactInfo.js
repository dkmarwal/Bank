import React, { Component } from "react";
import { Grid, Box, Card, Link} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { getKeyContactInfos } from "~/redux/helpers/clients";

class VendorContactInfo extends Component {
  state = { contactInfo: {}, editDetail: false, selectedContact: null };
  componentDidMount() {
    const { id } = this.props;
    getKeyContactInfos(id).then((resp) => {
      this.setState({ contactInfo: resp && resp["data"] }, () => {
      });
    });
  }
  render() {
    const { classes } = this.props;
    const { contactInfo} = this.state;

    const theme = {};
    return (
      <Grid container className={classes.details}>
        {contactInfo &&
          contactInfo["rows"] &&
          contactInfo["rows"].map((obj) => (
            <Grid item xs={12} md={12} style={{ marginBottom: 24 }}>
              <Card className={classes.card} style={{ padding: "24px" }}>
                {/* {isPayeeEditable && (
                  <Box>
                    <IconButton
                      color="primary"
                      aria-label="Edit Contact"
                      title="Edit Contact"
                      component="span"
                      onClick={(event) =>
                        this.setState({
                          editDetail: true,
                          selectedContact: obj,
                        })
                      }
                    >
                      <BorderColorIcon className={classes.smallIcon} />
                    </IconButton>
                  </Box>
                )} */}
                <Grid container alignItems="end">
                  <Grid item xs={1} md={1}>
                    <Box>
                      <span
                        style={{
                          background: "#e9eef2",
                          color: "#0b1941",
                          width: 50,
                          height: 50,
                          display: "block",
                          textAlign: "center",
                          lineHeight: 2,
                          boxSizing: "border-box",
                        }}
                        className={classes.circleContact}
                      >
                        {this.props.getProfileCircleName(
                          obj.firstName + obj.lastName
                        )}
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={3} md={3} alignItems="center">
                    <Box
                      fontSize={24}
                      color="#0B1941"
                      lineHeight="normal"
                      title={obj.displayName}
                    >
                      {obj.displayName && obj.displayName.length > 12
                        ? obj.displayName.substring(0, 12) + "..."
                        : obj.displayName}
                    </Box>
                    <Box
                      lineHeight="normal"
                      justifyContent="flex-end"
                      style={{
                        color: "black",
                      }}
                    >
                      {obj.jobTitle ? obj.jobTitle : ""}
                    </Box>
                  </Grid>
                  <Grid item xs={5} md={5}>
                    <Box>
                      <span className={classes.value}>
                        <img
                          className={classes.contactIcons}
                          src={require(`~/assets/icons/link.svg`)}
                          alt=""
                        />
                        {obj.fax && (
                          <Grid item xs={11} className={classes.value}>
                            {`${obj.fax.substring(0, 3)}-${obj.fax.substring(
                              3,
                              6
                            )}-${obj.fax.substring(6, 10)}`}
                          </Grid>
                        )}
                      </span>
                    </Box>
                    <Box width="98%">
                      <span className={classes.value}>
                        <img
                          className={classes.contactIcons}
                          src={require(`~/assets/icons/mail.svg`)}
                          alt=""
                        />
                        <span
                          title={obj.email}
                          style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {" "}
                          <Link color="inherit" href={`mailto:${obj.email || ""}`}>
                          {obj.email || ""}
                          </Link>{" "}
                        </span>
                      </span>
                    </Box>
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <div>
                      <Box>
                        <span className={classes.value}>
                          <img
                            className={classes.contactIcons}
                            src={require(`~/assets/icons/phone.svg`)}
                            alt=""
                          />
                          {obj.phone &&
                            `${obj.phoneCountryCode || ""}
                                (${obj.phone.substring(
                                  0,
                                  3
                                )})-${obj.phone.substring(
                              3,
                              6
                            )}-${obj.phone.substring(6, 10)}
                                ${obj.phoneExt || ""}`}
                        </span>
                      </Box>
                      <Box>
                        <span className={classes.value}></span>
                      </Box>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
      </Grid>
    );
  }
}

export default connect((state) => ({
  ...state.clientConfig,
  ...state.user,
}))(withStyles(styles)(VendorContactInfo));
