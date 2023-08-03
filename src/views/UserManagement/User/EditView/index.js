import React from "react";
import {
  Box,
  makeStyles,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  ListItem
} from "@material-ui/core";

import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import TextField from "~/components/Forms/TextField";
import Phone from "~/components/TextBox/Phone";
import accessRights from "~/config/accessRights";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    display: "block",
    width: "768px",
  },
  paper: {
    width: "100%",
    paddingTop: "15px",
  },
  container: {
    margin: "4px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  heading: {
    color: "#999999",
    fontFamily: "Interstate",
    fontSize: "16px",
    letterSpacing: "0.1px",
    lineHeight: "24px",
    textTransform: "uppercase",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    height: "124px",
    width: "124px",
    backgroundColor: "#E6E6E6",
    color: "#7F7F7F",
  },
  name: {
    height: "24px",
    color: "rgba(0,0,0,0.87)",
    fontFamily: "Interstate",
    fontSize: "20px",
    letterSpacing: "0.15px",
    lineHeight: "24px",
    textAlign: "center",
    paddingRight: "5px",
  },
  roleName: {
    marginRight: "5px",
    minWidth: "100px",
    fontSize: 14,
    color: "#0b1941",
  },
  smallIcon: {
    width: "20px",
    height: "24px",
    color: "#F0582A",
  },
  textField: {
    width: "200px",
  },
  hide: {
    display: "none",
  },
  rolesChip:{
    height:'auto',
    minHeight:'24px',
    margin:'2px',
    fontSize:'14px',
    wordBreak:'break-all',
    '& .MuiChip-label':{
      whiteSpace:'normal',
      paddingTop: '4px',
      paddingBottom:'4px'
    }
  },
  menuItemLongText:{
    whiteSpace:'normal',
    wordBreak:'break-all',
    maxWidth:400
  }
}));

export default function UserEdit(props) {
  const classes = useStyles();

  const {
    userInfo,
    canEditAction,
    roleList,
    clientList,
    handleChange,
    handleSubmit,
    handleCancel,
    handleLock,
    handleDelete,
    validation,
    updateProgress,
    claims,
  } = props;

  const isLockUserAllowed =
    claims && claims.includes(accessRights["USERS_LIST_LOCK"]);
  const isUnlockUserAllowed =
    claims && claims.includes(accessRights["USERS_LIST_UNLOCK"]);
  const isUserDeleteAllowed =
    claims && claims.includes(accessRights["USERS_LIST_DELETE"]);

  const roleIds = userInfo && userInfo.roles.map((item) => item.roleId);
  const clientIds = userInfo && userInfo.clients.map((item) => item.clientId);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const handleShow = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleShowClient = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

    const tooltipObj = {
        title: "New password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        arrow: true,
        placement: "top-end",
    }
  return (
    <Box className={classes.root}>
      <Box textAlign="center" width={1} pt={1} pb={3} position="relative">
        <Box borderRadius="50%" display="flex" justifyContent="center">
          <input type="email" name="userName" style={{ display: "none" }} />
          <input
            type="password"
            name="password"
            autocomplete="new-password"
            style={{ display: "none" }}
          />
          <Avatar
            alt="user pic"
            src="/static/images/avatar/1.jpg"
            className={classes.large}
          >
            {userInfo &&
              userInfo.displayName &&
              userInfo.displayName
                .match(/(\b\S)?/g)
                .join("")
                .match(/(^\S|\S$)?/g)
                .join("")
                .toUpperCase()}
          </Avatar>{" "}
        </Box>
        <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              pt={2}
              pb={1}
            >
              <Box display="flex" flexWrap="wrap">
                <Typography variant="body1" className={classes.name}>
                  {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
              </Box>
        </Box>
        <Box pb={1} style={{ textAlign: "center" }}>
              {userInfo.roles &&
                userInfo.roles.map((item, index) => {
                  return (
                    <Chip
                      label={item.roleName}
                      size="small"
                      className={classes.rolesChip}
                    />
                  );
                })}
            </Box>
        <Box width={1} mb={3} mt={1} display="flex" justifyContent="center">
          <Box width="50px" height="2px" style={{ backgroundColor: "#999999" }}>
            &nbsp;
          </Box>
        </Box>

        {canEditAction && (
          <Box pl={3} position="absolute" top={0} right={0}>
            <Box p={1}>
              <Box display="flex">
                <Box>
                  {userInfo.isLocked ? (
                  <span>
                    {isUnlockUserAllowed && (
                        <IconButton
                          color="primary"
                          aria-label="Unlock User account"
                          title="Unlock User account"
                          component="span"
                          onClick={(event) => handleLock(event, userInfo)}
                          style={{ padding: "4px" }}
                        >
                          <LockOpenIcon color="primary" />
                        </IconButton>
                        )}
                      </span>
                  ) : (
                     <span>
                        {isLockUserAllowed && (
                        <IconButton
                          color="primary"
                          aria-label="Lock User account"
                          title="Lock User account"
                          component="span"
                          onClick={(event) => handleLock(event, userInfo)}
                          style={{ padding: "4px" }}
                        >
                          <LockIcon color="primary" />
                        </IconButton>
                      )}
                      </span>
                    )}
                </Box>
                <Box pl={1} alignSelf="center">
                  <Typography variant="h6" color="primary">
                    {userInfo.isLocked ? (
                        <span>{isUnlockUserAllowed && "Unlock User"}</span>
                      ) : (
                        <span>{isLockUserAllowed && "Lock User"}</span>
                      )}
                  </Typography>
                </Box>
              </Box>
              {isUserDeleteAllowed && (
              <Box display="flex">
                <Box>
                  <IconButton
                    color="primary"
                    aria-label="Delete User"
                    title="Delete User"
                    component="span"
                    onClick={(event) => handleDelete(event, userInfo.userId)}
                    style={{ padding: "4px" }}
                  >
                    <DeleteIcon size="small" color="primary" />
                  </IconButton>
                </Box>
                <Box pl={1} alignSelf="center">
                  <Typography variant="h6" color="primary">
                    Delete User
                  </Typography>
                </Box>
              </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box display="block" p={1.5}>
        <Box color="primary.main" fontWeight={400} fontSize={20}>
          Contact
        </Box>
        <Box my={2} display="flex" width={1}>
          <Grid item xs={9} container spacing={3}>
            <Grid item sm={2} xs={2}>
              <TextField
                select
                required
                fullWidth={true}
                error={validation && validation.title}
                helperText={validation && validation.title}
                autoComplete="off"
                name="title"
                value={(userInfo && userInfo.title) || ""}
                label="Prefix"
                placeholder=""
                onChange={(event) => handleChange("title", event)}
                variant="outlined"
                dir="horizontal"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                className={"prefixLegend"}
              >
                <MenuItem value=" ">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Mr">Mr.</MenuItem>
                <MenuItem value="Mrs">Mrs.</MenuItem>
                <MenuItem value="Ms">Ms.</MenuItem>
              </TextField>
            </Grid>
            <Grid xs={5} item>
              <TextField
                size="small"
                name={"firstName"}
                id={"firstName"}
                label={"First Name"}
                type="text"
                value={(userInfo && userInfo.firstName) || ""}
                required
                onChange={(event) => handleChange("firstName", event)}
                error={validation.firstName}
                helperText={validation.firstName}
                autoComplete="off"
                autoFocus={false}
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
            <Grid xs={5} item>
              <TextField
                size="small"
                name={"lastName"}
                id={"lastName"}
                label={"Last Name"}
                type="text"
                autoComplete="off"
                autoFocus={false}
                value={(userInfo && userInfo.lastName) || ""}
                required
                onChange={(event) => handleChange("lastName", event)}
                error={validation.lastName}
                helperText={validation.lastName}
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mb={3} display="flex" width={1}>
          <Grid item xs={9} container spacing={3}>
            <Grid item xs={12}>
                  <input
                    type="text"
                    name="userName"
                    style={{ display: "none" }}
                  />
                  <input
                    type="password"
                    name="password"
                    autocomplete="new-password"
                    style={{ display: "none" }}
                  />
              {userInfo && userInfo.isSSO === 0 &&<TextField
                size="small"
                name={"userName"}
                id={"userName"}
                disabled={userInfo && userInfo.isSSO === 1 ? true : false}
                label={"User Name"}
                type="text"
                autoFocus={false}
                autoComplete="off"
                value={(userInfo && userInfo.userName) || ""}
                required
                onChange={(event) => handleChange("userName", event)}
                error={validation.userName}
                helperText={validation.userName}
                inputProps={{
                  maxLength: 50,
                }}
              />
              }
              {userInfo && userInfo.isSSO === 1 && (
              <TextField
                size="small"
                name={"SSOUserId"}
                //disabled={true}
                id={"SSOUserId"}
                label={"SSO-Id"}
                variant="outlined"
                type="text"
                autoFocus={false}
                autoComplete="off"
                value={(userInfo && userInfo.SSOUserId) || ""}
                required
                error={validation.SSOUserId}
                helperText={validation.SSOUserId}
                onChange={(event) => handleChange("SSOUserId", event)}
                inputProps={{
                  maxLength: 20,
                }}
                style={{ width: "100%", marginTop: "16px" }}
              />
            )}
            </Grid>
          </Grid>
        </Box>
        <Box mb={3} display="flex" width={1}>
          <Grid item xs={9} container spacing={3}>
            <Grid item xs={12}>
              <TextField
                size="small"
                name={"email"}
                id={"email"}
                label={"Email"}
                type="text"
                autoFocus={false}
                autoComplete="off"
                value={(userInfo && userInfo.email) || ""}
                required
                onChange={(event) => handleChange("email", event)}
                error={validation.email}
                helperText={validation.email}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mb={2} display="flex" width={1}>
          <Grid item xs={9} container spacing={3}>
            <Grid item xs={12}>
              {" "}
              <Phone
                required
                size="small"
                error={validation.phone}
                helperText={validation.phone}
                id="phone"
                name="phone"
                ext={(userInfo && userInfo.phoneExt) || ""}
                value={(userInfo && userInfo.phone) || ""}
                ccode={(userInfo && userInfo.phoneCountryCode) || ""}
                prefixCcode="+1"
                onChange={(event) => handleChange("phone", event)}
              />
            </Grid>
          </Grid>
        </Box>

        {userInfo && userInfo.isSSO === 0 && ( <Box mb={3} display="flex" width={1}>
          <Grid item xs={9} container spacing={3}>
            <Grid item xs={6}>
              {" "}
              <TextField
                required
                size="small"
                error={validation.password}
                disabled={userInfo && userInfo.isSSO === 1 ? true : false}
                autoFocus={false}
                autoComplete="off"
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onDrag={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                label={"Password"}
                value={(userInfo && userInfo.newPassword) || ""}
                name="newPassword"
                type="password"
                tooltipProps={tooltipObj}
                onChange={(event) => handleChange("newPassword", event)}
              />
            </Grid>
            <Grid item xs={6}>
              {" "}
              <TextField
                required
                size="small"
                error={validation.confirmPassword}
                helperText={validation.confirmPassword}
                disabled={userInfo && userInfo.isSSO === 1 ? true : false}
                autoFocus={false}
                autoComplete="off"
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onDrag={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                label={"Confirm Password"}
                value={(userInfo && userInfo.confirmPassword) || ""}
                name="confirmPassword"
                type="password"
                onChange={(event) => handleChange("confirmPassword", event)}
              />
            </Grid>
          </Grid>
        </Box>)}

        <Box display="flex" width={1}>
          <Grid item xs={12}>
            <Typography
              variant="body2"
              style={{ fontSize: "0.75rem", paddingLeft: "14px" }}
              color="error"
            >
              {validation.password}
            </Typography>
          </Grid>
        </Box>
        <Box className={classes.container}>
        <Box color="primary.main" fontWeight={400} fontSize={20} paddingBottom={1.5}>
          Roles
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="flex-start"
          alignItems="center"
        >
          {userInfo &&
            userInfo.roles.map((item, index) => {
              return (
                <Chip
                  label={item.roleName}
                  className={classes.rolesChip}
                  size="small"
                  onDelete={(event) =>
                    handleChange("removeRoleId", event, item)
                  }
                />
              );
            })}
          
          <IconButton
            color="primary"
            component="span"
            onClick={(event) => handleShow(event)}
            style={{ padding: "0px" }}
          >
            <AddIcon color="primary" />
          </IconButton>
          {validation.roleId && (
            <Typography
              variant="body2"
              color="error"
              style={{ fontSize: "0.75rem", paddingLeft: "22px" }}
            >
              {validation.roleId}
            </Typography>
          )}
          <Menu
            id="roleId"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {roleList ? (
              roleList.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}
                className={classes.menuItemLongText}
                 onClick={(event) =>
                      handleChange("roleId", event, {
                        roleId: role.roleId,
                        roleName: role.roleName,
                      })
                 }
                 >
                  <Checkbox
                    checked={
                      roleIds.length > 0 && roleIds.indexOf(role.roleId) > -1
                    }
                  />
                  <ListItemText primary={role.roleName} />
                </MenuItem>
              ))
            ) : (
              <Box
                width="100px"
                display="flex"
                mt={1.875}
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress color="primary" />
              </Box>
            )}
          </Menu>
        </Box>
        </Box>
        
        <Box className={classes.container}>
        <Box color="primary.main" fontWeight={400} fontSize={20} paddingBottom={1.5}>
          Clients
        </Box>
        <Box display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="center">
          {userInfo &&
            userInfo.clients.map((item, index) => {
              return (
                <Chip
                  label={item.clientName}
                  className={classes.rolesChip}
                  size="small"
                  onDelete={(event) =>
                    handleChange("removeClientId", event, item)
                  }
                />
              );
            })}
          {validation.clientId && (
            <Typography
              variant="body1"
              color="error"
              style={{ fontSize: "0.75rem", paddingLeft: "22px" }}
            >
              {validation.clientId}
            </Typography>
          )}
          <IconButton
            color="primary"
            component="span"
            onClick={(event) => handleShowClient(event)}
            style={{ padding: "0px", position:"relative", right:"0px", top:"0px"}}
          >
            <AddIcon color="primary" />
          </IconButton>
          {Boolean(anchorE2) && <Menu
            id="clientId"
            anchorEl={anchorE2}
            keepMounted
            open={Boolean(anchorE2)}
            onClose={handleClose}
          >
            {clientList ? (
              clientList.map((client) => (
                <ListItem key={client.clientId} value={client.clientId}
                className={classes.menuItemLongText}
                >
                  <Checkbox
                    checked={
                      clientIds.length > 0 &&
                      clientIds.indexOf(client.clientId) > -1
                    }
                    onChange={(event) =>
                      handleChange("clientId", event, {
                        clientId: client.clientId,
                        clientName: client.clientName,
                        appType: client.appType,
                      })
                    }
                  />
                  {client.clientName}
                </ListItem>
              ))
            ) : (
              <Box
                width="100px"
                display="flex"
                mt={1.875}
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress color="primary" />
              </Box>
            )}
          </Menu>}
        </Box>
        </Box>
        
      </Box>

      <Box py={2} display="flex" justifyContent="center">
        <Box p={1}>
          <Button
            variant="outlined"
            style={{ marginLeft: "10px" }}
            color="primary"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
        </Box>
        <Box p={1}>
          {updateProgress ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              style={{ color: "white" }}
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
