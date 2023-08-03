import React, { Component, Fragment } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import _ from "lodash";
import "./styles.scss";

export default class NavBar extends Component {
  state = {
    leftMenu: [
      {
        url: "/manage/user",
        name: "Users",
        items: [],
        alias: "user",
        isProtected: true,
      },
      {
        url: "/manage/user/role",
        name: "Roles",
        items: [],
        alias: "role",
        isProtected: true,
      },
    ],
  };

  isViewable(name, isProtected) {
    return true;
	/*if (isProtected) {
      const { claims } = this.props;
      let str = `${name && name.toLowerCase()}_view`;
      let isEnabled = claims && claims.includes(str);
      if (isEnabled) {
        return true;
      }
      return false;
    } else {
      return true;
    }*/
  }

  render() {
    const { leftMenu } = this.state;
    const { alias } = this.props;
    let currentNavIndex = _.findIndex(leftMenu, (item) => item.alias == alias);
    currentNavIndex = currentNavIndex == -1 ? 0 : currentNavIndex;

    return (
      <Fragment>
        <div id="navbar">
          {alias != "none" ? (
            <Tabs
              value={currentNavIndex}
              textColor="secondary"
              indicatorColor="secondary"

              // TabIndicatorProps={{
              //   style: {
              //     backgroundColor: "#F0582A",
              //     color: "#F0582A",
              //   },
              // }}
            >
              {leftMenu.map((navItem, index) => (
                <span key={index} >
                  {this.isViewable(navItem.alias, navItem.isProtected) ===
                  true ? (
                    <Link  to={navItem.url} key={index} style={{color: "rgba(0,0,0,0.87)"}}>
                      <Tab className="test"
                        label={navItem.name}
                        value={currentNavIndex}
                        index={index}
                        selected={currentNavIndex == index ? true : false}
                        // style={currentNavIndex === index ? { color: "#008de5" } : {color:'#000'}}

                      />
                    </Link>
                  ) : null}
                </span>
              ))}
            </Tabs>
          ) : (
            <Box p={1}> </Box>
          )}
        </div>
      </Fragment>
    );
  }
}
