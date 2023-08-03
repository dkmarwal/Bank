import React, { Component } from "react";
import {
  Typography,
  Box,
  Card,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Tabs, Tab } from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import "./styles.scss";

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0px 48px",
  },
  headingTop: {
    margin: "5px 0px",
    padding: "21px 0px 10px",
    fontSize: 34,
    fontWeight: "500",
    color: "#0B1941",
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
  card: {
    height: 130,
    overflow: "visible",
  },
});

class SubHeader extends Component {       
  state = {
    selectedTab: this?.props?.location?.state?.tabID ?? 0, //Will set history state tab ID in case of Drill Down otherwise set 0 by default
  };

  isViewable(name, isProtected) {
    return true;
    // if (isProtected) {
    //   const { claims } = this.props;
    //   let str = `${name && name.toLowerCase()}_view`;
    //   let isEnabled = claims && claims.includes(str);
    //   if (isEnabled) {
    //     return true;
    //   }
    //   return false;
    // } else {
    //   return true;
    // }
  }

  handleTabChange = (index) => {
    this.props.location.state={};
    this.setState({ selectedTab: index });
  };

  render() {
    const { classes, title } = this.props;
    const { tabs } = this.props;
    const { selectedTab } = this.state;

    return (
      <Box display="flex" flexDirection="column">
        <Card square className={classes.card}>
          <Box px={6}>
            <Box>
              <Typography
                color="primary"
                variant="h2"
                className={classes.headingTop}
              >
                {title}
              </Typography>
            </Box>
            <Tabs value={selectedTab} color="primary">
              {tabs.filter(tab=>tab.showTab).map((tab, index) => (
                <span key={index}>
                  {tab.showTab && (
                    <Tab
                      onClick={() => this.handleTabChange(index)}
                      label={tab.name}
                      disabled={false}
                      index={index}
                      selected={selectedTab === index}
                      style={
                        selectedTab === index
                          ? { color: "#008de5" }
                          : { color: "#000" }
                      }
                    />
                  )}
                </span>
              ))}
            </Tabs>
          </Box>
        </Card>
        {tabs.filter(tab=>tab.showTab).map((obj, i) => (
          <div key={i}>
            {selectedTab === i && obj.showTab && (
              <TabPanel value={selectedTab} index={i}>
                {obj.component}
              </TabPanel>
            )}
          </div>
        ))}
      </Box>
    );
  }
}

export default withStyles(styles)(SubHeader);
