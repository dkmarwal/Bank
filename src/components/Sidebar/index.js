import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import { connect } from "react-redux";
import accessRights from "../../config/accessRights";
import './styles.css';
import clsx from 'clsx';
import { EntityType } from "~/config/entityTypes";

const navigationItems = [
  {
    id: "f8d4be99-0924-4a2f-92ef-a86eda1cbb93",
    title: "Global",
    icon: {
      type: "image",
      file: "icon-global",
    },
    // "link": "/dashboard",
    portalAccess: [2],
    items: [],
  },
  {
    id: "727d2362-5964-4a48-a20e-7b39156621dc",
    title: "Dashboard",
    icon: {
      type: "image",
      file: "icon-dashboard",
    },
    link: "/dashboard",
    portalAccess: [1],
    permissionName: "DASHBOARD_VIEW",
    items: [],
  },
  {
    id: "aec7a14f-92fe-4be6-b42e-0ad87a729c01d",
    title: "General",
    icon: {
      type: "image",
      file: "icon-reports",
    },
    link: "/client/config/general",
    portalAccess: [2],
    items: [],
  },
  {
    id: "aec7a14f-92fe-4be6-b42e-0ad87a729c02d",
    title: "Remittance",
    icon: {
      type: "image",
      file: "icon-reports",
    },
    // "link": "/client/config/remittance",
    portalAccess: [2],
    items: [],
  },
  // {
  //     "id": "a593e139-1092-4e52-beef-5d3ebe00589f",
  //     "title": "Onboard",
  //     "icon": {
  //         "type": "image",
  //         "file": "icon-clients"
  //     },
  //     "link": "/clientOnboard/OnboardType",
  //     "portalAccess": [
  //         1,
  //     ],
  //     "items": []
  // },
  {
    id: "a593e139-1092-4e52-beef-5d3ebe005736",
    title: "Clients",
    icon: {
      type: "image",
      file: "profileIcon",
    },
    link: "/clients",
    portalAccess: [1],
    permissionName: "CLIENTS_LIST_VIEW",
    items: [],
  },
  {
    id: "a593e139-1092-4e52-beef-5d3ebe005736",
    title: "Payees",
    icon: {
      type: "image",
      file: "payeesIcon",
    },
    link: "/payees",
    portalAccess: [1],
    permissionName: "PAYEES_LIST_VIEW",
    items: [],
  },
  {
    id: "1b450fb2-a368-4bec-a143-89e984e1c029",
    title: "Users",
    icon: {
      type: "image",
      file: "icon-people",
    },
    link: "/manage/user",
    portalAccess: [1, 2],
    permissionName: "USERS_LIST_VIEW",
    items: [],
  },
  {
    id: "aec7a14f-92fe-4be6-b42e-0ad87a729c03d",
    title: "Reports",
    icon: {
      type: "image",
      file: "icon-trending_up",
    },
    permissionName: "REPORTS_VIEW",
    link: "/reports",
    portalAccess: [1],

    items: [],
  },
  {
    id: "aec7a14f-92fe-4be6-b42e-0ad87a729c04d",
    title: "Payment",
    icon: {
      type: "image",
      file: "icon-reports",
    },
    link: "/client/config/payment",
    portalAccess: [2],
    items: [],
  },
  {
    id: "aec7a14f-92fe-4be6-b42e-0ad87a729c05d",
    title: "File",
    icon: {
      type: "image",
      file: "icon-reports",
    },
    link: "/client/config/file",
    portalAccess: [2],
    items: [],
  },
  {
    id: "727d2362-5964-4a48-a20e-7b39156621uy",
    title: "Clients",
    icon: {
      type: "image",
      file: "icon-home",
    },
    link: "/clients",
    portalAccess: [2],
    items: [],
  },
];

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: ""
    }
  }

  componentDidMount=()=>{
    // this.getAppType()
  }

  
  handleClick = (id) => {
    if (this.state.open === id) {
      this.setState({ open: "" });
    } else {
      this.setState({ open: id });
    }
  };

  renderSidebarItem = (item, index) => {    
    const { classes } = this.props;
    const currentUrl = this.props.match.url;
    let active = false;
    if (currentUrl == item.link) {
      active = true;
    }
    return (
      <Link to={item.link} key={item.id}>
        <Box
          className={[
            classes.sidebarItem,
            active ? classes.sidebarItemSelected : "",
          ].join(" ")}
        >
          <Box
            className={[
              classes.sidebarItemIcon,
              active ? classes.sidebarItemIconSelected : "",
            ].join(" ")}
          >
            <img
              src={require(`~/assets/icons/${item.icon.file}${active ? "" : "-unselected"
                }.svg`)}
              alt={item.title}
              title={item.title}
              className="menu-icon"
            />
          </Box>
          <Box
            className={[
              classes.sidebarItemName,
              "sidebarMenuItem",
              active ? classes.sidebarItemNameSelected : "",
            ].join(" ")}
          >
            <Typography variant="caption">{item.title}</Typography>
          </Box>
        </Box>
      </Link>
    );
  };

  nestedItem = (item) => {
    const nestedMenu = item.items.map((nested, i) => {
      return this.renderSidebarItem(nested, nested.id);
    });
    return (
      <Fragment>
        <ListItem button onClick={this.handleClick(item.id)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={item.title}></ListItemText>
          {(this.state.open === item.id) === item.id ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItem>
        <Collapse
          in={() => this.state.open === item.id}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {nestedMenu}
            {
              // <ListItem button className={`classes.nested`}>
              // 	<ListItemIcon>
              // 		<StarBorder />
              // 	</ListItemIcon>
              // 	<ListItemText primary="Starred" />
              // </ListItem>
            }
          </List>
        </Collapse>
      </Fragment>
    );
  };

  showItem(name) {
    const { permissions } = this.props;
    const claims = permissions.minified;
    const flag = claims && claims.includes(accessRights[name]);
    return flag;
  }

  render() {
    const { user, classes } = this.props;
    const {userType} = this.props;
    const isCCUser = Object.keys(userType).length > 0 && userType.includes(EntityType.CARDS ?? false);    

    return (
      <div className={classes.sidebarContainer} >
        <div className={clsx("sidebar-menu", "sidebarMenuItem")} style={{ background: '#0b1a40 !important' }}>
          {navigationItems
            .filter(
              (sidebarItem) =>
                sidebarItem.portalAccess.indexOf(user.portalTypeId) !== -1
            )
            .map(
              (sidebarItem, index) =>
                sidebarItem.permissionName === 'PAYEES_LIST_VIEW' && !isCCUser 
                  ? null
                  : (this.showItem(sidebarItem.permissionName) ||
                  sidebarItem["title"] == "Dashboard") &&
                  this.renderSidebarItem(sidebarItem, index)               
            )}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  ...state.permissions,
}))(withStyles(styles)(Sidebar));
