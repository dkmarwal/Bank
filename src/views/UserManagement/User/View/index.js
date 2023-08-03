import React from "react";
import {
  Box,
  makeStyles,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Link as MLink
} from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/Phone";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import accessRights from "../../../../config/accessRights";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    width: "100%",
  },
  paper: {
    width: "100%",
    paddingTop: "15px",
  },
  container: {
    margin: "12px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    color: "#0b1941",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  userImage: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  userAction: {
    width: "25%",
    display: "flex",
    justifyContent: "flex-end",
  },
  userActionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  heading: {
    color: "#0b1941",
    fontFamily: "Interstate",
    fontSize: "20px",
    letterSpacing: "0.1px",
    lineHeight: "24px",
    fontWeight: "normal",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    height: 100,
    width: 100,
    fontSize: 30,
  },
  name: {
    color: "rgba(0,0,0,0.87)",
    fontFamily: "Interstate",
    fontSize: "20px",
    letterSpacing: "0.15px",
    lineHeight: "24px",
    textAlign: "center",
    paddingRight: "5px",
  },
  roleName: {
    margin: "5px",
    minWidth: "100px",
  },
  smallIcon: {
    width: "20px",
    height: "24px",
    color: "#0b1941",
  },
}));

export default function UserView(props) {
  const classes = useStyles();

  const {
    userInfo,
    canEditAction,
    handleLock,
    handleEdit,
    handleDelete,
    claims,
  } = props;
  const isUserEditAllowed =
    claims && claims.includes(accessRights["USERS_LIST_UPDATE"]);
  const isLockUserAllowed =
    claims && claims.includes(accessRights["USERS_LIST_LOCK"]);
  const isUnlockUserAllowed =
    claims && claims.includes(accessRights["USERS_LIST_UNLOCK"]);
  const isUserDeleteAllowed =
    claims && claims.includes(accessRights["USERS_LIST_DELETE"]);

  return (
    <Box width="768px">
      <Box className={classes.container} alignItems="center">
        <Box className={classes.userHeader}>
          <div style={{ width: "25%" }}></div>
          <div className={classes.userImage}>
            <Box p={2} borderRadius="50%" style={{ float: "right" }}>
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
              </Avatar>
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              <Box display="flex" flexWrap="wrap">
                <Typography variant="body1" className={classes.name}>
                  {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
              </Box>
              <Box justifyContent="center" alignSelf="center" display="flex">
                {!userInfo.isFirstUser && canEditAction && isUserEditAllowed && (
                  <IconButton
                    color="primary"
                    aria-label="Edit User"
                    title="Edit User"
                    component="span"
                    onClick={(event) => handleEdit(event, userInfo)}
                    style={{ padding: "4px" }}
                  >
                    <BorderColorIcon className={classes.smallIcon} />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box pb={1} style={{ textAlign: "center" }}>
              {userInfo.roles &&
                userInfo.roles.map((item, index) => {
                  return (
                    <Chip
                      label={item.roleName}
                      className={classes.roleName}
                      size="small"
                    />
                  );
                })}
            </Box>
            <Box
              width="50px"
              height="2px"
              style={{ backgroundColor: "#999999" }}
            >
              &nbsp;
            </Box>
          </div>
          <div className={classes.userAction}>
            {canEditAction && (
              <Box pl={3}>
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
                        color="secondary"
                        aria-label="Delete User"
                        title="Delete User"
                        component="span"
                        onClick={(event) =>
                          handleDelete(event, userInfo.userId)
                        }
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
            )}
          </div>
        </Box>
      </Box>
      <Box className={classes.container}>
        <Box>
          <Typography variant="body1" className={classes.heading}>
            Contact
          </Typography>
        </Box>
        <Box p={1}>
          <Box display="flex">
            <Box>
              <PersonIcon />
            </Box>
            <Box pl={1} alignSelf="center">
              {userInfo.userName ? userInfo.userName : userInfo.SSOUserId}
            </Box>
          </Box>
          <Box display="flex">
            <Box>
              <EmailOutlinedIcon />
            </Box>
            <Box pl={1} alignSelf="center">
              <MLink color="inherit" href={`mailto:${userInfo.email}`}>
                {userInfo.email}
              </MLink>
            </Box>
          </Box>
          <Box display="flex">
            <Box>
              <PhoneIcon />
            </Box>
            <Box pl={1} alignSelf="center">
              {userInfo.phone &&
                `${userInfo.phoneCountryCode || ""}
                                (${userInfo.phone.substring(
                  0,
                  3
                )})-${userInfo.phone.substring(
                  3,
                  6
                )}-${userInfo.phone.substring(6, 10)}
                                ${userInfo.phoneExt || ""}`}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.container}>
        <Box>
          <Typography variant="body1" className={classes.heading}>
            Roles
          </Typography>
        </Box>
        <Box p={1} display="flex" flexWrap="wrap">
          {userInfo.roles &&
            userInfo.roles.map((item, index) => {
              return (
                <Chip
                  label={item.roleName}
                  className={classes.roleName}
                  size="small"
                />
              );
            })}
        </Box>
      </Box>
      <Box className={classes.container}>
        <Box>
          <Typography variant="body1" className={classes.heading}>
            Clients
          </Typography>
        </Box>
        <Box p={1} display="flex" flexWrap="wrap">
          {userInfo.clients &&
            userInfo.clients.map((item, index) => {
              return (
                <Chip
                  label={item.clientName}
                  className={classes.roleName}
                  size="small"
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
}
