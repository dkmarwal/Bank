import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import SubHeader from "~/components/SubHeader";
import ListView from "./User/ListView/";
import UserEdit from "./User/EditView/";
import UserAdd from "./User/AddView/";
import Role from "./Role/ListView";
import Permissions from "./Role/Permissions";

import Clients from "./Clients/ListView";
import ClientPermissions from "./Clients/Permissions";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import accessRights from "~/config/accessRights";

class AuthRoute extends Component {
  constructor(props) {
    super(props);
    this.state = { title: this.props.title };
  }

  isAllowed(permissions, name) {
    return permissions && permissions.includes(accessRights[name]);
  }

  componentDidMount() {
    //this.setState({title:this.props.title});
  }
  /* static getDerivedStateFromProps(props, state) {
        if (props.title !== state.title) {
          return {
               title: props.title,
          };
        }

        // Return null if the state hasn't changed
        return null;
    }*/
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.title !== prevState.title) {
      //this.setState({title});
    }
  }

  handleChangeTitle = (title) => {
    this.setState({ title: title });
  };

  render() {
    const {
      component: Component,
      permissionName,
      claims,
      alias,
      title,
      ...rest
    } = this.props;
    //const {title} = this.state;
    const isAccessable = this.isAllowed(claims, permissionName);
    return (
      <Route
        exact={true}
        {...rest}
        render={(props) =>
          isAccessable === true ? (
            <Fragment>
              <SubHeader {...props} title={title} alias={alias} />
              <Component
                {...props}
                title={title}
                handleChangeTitle={this.handleChangeTitle}
              />
            </Fragment>
          ) : null
        }
      />
    );
  }
}

class UserManagement extends Component {
  render() {
    const { claims, classes } = this.props;

    return (
      <div className={classes.root}>
        <Fragment>
          <Switch>
            <AuthRoute
              exact
              path="/manage/user"
              component={ListView}
              claims={claims}
              permissionName="USERS_LIST_VIEW"
              name={"user_view"}
              title="Users"
              alias="user"
            />
            <AuthRoute
              exact
              path="/manage/user/add"
              component={UserAdd}
              permissionName="USERS_LIST_ADD"
              claims={claims}
              name={"user_add"}
              title="Add User"
              alias="none"
            />
            <AuthRoute
              exact
              path="/manage/user/edit/:userId"
              permissionName="USERS_LIST_UPDATE"
              component={UserEdit}
              claims={claims}
              name={"user_edit"}
              title="Users"
              alias="none"
            />
            <AuthRoute
              exact
              path="/manage/user/role"
              component={Role}
              claims={claims}
              permissionName="USERS_ROLES_VIEW"
              name={"role_view"}
              title="Roles"
              alias="role"
            />
            <AuthRoute
              exact
              path="/manage/user/permissions/add"
              component={Permissions}
              claims={claims}
              permissionName="USERS_ROLES_ADD"
              name={"permission_add"}
              title="Add Role"
              alias="role"
            />
            <AuthRoute
              exact
              path="/manage/user/permissions/:roleId"
              component={Permissions}
              claims={claims}
              permissionName="USERS_ROLES_EDIT"
              name={"permission_edit"}
              title="Edit Role"
              alias="role"
            />
            <AuthRoute
              exact
              path="/manage/user/clients/:userId"
              permissionName="USERS_LIST_UPDATE"
              component={Clients}
              claims={claims}
              name={"clients_view"}
              alias="none"
              title="Client Access"
            />
            <AuthRoute
              exact
              path="/manage/user/clients/permissions/:clientId"
              component={ClientPermissions}
              claims={claims}
              name={"clients_edit"}
              permissionName="USER_CLIENT_PERMISSION"
              title="Edit Client Permissions"
              alias="none"
            />
          </Switch>
        </Fragment>
      </div>
    );
  }
}

export default withStyles(styles)(UserManagement);
