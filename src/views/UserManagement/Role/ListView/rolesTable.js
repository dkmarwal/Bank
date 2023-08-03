import React from "react";
import {
  Grid,
  Box,
  Paper,
  makeStyles,
  Button,
  IconButton,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import CreateIcon from "@material-ui/icons/Create";
import accessRights from "../../../../config/accessRights";
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles(() => ({
  root: {
    margin: "0px",
  },
  container: {
    minHeight: 440,
    margin: "20px 50px 5px",
    width: "100%",
  },
  heading: {
    padding: "10px",
  },
  mediumBtn: {
    width: "130px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: " ",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: " ",
      borderRadius: "28px",
    },
  },
  row: {
    backgroundColor: "#ffffff",
    marginBottom: "15px",
    display: "block",
    height: "75",
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  smallIcon: {
    width: "50px",
  },
  name: {
    width: "100%",
    padding: "22px 45px",
    color: "#0B1941",
    fontSize: "16px",
    letterSpacing: "0.11px",
    lineHeight: "24px",
  },
}));

function RolesTable(props) {
  const classes = useStyles();
  const {
    page,
    rowsPerPage,
    rows,
    columns,
    handleChangePage,
    handleChangeRowsPerPage,
    editData,
    claims,
  } = props;
  let isRoleEditAllowed =
    claims && claims.includes(accessRights["USERS_ROLES_EDIT"]);
  let isAddRoleAllowed =
    claims && claims.includes(accessRights["USERS_ROLES_ADD"]);

  return (
    <Grid container xs={12} className={classes.root}>
      <Grid container item xs={12} md={12} justify="flex-end">
        {isAddRoleAllowed && (
          <Box mt={-3} mr={3}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.mediumBtn}
              startIcon={<AddOutlinedIcon />}
              onClick={() => editData("add", "", "", "1", true)}
            >
              ADD ROLE
            </Button>
          </Box>
        )}
      </Grid>
      <Grid container item xs={12} md={12} className={classes.container}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {                  
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      className={classes.row}
                    >
                      <TableCell className={classes.name}>
                        {row.roleName}
                      </TableCell>
                      <TableCell align="right" style={{ padding: 0 }}>
                        {isRoleEditAllowed && (
                          <IconButton
                            color="primary"
                            aria-label= {row.isCustom === 0 ? "View Role" : "Edit Role"}
                            title= {row.isCustom === 0 ? "View Role" : "Edit Role"}
                            component="span"
                            onClick={() =>
                              editData(
                                row.roleId,
                                row.roleName,
                                row.description,
                                row.isCustom,
                                false
                              )
                            }
                          >
                            {row.isCustom === 0 
                              ? <VisibilityIcon className={classes.smallIcon} />
                              : <CreateIcon className={classes.smallIcon} />
                            }
                            
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          style={{ width: "100%" }}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
}

export default RolesTable;
