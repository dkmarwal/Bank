import {
  Box,
  Card,
  Grid,
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  withStyles,
  Button,
  CircularProgress,
  Chip,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import {
  fetchOnBoardedClients,
  fetchClientsFilterChips,
  fetchClientDetails,
  fetchAppType
} from "~/redux/helpers/clients";
import { getClientPaymentTypes } from "~/redux/actions/payments";
import {
  fetchB2CIndustryGroupList,
  fetchB2CPaymentMethods,
  fetchAllPaymentMethods,
} from "~/redux/helpers/B2C/clientProfileSetup";
import AddIcon from "@material-ui/icons/Add";
import styles from "./styles";
import "react-notifications/lib/notifications.css";

import Notification from "~/components/Notification";
import { sendActivationCode } from "~/redux/helpers/ConfigureClientPortal";
import ClientDetails from "./clientDetails";
import B2CClientDetails from "./clientDetails/B2C/";
import { CustomDialog } from "~/components/Dialogs/index.js";
import { AlertDialog } from "~/components/Dialogs";
import accessRights from "~/config/accessRights";
import { fetchCompanyData } from "~/redux/helpers/userProfile";
import Tooltip from "@material-ui/core/Tooltip";
import "./styles.css";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import clsx from "clsx";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import SearchIcon from "@material-ui/icons/Search";
import { updateOnboardingCLient } from "~/redux/actions/clients";
import { SideDialog } from "../../components/Dialogs";
import DashboardDateFilter from "../../modules/DashboardDateFilter";
import moment from "moment";
import { EntityType } from "~/config/entityTypes";
import _ from "lodash";
import { paymentMethods } from '~/config/paymentMethods';

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:selected": {
      backgroundColor: theme.palette.secondary.main,
    },
    padding: "2px 16px",
    color: "#4C4C4C",
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  },
}))(ToggleButtonGroup);

class Clients extends Component {

  state = {
    message: "",
    filterActive: false,
    alertFlag: false,
    rowsPerPage: 4,
    objectPerPage: 12,
    pageNumber: 1,
    filterChips: [],
    selectedVendorId: "",
    selectedChip: -1,
    clients: [],
    selectedClient: {},
    searchText: "",
    viewGrid: false,
    showClientPortal: false,
    showClientModal: false,
    clientName: "",
    offset: 0,
    limit: 10,
    totalCount: 0,
    isFetching: false,
    appType: EntityType.ALL,
    anchorEl: null,
    sortOrder: "asc",
    industryTypes: [],
    selectedStatusFilter: false,
    selectedPaymentFilter: false,
    selectedIndustryFilter: false,
    filters: [],
    B2BPaymentMethods: [],
    B2CPaymentMethods: [],
    allPaymentMethods: [],
    enableDateFilter: false,
    selectedCurrentDateFilter: 0,
    dateFilters: [
      {
        label: "All time",
        key: 0,
      },
      {
        label: "Previous Month",
        key: 1,
      },
      {
        label: "Previous Quarter",
        key: 2,
      },
      {
        label: "Previous Year",
        key: 3,
      },
      {
        label: "Last 7 days",
        key: 4,
      },
      {
        label: "Last 30 Days",
        key: 5,
      },
      {
        label: "Custom",
        key: 6,
      },
    ],
    selectedDateFilters: {
      year: undefined,
      month: undefined,
      quarter: "",
      lastDays: undefined,
      fromDate: undefined,
      toDate: undefined,
    },
    selectedFilter: 1,
    alertType: "",
    alertMessage: "",
    showClientFilterToggle: false
  };

  componentDidMount() {
    this.getListData();
    this.getFilterList();
    this.getB2CIndustryGroupList();

    this.getAllPaymentMethods(); 
    this.getB2CPaymentMethods();
    if(!this.props?.user?.isPayeeChoicePortal) {
      this.getB2BPaymentMethods();
  	}

    this.getAppType();
    if (
      this.props.location &&
      this.props.location._state &&
      this.props.location._state.message &&
      this.props.location._state.type
    ) {
      this.setState({
        alertType:
          this.props.location._state.type === "success" ? "success" : "error",
        alertMessage:
          this.props.location._state.message ||
          (this.props.location._state.type === "success"
            ? "Saved !!"
            : "Error !!"),
      });
    }
  }

  getAppType = () => {
	  const {isPayeeChoicePortal}  = this.props.user;
    fetchAppType().then((response) => {
      const { error, data } = response;
      if (error){
        return false;
      }
      else {
        let val = data.indexOf(EntityType.B2B) > -1 && data.indexOf(EntityType.B2C) > -1;
        this.setState({ showClientFilterToggle: val, appType: (isPayeeChoicePortal? EntityType.B2C: EntityType.ALL) });
      }
    })
  }

  getAllPaymentMethods = () => {
    fetchAllPaymentMethods().then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({
          allPaymentMethods: response?.data?.rows
            ? response.data.rows.map((method) => {
              return {
                ...method,
                selected: false,
              };
            })
            : this.state.allPaymentMethods,
        });
      }
    });
  };

  getB2BPaymentMethods = () => {
    this.props.dispatch(getClientPaymentTypes()).then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({
          B2BPaymentMethods: response.rows
            ? response.rows.map((method) => {
              return {
                ...method,
                selected: false,
              };
            })
            : this.state.B2BPaymentMethods,
        });
      }
    });
  };

  getB2CPaymentMethods = () => {
	const {isPayeeChoicePortal} = this.props?.user;
    fetchB2CPaymentMethods().then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({
          B2CPaymentMethods: response?.data?.rows
            ? response.data.rows.filter(method => {
				if(isPayeeChoicePortal ) {
          return !method.parentId
				}
				return true
			}).map((method) => {
              return {
                ...method,
                selected: false,
              };
            })
            : this.state.B2CPaymentMethods,
        });
      }
    });
  };

  getB2CIndustryGroupList = () => {
    fetchB2CIndustryGroupList().then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({
          industryTypes: response.data.rows
            ? response.data.rows.map((industry) => {
              return {
                ...industry,
                selected: false,
              };
            })
            : this.state.industryTypes,
        });
      }
    });
  };

  setDialogMessage(message) {
    this.setState({ message: message, alertFlag: true });
  }

  hideDialogMessage() {
    this.setState({ message: "", alertFlag: false });
  }

  getClientDetails(client) {
    this.props.dispatch(
      updateOnboardingCLient({
        selectedEntityType: client.appTypeName,
      })
    );
    const clientDetails =
      client.status === "Inprogress" ? fetchCompanyData : fetchClientDetails;
    this.setState({ selectedClient: {} }, () => {
      clientDetails({ clientId: client.clientId }).then((response) => {
        if (response.error || _.isEmpty(response.data)) {
          this.setDialogMessage(response.message);
          return false;
        }
        this.setState({
          selectedClient:
            client.status === "Inprogress"
              ? { ...response.data.rows[0], status: "Inprogress" }
              : { ...response.data, status: client.status },
          showClientModal: true,
        });
      });
    });
  }

  getClientCircleName(name) {
    let newName = "";
    name.includes(" ")
      ? (newName =
        name &&
        `${name.split(" ")[0][0]}${name.split(" ")[1][0] || ""}`.toUpperCase())
      : (newName = name && `${name[0]}${name[1]}`.toUpperCase());
    return newName;
  }

  getFilterList() {
    fetchClientsFilterChips().then((response) => {
      if (response.error) {
        this.setDialogMessage(response.message);
        return false;
      } else {
        this.setState({
          filterChips: response.data.map((status) => {
            return {
              ...status,
              selected: false,
            };
          }),
        });
      }
    });
  }

  searchData(e) {
    const { viewGrid } = this.state;
    const limit = viewGrid ? 9 : 10;
    this.setState(
      {
        searchText: e.target.value,
        clientName: e.target.value,
        pageNumber: 1,
        offset: 0,
        limit: limit,
        // filter: selectedChip
      },
      () => this.getListData()
    );
  }

  getListData() {
    
    const {
      offset,
      clientName,
      viewGrid,
      appType,
      sortOrder,
      filters,
      selectedDateFilters,
      selectedVendorId,
    } = this.state;

    const filterLength = filters.length;
    const groupId = filterLength
      ? filters
        .filter((item) => item.type === "industryType")
        .map((item) => item.key)
      : [];
    const paymentCode = filterLength
      ? filters
        .filter((item) => item.type === "paymentMethod")
        .map((item) => item.paymentCode)
      : [];
    let filter = filterLength
      ? filters.filter((item) => item.type === "status").map((item) => item.key)
      : [];
    filter = filter.length < 1 || filter.length === 2 ? -1 : filter[0];

    const limit = viewGrid ? 9 : 10;
    const { portalProfileId } = this.props.user.info;
    const payerTypeId = [1];
   
    const payload = {
      portalProfileId:this.props?.user?.isPayeeChoicePortal ? undefined:portalProfileId ,
      filter,
      limit,
      offset,
      clientName,
      appType,
      sortOrder,
      groupId,
      paymentCode,
      payerTypeId,
      fromDate: selectedDateFilters["fromDate"]
        ? this.getFormattedDate(selectedDateFilters["fromDate"])
        : undefined,
      toDate: selectedDateFilters["toDate"]
        ? this.getFormattedDate(selectedDateFilters["toDate"])
        : undefined,
    };
    this.setState({ isFetching: true }, () => {
      fetchOnBoardedClients(payload).then((response) => {
        if (response.error) {
          this.setDialogMessage(response.message);
          this.setState({ isFetching: false });
          return false;
        }

        // Checking if selectedVendorId exist in new clients list
        const selectedVendorIndex = response.data.clients.findIndex(
          (item) => item.clientId === parseInt(selectedVendorId)
        );
        this.setState({
          clients: response.data.clients,
          totalCount: response.data.totalCount,
          selectedVendorId: selectedVendorIndex > -1 ? selectedVendorId : null,
          isFetching: false,
        });
      });
    });
  }

  handlePageChange(pageNumber) {
    const { viewGrid, searchText } = this.state;
    const limit = viewGrid ? 9 : 10;
    this.setState(
      {
        pageNumber,
        offset: (pageNumber - 1) * limit,
        limit: limit,
        clientName: searchText,
      },
      () => this.getListData()
    );
  }

  onClickClientDetails(e, clientId) {
    this.props.history.push(`/clients/clientDetail/${clientId}`);
  }

  handleChip(key) {
    const { viewGrid, searchText } = this.state;
    const limit = viewGrid === true ? 9 : 10;
    this.setState(
      {
        selectedChip: key,
        clientName: searchText,
        pageNumber: 1,
        offset: 0,
        limit: limit,
        selectedVendorId: null,
        // filter: key,
      },
      () => this.getListData()
    );
  }

  gotoPermissionPage = () => {
    const { selectedVendorId, clients } = this.state;
    const vendorIndex = clients.findIndex(
      (item) => item.clientId === parseInt(selectedVendorId)
    );
    const vendorAppType =
      vendorIndex > -1 ? clients[vendorIndex].appType : EntityType.B2B;

    const userId = selectedVendorId;
    this.props.history.push({
      pathname:
        vendorAppType === EntityType.B2C
          ? `/clients/b2c/clientPermissions/${userId}`
          : `/clients/clientPermissions/${userId}`,
      search: "?update=true",
    });
  };

  gotoOnboardclient = () => {
    const {isPayeeChoicePortal} = this.props.user
    if(isPayeeChoicePortal ){
      sessionStorage.setItem("selectedEntityType", "B2C");
      this.props.dispatch(
        updateOnboardingCLient({
          selectedEntityType:"B2C",
          currentOnboardingStep: 1,
        })
      );
      this.props.history.push({
        pathname: `/clientOnboard/OnboardType`,
      });
    } else {
      this.props.history.push({
        pathname: `/clientOnboard/EntityType`,
      });
    }

  };

  async resendActivationCode() {
    const { selectedVendorId } = this.state;
    const userId = selectedVendorId;
    const data = {
      clientId: userId,
      isVerified: 0,
    };
    try {
      const resp = await sendActivationCode(data);
      if (resp) {
        const { error = true} = resp.data || {};
        if (error) {
          this.setState({
            alertType: "error",
            alertMessage: "Resend Activation Code failed",
          });
        } else {
          this.setState({
            alertType: "success",
            alertMessage: "Resend Activation Code sent successfully",
          });
        }
      } else {
        this.setState({
          alertType: "error",
          alertMessage: "Resend Activation Code failed",
        });
      }
    } catch (error) {
      this.setState({
        alertType: "error",
        alertMessage: "Resend Activation Code failed",
      });
    }
  }

  hideAlertMessage = () => {
    this.setState({ alertMessage: null, alertType: null });
  };

  showClientData() {
    this.setState({ showClientPortal: true });
  }

  handleEntityChange = (event, newAppType) => {
    const {
      allPaymentMethods,
      B2BPaymentMethods,
      B2CPaymentMethods,
      filters,
      viewGrid,
    } = this.state;
    const limit = viewGrid ? 9 : 10;
    this.setState(
      {
        appType: newAppType,
        allPaymentMethods: allPaymentMethods.map((method) => {
          return {
            ...method,
            selected: false,
          };
        }),
        B2BPaymentMethods: B2BPaymentMethods.map((method) => {
          return {
            ...method,
            selected: false,
          };
        }),
        B2CPaymentMethods: B2CPaymentMethods.map((method) => {
          return {
            ...method,
            selected: false,
          };
        }),
        filters: filters.length
          ? filters.filter((item) => item.type !== "paymentMethod")
          : [],
        pageNumber: 1,
        offset: 0,
        limit: limit,
      },
      () => {
        this.getListData();
      }
    );
  };
  handleClick = (name) => {
    switch (name) {
      case "status": {
        this.setState({
          ...this.state,
          selectedStatusFilter: !this.state.selectedStatusFilter,
          selectedPaymentFilter: false,
          selectedIndustryFilter: false,
        });
        break;
      }
      case "industryType": {
        this.setState({
          ...this.state,
          selectedIndustryFilter: !this.state.selectedIndustryFilter,
          selectedStatusFilter: false,
          selectedPaymentFilter: false,
        });
        break;
      }
      case "paymentMethod": {
        this.setState({
          ...this.state,
          selectedPaymentFilter: !this.state.selectedPaymentFilter,
          selectedIndustryFilter: false,
          selectedStatusFilter: false,
        });
        break;
      }
      default:
    }
  };

  handleClose = () => {
    this.setState({
      ...this.state,
      anchorEl: null,
    });
  };

  handleSortClick = () => {
    this.setState(
      (state) => {
        return {
          ...this.state,
          sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
        };
      },
      () => {
        this.getListData();
      }
    );
  };

  handleCheckBox = (item) => {
    const { viewGrid } = this.state;
    const limit = viewGrid ? 9 : 10;
    switch (item.type) {
      case "status": {
        const { filterChips, filters } = this.state;

        let cloned = [...filterChips];
        const index = filterChips.findIndex(
          (status) => status.filterKey === item.key
        );
        cloned[index].selected = !cloned[index].selected;
        const filterIndex = filters.findIndex(
          (filter) => item.key === filter.key && item.type === filter.type
        );

        this.setState(
          {
            ...this.state,
            filterChips: cloned,
            filters: cloned[index].selected
              ? [...filters, ...[item]]
              : [
                ...filters.slice(0, filterIndex),
                ...filters.slice(filterIndex + 1, filters.length),
              ],
            pageNumber: 1,
            offset: 0,
            limit: limit,
          },
          () => {
            this.getListData();
          }
        );
        break;
      }
      case "industryType": {
        const { industryTypes, filters } = this.state;

        let cloned = [...industryTypes];
        const index = industryTypes.findIndex(
          (industry) => industry.groupId === item.key
        );
        cloned[index].selected = !cloned[index].selected;
        const filterIndex = filters.findIndex(
          (filter) => item.key === filter.key && item.type === filter.type
        );

        this.setState(
          {
            ...this.state,
            industryTypes: cloned,
            filters: cloned[index].selected
              ? [...filters, ...[item]]
              : [
                ...filters.slice(0, filterIndex),
                ...filters.slice(filterIndex + 1, filters.length),
              ],
            pageNumber: 1,
            offset: 0,
            limit: limit,
          },
          () => {
            this.getListData();
          }
        );
        break;
      }
      case "paymentMethod": {
        const {
          allPaymentMethods,
          filters,
          appType,
          B2BPaymentMethods,
          B2CPaymentMethods,
        } = this.state;
        let cloned = [...allPaymentMethods];
        const index = allPaymentMethods.findIndex(
          (method) => method.paymentCode === item.paymentCode
        ) ;
		if(index !==-1){
			cloned[index].selected = !cloned[index].selected;
		}

        const filterIndex = filters.findIndex(
          (filter) =>
            item.type === filter.type && item.paymentCode === filter.paymentCode
        );

        this.setState(
          {
            ...this.state,
            allPaymentMethods: cloned,
            filters: index !==-1 && cloned[index].selected
              ? [...filters, ...[item]]
              : [
                ...filters.slice(0, filterIndex),
                ...filters.slice(filterIndex + 1, filters.length),
              ],

            B2BPaymentMethods:
              appType === 1
                ? B2BPaymentMethods.map((method) => {
                  return method.paymentCode === item.paymentCode
                    ? { ...method, selected: !method.selected }
                    : method;
                })
                : B2BPaymentMethods,
            B2CPaymentMethods:
              appType === 2
                ? B2CPaymentMethods.map((method) => {
                  return method.paymentCode === item.paymentCode
                    ? { ...method, selected: !method.selected }
                    : method;
                })
                : B2CPaymentMethods,
            pageNumber: 1,
            offset: 0,
            limit: limit,
          },
          () => {
            this.getListData();
          }
        );
        break;
      }
      default:
    }
  };

  getFormattedDate = (dateVal) => {
    return dateVal ? moment(dateVal).format("YYYY-MM-DD") : undefined;
  };

  onChangeFilter = (index) => {
    const currentDate = new Date();
    let fromDate = new Date(),
      toDate = new Date();
    switch (index) {
      // All Time
      case 1:
        fromDate = null;
        toDate = null;
        break;

      // Previous Month
      case 2:
        fromDate.setMonth(fromDate.getMonth() - 1);
        toDate.setMonth(toDate.getMonth() - 1);
        fromDate.setDate(1);
        toDate.setFullYear(toDate.getFullYear(), toDate.getMonth() + 1, 0);
        break;

      // Previous Quater
      case 3:
        const quarter = Math.floor(currentDate.getMonth() / 3);
        const quarterStartDate = new Date(
          currentDate.getFullYear(),
          quarter * 3 - 3,
          1
        );
        fromDate = quarterStartDate;
        toDate = new Date(
          quarterStartDate.getFullYear(),
          quarterStartDate.getMonth() + 3,
          0
        );
        break;

      // Previous Year
      case 4:
        fromDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        toDate = new Date(currentDate.getFullYear() - 1, 11, 31);
        break;

      // Last 7 Days
      case 5:
        fromDate.setDate(new Date().getDate() - 7);
        break;

      // Last 30 Days
      case 6:
        fromDate.setDate(new Date().getDate() - 30);
        break;
      default:
    }
    return { fromDate, toDate };
  };

  render() {
    const {
      alertFlag,
      message,
      clients,
      pageNumber,
      filterChips,
      selectedChip,
      viewGrid,
      filterActive,
      showClientModal,
      selectedClient,
      totalCount,
      isFetching,
      limit,
      appType,
      industryTypes,
      selectedIndustryFilter,
      selectedPaymentFilter,
      selectedStatusFilter,
      filters,
      allPaymentMethods,
      B2BPaymentMethods,
      B2CPaymentMethods,
      enableDateFilter,
      selectedDateFilters,
      selectedFilter,
      dateFilters,
      alertMessage,
      alertType,
      showClientFilterToggle
    } = this.state;
    const { classes, permissions } = this.props;

    const count = Math.ceil(Number((totalCount / limit)));
    const claims = permissions.minified;
    const isAddClientsAllowed =
      claims && claims.includes(accessRights["CLIENTS_LIST_ONBOARDING"]);

    return (
      <Grid className={classes.root}>
        <Box my={0} mx={6}>
          <Box my={3} py={1}>
            {isAddClientsAllowed && (
              <Box
                mt={-6}
                mb={2}
                mx={1}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.mainButton}
                  onClick={this.gotoOnboardclient}
                  startIcon={<AddIcon />}
                >
                  ONBOARD A CLIENT
                </Button>
              </Box>
            )}
            <Paper>
              <Box px={3} py={2}>
                <Grid container>
                  <Grid item lg={8} md={8}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={12}
                      className={classes.gridItem}
                    >
                      {showClientFilterToggle && <Box display="flex" mb={2}>
                        <Box
                          bgColor="#fff"
                          border="1px solid #CCCCCC"
                          borderRadius={4}
                        >
                          <StyledToggleButtonGroup
                            size="small"
                            value={appType}
                            exclusive
                            onChange={this.handleEntityChange}
                          >
                            <ToggleButton value={3}>All</ToggleButton>
                            <ToggleButton value={2}>B2C</ToggleButton>
                            <ToggleButton value={1}>B2B</ToggleButton>
                          </StyledToggleButtonGroup>
                        </Box>
                      </Box>}

                    </Grid>
                  </Grid>
                  <Grid item lg={4} sm={4}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={12}
                      justify="flex-end"
                      className={classes.gridItem}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="center"
                      >
                        <IconButton
                          color="primary"
                          aria-label="View"
                          title="View"
                          onClick={() =>
                            this.setState(
                              {
                                viewGrid: !viewGrid,
                              },
                              () => {
                                this.setState(
                                  { pageNumber: 1, offset: 0, limit: this.state.viewGrid ? 9 : 10 },
                                  () => this.getListData()
                                );
                              }
                            )
                          }
                        >
                          <img
                            src={
                              !viewGrid
                                ? require(`~/assets/icons/icon_grid.svg`)
                                : require(`~/assets/icons/b2c-format_list_bulleted@1x.svg`)
                            }
                            alt={!viewGrid ? "View Grid" : "View Table"}
                            width="18"
                            className={classes.imgIcon}
                          />
                        </IconButton>
                        <Box mx={1}>
                          <TextField
                            fullWidth={true}
                            variant="outlined"
                            placeholder="Search payer name.."
                            onChange={this.searchData.bind(this)}
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  sm={7}
                  className={classes.gridItem}
                  alignItems="center"
                >
                  <Box display="flex" mr={3}>
                    <Typography color="textSecondary" variant="body2">
                      {" "}
                      Filters-{" "}
                    </Typography>
                  </Box>
                  <Grid item xs={2}>
                    <Button
                      aria-label="status"
                      onClick={() => this.handleClick("status")}
                      className={clsx(
                        classes.lightColor,
                        selectedStatusFilter && classes.filterSelected,
                        classes.filterButtons
                      )}
                    >
                      <span>Status</span>
                      {!selectedStatusFilter ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowDropUpIcon />
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={() => this.handleClick("industryType")}
                      className={clsx(
                        classes.lightColor,
                        selectedIndustryFilter && classes.filterSelected,
                        classes.filterButtons
                      )}
                    >
                      <span>Type of Industry</span>
                      {!selectedIndustryFilter ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowDropUpIcon />
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={() => this.handleClick("paymentMethod")}
                      className={clsx(
                        classes.lightColor,
                        selectedPaymentFilter && classes.filterSelected,
                        classes.filterButtons
                      )}
                    >
                      <span>Payment Method</span>
                      {!selectedPaymentFilter ? (
                        <ArrowDropDownIcon />
                      ) : (
                        <ArrowDropUpIcon />
                      )}
                    </Button>
                  </Grid>
                </Grid>
                <Box>
                  <Grid container>
                    <Grid item sm={12} style={{ display: "flex", flexWrap: "wrap" }}>
                      {selectedIndustryFilter &&
                        industryTypes &&
                        industryTypes.map((industry) => (
                          <Box key={industry.name}>
                            <Checkbox
                              checked={industry.selected}
                              color="primary"
                              key={industry.groupId}
                              onChange={(event) =>
                                this.handleCheckBox({
                                  type: "industryType",
                                  key: industry.groupId,
                                  name: industry.name,
                                })
                              }
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                            <span>{industry.name}</span>
                          </Box>
                        ))}

                      {selectedStatusFilter &&
                        filterChips &&
                        filterChips
                          .slice(1, filterChips.length)
                          .map((status) => (
                            <Box key={status.roleName}>
                              <Checkbox
                                checked={status.selected}
                                color="primary"
                                key={status.filterKey}
                                onChange={(event) =>
                                  this.handleCheckBox({
                                    type: "status",
                                    key: status.filterKey,
                                    name: status.roleName,
                                  })
                                }
                                icon={<CheckBoxOutlineBlankIcon />}
                                checkedIcon={<CheckBoxIcon />}
                              />
                              <span>{status.roleName}</span>
                            </Box>
                          ))}
                      {selectedPaymentFilter &&
                        appType === 3 &&
                        allPaymentMethods &&
                        allPaymentMethods.map((method) => (
                          <Box key={method.paymentCode}>
                            <Checkbox
                              checked={method.selected}
                              color="primary"
                              onChange={(event) =>
                                this.handleCheckBox({
                                  type: "paymentMethod",
                                  key: method.paymentTypeId,
                                  name: method.description,
                                  paymentCode: method.paymentCode,
                                })
                              }
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                            <span>{method.description}</span>
                          </Box>
                        ))}
                      {selectedPaymentFilter &&
                        appType === 2 &&
                        B2CPaymentMethods &&
                        B2CPaymentMethods.map((method) => (
                          <Box key={method.paymentCode}>
                            <Checkbox
                              checked={method.selected}
                              color="primary"
                              onChange={(event) =>
                                this.handleCheckBox({
                                  type: "paymentMethod",
                                  key: method.paymentTypeId,
                                  name: method.b2cDescription,
                                  paymentCode: method.paymentCode,
                                })
                              }
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                            <span>{method.b2cDescription}</span>
                          </Box>
                        ))}
                      {selectedPaymentFilter &&
                        appType === 1 &&
                        B2BPaymentMethods &&
                        B2BPaymentMethods.map((method) => (
                          <Box key={method.paymentCode}>
                            <Checkbox
                              checked={method.selected}
                              color="primary"
                              onChange={(event) =>
                                this.handleCheckBox({
                                  type: "paymentMethod",
                                  key: method.paymentTypeId,
                                  name: method.description,
                                  paymentCode: method.paymentCode,
                                })
                              }
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                            <span>{method.description}</span>
                          </Box>
                        ))}
                    </Grid>
                    <Grid xs={12} sm={10} p={1}>
                      <Box>
                        {filters.length > 0 &&
                          filters.map((item, index) => {
                            return (
                              <Chip
                                label={item.name}
                                key={`${item.type}_${item.name}`}
                                onDelete={() => {
                                  this.handleCheckBox(item);
                                }}
                                style={{ margin: "2px" }}
                              />
                            );
                          })}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {filterActive && (
                  <Grid
                    container
                    item
                    xs={12}
                    md={12}
                    justify="flex-start"
                    className={classes.gridItem}
                  >
                    <Box
                      my={1.5}
                      display="flex"
                      width="100%"
                      justifyContent="flex-start"
                    >
                      {filterChips &&
                        filterChips.map((chip) => (
                          <Box mx={1}>
                            <Chip
                              color={
                                selectedChip === chip.filterKey ? "primary" : ""
                              }
                              clickable
                              label={`${chip.roleName} (${chip.count})`}
                              onClick={() => this.handleChip(chip.filterKey)}
                            />
                          </Box>
                        ))}
                    </Box>
                  </Grid>
                )}
              </Box>
            </Paper>
          </Box>

          {viewGrid ? (
            <Grid>
              {!isFetching ? (
                <Grid>
                  <Grid container spacing={2}>
                    {clients &&
                      clients.map((client) => (
                        <Grid item xs={12} md={4}>
                          <Card
                            style={{
                              height: "230px",
                              maxHeight: "300px",
                              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                            }}
                          >
                            <Box style={{ float: "right", padding: "4px" }}>
                              <Chip
                                label={client.status === "Inprogress" ? "In Progress": "Onboarded"}
                                style={{
                                  margin: "2px",
                                  fontSize: 12,
                                  backgroundColor:
                                    client.status === "Inprogress"
                                      ? "#FFE0B2"
                                      : "#B2DFFF",
                                }}
                              />
                            </Box>

                            <Box
                              m={2}
                              onClick={(e) => this.getClientDetails(client)}
                            >
                              <div className={classes.cardContent}>
                                <div className={classes.cardTexts}>
                                  <span
                                    className={[classes.profileCircle]}
                                    title={client.clientName[0]}
                                  >
                                    {this.getClientCircleName(
                                      client.clientName
                                        ? client.clientName.trim()
                                        : ""
                                    )}
                                  </span>

                                  <div
                                    className={classes.supplierName}
                                    title={client.clientName || ""}
                                  >
                                    <Typography variant="body2">
                                      {client.clientName || ""}
                                    </Typography>
                                  </div>
                                  <div className={classes.accountNoTitle}>
                                    <Box
                                      fontSize={12}
                                      component="span"
                                      color="text.secondary"
                                    >
                                      Contact:
                                    </Box>
                                    <Box
                                      fontSize={12}
                                      component="span"
                                      fontWeight="fontWeightRegular"
                                    >
                                      {" "}
                                      {client.phoneNumber || ""}
                                    </Box>
                                  </div>
                                  <div className={classes.accountNoTitle}>
                                    <Box
                                      fontSize={12}
                                      component="span"
                                      color="text.secondary"
                                    >
                                      Tax ID:
                                    </Box>
                                    <Box
                                      fontSize={12}
                                      component="span"
                                      fontWeight="fontWeightRegular"
                                    >
                                      {client.taxId || ""}
                                    </Box>
                                  </div>

                                  <Box pb={1}>
                                    <Box
                                      fontSize={12}
                                      fontWeight="fontWeightRegular"
                                    >
                                      {client.industry || ""}
                                    </Box>
                                  </Box>
                                  {!this.props?.user?.isPayeeChoicePortal &&    <div style={{ display: "inline-flex" }}>
                                    {client.appTypeName === "B2C" && (
                                      <Box
                                        mx={0.5}
                                        borderRadius={25}
                                        border="solid 1px #D97934"
                                        px={0.5}
                                        color="#D97934"
                                        textAlign="center"
                                        my={0.5}
                                        width={50}
                                      >
                                        {client.appTypeName}
                                      </Box>
                                    )}
                                    {client.appTypeName === "B2B" && (
                                      <Box
                                        mx={0.5}
                                        borderRadius={25}
                                        border="solid 1px #6094B1"
                                        px={0.5}
                                        color="#6094B1"
                                        textAlign="center"
                                        my={0.5}
                                        width={50}
                                      >
                                        {client.appTypeName}
                                      </Box>
                                    )}
                                  </div>}
                                  {client.payment && (
                                    <Box my={1} className={classes.center}>
                                      <Grid container>
                                        <Grid>
                                          <Box>
                                            <div
                                              style={{
                                                textAlign: "center",
                                              }}
                                            >
                                              {client.payment &&
                                                client.payment.search(paymentMethods.ACH) !==
                                                -1 && (
                                                  <Tooltip title={client.appTypeName === "B2C"
                                                  ? "Bank Deposit (ACH)" 
                                                  : "Bank Account"
                                                }>
                                                    <span
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/ACH_main.svg`)}
                                                        alt="ACH"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(paymentMethods.EFT) !==
                                                -1 && (
                                                  <Tooltip title="EFT">
                                                    <span
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/EFT_main.svg`)}
                                                        alt="ACH"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(
                                                  paymentMethods.Zelle
                                                ) !== -1 && (
                                                  <Tooltip title="Zelle">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/Zelle_main.svg`)}
                                                        alt="Zelle"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(
                                                  paymentMethods.PayPal
                                                ) !== -1 && (
                                                  <Tooltip title="PayPal">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/PayPal_main.svg`)}
                                                        alt="PayPal"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(paymentMethods.CHK) !==
                                                -1 && (
                                                  <Tooltip title="Check">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/CHK_main.svg`)}
                                                        alt="CHK"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(paymentMethods.VirtualCard) !==
                                                -1 && (
                                                  <Tooltip title="Virtual Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/VCA_main.svg`)}
                                                        alt="VCA"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                              {client.payment &&
                                                client.payment.search(
                                                  paymentMethods.PushToCard
                                                ) !== -1 && (
                                                  <Tooltip title="Push To Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/Push_to_Card_main.svg`)}
                                                        alt="PushToCard"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{client.payment &&
                                                client.payment.search(
                                                  paymentMethods.USBankZelle
                                                ) !== -1 && (
                                                  <Tooltip title="Zelle">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                      src={require(`~/assets/icons/USbank/Zelle_main.svg`)}
                                                        alt="Zelle"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{client.payment &&
                                                client.payment.search(
                                                  paymentMethods.USBankRTP
                                                ) !== -1 && (
                                                  <Tooltip title="RTP">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                      src={require(`~/assets/icons/USbank/RTP.svg`)}
                                                        alt="RTP"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{client.payment &&
                                                client.payment.search(
                                                  paymentMethods.USBankDepositToDebitcard
                                                ) !== -1 && (
                                                  <Tooltip title="Deposite to Debit Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                      src={require(`~/assets/icons/USbank/Deposit_to_Card_main.svg`)}
                                                      alt="Deposite to Debit Card"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{client.payment &&
                                                client.payment.search(
                                                  paymentMethods.USBankPrepaidCard
                                                ) !== -1 && (
                                                  <Tooltip title="Prepaid Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                      src={require(`~/assets/icons/USbank/Prepaidcard.svg`)}
                                                      alt="Prepaid Card"
                                                        width="18"
                                                        height="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												
                                            </div>
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  )}
                                </div>
                              </div>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                  <Grid>
                    <Box my={2}>
                      <Paper>
                        <Box py={2} display="flex" justifyContent="flex-end">
                          <Pagination
                            count={count}
                            defaultPage={pageNumber}
                            page={pageNumber}
                            onChange={(e, page) => this.handlePageChange(page)}
                          />
                        </Box>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress color="primary" />
                </Box>
              )}
            </Grid>
          ) : (
            <Grid container item xs={12} md={12} className={classes.gridItem}>
              <Paper className={classes.root} elevation={2}>
                <TableContainer className={classes.container}>
                  <Table>
                    <TableHead
                      style={{ backgroundColor: "rgba(204,228,255,0.75)" }}
                    >
                      <TableRow>
                        <TableCell
                          padding="checkbox"
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "8",
                            whiteSpace: "nowrap",
                          }}
                        >
                        </TableCell>

                        <TableCell
                          colSpan={2}
                          key={1}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 15px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <Box>
                            <b>Payer Name</b>
                            <IconButton
                              aria-label="more"
                              aria-controls="long-menu"
                              aria-haspopup="true"
                              onClick={this.handleSortClick}
                              style={{
                                borderRadius: "4px",
                                height: "25px",
                                width: "35px",
                                margin: "0px 5px",
                                padding: "0px",
                              }}
                              className={classes.smallBtn}
                            >
                              <ImportExportIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell
                          key={2}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <b>Tax ID</b>
                        </TableCell>
                        <TableCell
                          key={3}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          {" "}
                          <b>Contact</b>
                        </TableCell>
                        <TableCell
                          key={4}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <b>Type of Industry</b>
                        </TableCell>
                     {!this.props?.user?.isPayeeChoicePortal &&
                      <TableCell
                          key={5}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <b>Business Model</b>
                        </TableCell>}
                        <TableCell
                          key={6}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <b> Payment Methods</b>
                        </TableCell>
                        <TableCell
                          key={7}
                          align="left"
                          className={classes.supTable}
                          style={{
                            padding: "6px 12px 6px 14px",
                            whiteSpace: "nowrap",
                            fontSize: "16px",
                          }}
                        >
                          <b>Status</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {!isFetching ? (
                      <TableBody
                        className="tableBody"
                        style={{ cursor: "pointer" }}
                      >
                        {clients &&
                          clients.map((vendor, indx) => (
                            <TableRow key={indx}>
                              <TableCell
                                padding="checkbox"
                                size="small"
                                style={{ width: "3%", whiteSpace: "nowrap" }}
                              >
                              </TableCell>
                              <TableCell
                                size="small"
                                align="left"
                                style={{ width: "4%", whiteSpace: "nowrap" }}
                                className={classes.textBold}
                                onClick={(e) => this.getClientDetails(vendor)}
                              >
                                <span className={classes.roundBox}>
                                  {vendor &&
                                    vendor.clientName &&
                                    vendor.clientName[0]}
                                </span>
                              </TableCell>
                              <TableCell
                                size="small"
                                align="left"
                                style={{
                                  whiteSpace: "nowrap",
                                  width: "5%",
                                  maxWidth: "12%",
                                }}
                                onClick={(e) => this.getClientDetails(vendor)}
                              >
                                <Box
                                  component="div"
                                  textOverflow="ellipsis"
                                  maxWidth="180px"
                                  width="auto"
                                  title={vendor && vendor.clientName}
                                >
                                  <Typography noWrap={true}>
                                    {vendor && vendor.clientName}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell
                                size="small"
                                style={{ whiteSpace: "nowrap", width: "14%" }}
                                align="left"
                                className={classes.textBold}
                                onClick={(e) => this.getClientDetails(vendor)}
                              >
                                {vendor &&
                                  typeof vendor.taxId !== "object" &&
                                  vendor.taxId}
                              </TableCell>
                              <TableCell
                                size="small"
                                align="left"
                                style={{ whiteSpace: "nowrap", width: "12%" }}
                                className={classes.textBold}
                                onClick={
                                  (e) => {
                                    // this.onClickClientDetails(e, client.ClientID)
                                    this.getClientDetails(vendor);
                                  }
                                  //this.showClientData()
                                }
                              >
                                {vendor && vendor.phoneNumber}
                              </TableCell>
                              <TableCell
                                size="small"
                                style={{ whiteSpace: "nowrap", width: "12%" }}
                                align="left"
                                className={classes.textBold}
                                onClick={(e) => this.getClientDetails(vendor)}
                              >
                                {vendor && vendor.industry}
                              </TableCell>
                              {!this.props?.user?.isPayeeChoicePortal &&  <TableCell
                              size="small"
                              align="left"
                              style={{ whiteSpace: "nowrap", width: "12%" }}
                              onClick={(e) => this.getClientDetails(vendor)}
                              >
                                  <Grid item sm={6}>
                                    {vendor.appTypeName === "B2B" && (
                                      <Box
                                        borderRadius={10}
                                        border="solid 1px #6094B1"
                                        px={3}
                                        color="#6094B1"
                                        textAlign="center"
                                        width='40%'
                                      >
                                        {vendor.appTypeName}
                                      </Box>
                                    )}

                                    {vendor.appTypeName === "B2C" && (
                                      <Box
                                        borderRadius={10}
                                        border="solid 1px #D97934"
                                        px={3}
                                        color="#D97934"
                                        textAlign="center"
                                        width='40%'
                                      >
                                        {vendor.appTypeName}
                                      </Box>
                                    )}
                                  </Grid>
                              </TableCell>}
                              <TableCell
                                size="small"
                                align="left"
                                style={{ whiteSpace: "nowrap", width: "15%" }}
                                onClick={(e) => this.getClientDetails(vendor)}
                              >
                                <Grid container>
                                  <Grid item xs>
                                    {vendor &&
                                      vendor.payment &&
                                      vendor.payment.search(paymentMethods.ACH) !== -1 && (
                                        <Tooltip 
                                          title={vendor.appTypeName === "B2C" 
                                            ? "Bank Deposit (ACH)" 
                                            : "Bank Account"
                                          }
                                        >
                                          <span style={{ margin: "0 5px" }}>
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/ACH_main.svg`)}
                                              alt="ACH"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor &&
                                      vendor.payment &&
                                      vendor.payment.search(paymentMethods.EFT) !== -1 && (
                                        <Tooltip title="EFT">
                                          <span style={{ margin: "0 5px" }}>
                                            {" "}
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/EFT_main.svg`)}
                                              alt="ACH"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor.payment &&
                                      vendor.payment.search(paymentMethods.Zelle) !== -1 && (
                                        <Tooltip title="Zelle">
                                          <span
                                            className={classes.checkedIcon}
                                            style={{ margin: "0 5px" }}
                                          >
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/Zelle_main.svg`)}
                                              alt="Zelle"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor.payment &&
                                      vendor.payment.search(paymentMethods.PayPal) !== -1 && (
                                        <Tooltip title="PayPal">
                                          <span
                                            className={classes.checkedIcon}
                                            style={{ margin: "0 5px" }}
                                          >
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/PayPal_main.svg`)}
                                              alt="PayPal"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor.payment &&
                                      vendor.payment.search(paymentMethods.CHK) !== -1 && (
                                        <Tooltip title="Check">
                                          <span
                                            className={classes.checkedIcon}
                                            style={{ margin: "0 5px" }}
                                          >
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/CHK_main.svg`)}
                                              alt="CHK"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor.payment &&
                                      vendor.payment.search(paymentMethods.VirtualCard) !==
                                      -1 && (
                                        <Tooltip title="Virtual Card">
                                          <span
                                            className={
                                              classes.checkedIcon
                                            }
                                            style={{
                                              margin: "0 5px",
                                            }}
                                          >
                                            <img
                                              className={
                                                classes.checkClass
                                              }
                                              src={require(`~/assets/icons/VCA_main.svg`)}
                                              alt="VCA"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
                                    {vendor.payment &&
                                      vendor.payment.search(paymentMethods.PushToCard) !==
                                      -1 && (
                                        <Tooltip title={vendor.appTypeName === "B2C" 
                                        ? "Instant Pay (P2C)" 
                                        : "Push to Card"
                                      }>
                                          <span
                                            className={classes.checkedIcon}
                                            style={{ margin: "0 5px" }}
                                          >
                                            <img
                                              className={classes.checkClass}
                                              src={require(`~/assets/icons/Push_to_Card_main.svg`)}
                                              alt="PushToCard"
                                              width="18"
                                            />
                                          </span>
                                        </Tooltip>
                                      )}
									  {vendor.payment &&
                                                vendor.payment.search(
                                                  paymentMethods.USBankZelle
                                                ) !== -1 && (
                                                  <Tooltip title="Zelle">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/USbank/Zelle_main.svg`)}
                                                        alt="Zelle"
                                                        width="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{vendor.payment &&
                                                vendor.payment.search(
                                                  paymentMethods.USBankRTP
                                                ) !== -1 && (
                                                  <Tooltip title="RTP">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/USbank/RTP.svg`)}
                                                        alt="RTP"
                                                        width="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{vendor.payment &&
                                                vendor.payment.search(
                                                  paymentMethods.USBankDepositToDebitcard
                                                ) !== -1 && (
                                                  <Tooltip title="Deposite to Debit Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/USbank/Deposit_to_Card_main.svg`)}
                                                        alt="Deposite to Debit Card"
                                                        width="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
												{vendor.payment &&
                                                vendor.payment.search(
                                                  paymentMethods.USBankPrepaidCard
                                                ) !== -1 && (
                                                  <Tooltip title="Prepaid Card">
                                                    <span
                                                      className={
                                                        classes.checkedIcon
                                                      }
                                                      style={{
                                                        margin: "0 5px",
                                                      }}
                                                    >
                                                      <img
                                                        className={
                                                          classes.checkClass
                                                        }
                                                        src={require(`~/assets/icons/USbank/Prepaidcard.svg`)}
                                                        alt="Prepaid Card"
                                                        width="18"
                                                      />
                                                    </span>
                                                  </Tooltip>
                                                )}
                                  </Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                size="small"
                                align="left"
                                style={{ whiteSpace: "nowrap", width: "14%" }}
                                className={classes.textBold}
                              >
                                <Chip
                                  label={vendor.status === "Inprogress" ? "In Progress" : "Onboarded"}
                                  style={{
                                    margin: "2px",
                                    backgroundColor:
                                      vendor.status === "Inprogress"
                                        ? "#FFE0B2"
                                        : "#B2DFFF",
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Box display="flex" justifyContent="center">
                              <CircularProgress color="primary" />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
                <Paper>
                  <Box py={2} display="flex" justifyContent="flex-end">
                    <Pagination
                      count={count}
                      defaultPage={pageNumber}
                      page={pageNumber}
                      onChange={(e, page) => this.handlePageChange(page)}
                    />
                  </Box>
                </Paper>
              </Paper>
            </Grid>
          )}

          {alertMessage && this.renderSnackbar(alertType, alertMessage)}
        </Box>

        {showClientModal && (
          <CustomDialog>
          {selectedClient?.appType === EntityType.B2C ?
            <B2CClientDetails
              setDialogMessage={(message) => this.setDialogMessage(message)}
              selectedClient={selectedClient}
              closeModal={() => this.setState({ showClientModal: false })}
              history={this.props.history}
            />
            :<ClientDetails
              setDialogMessage={(message) => this.setDialogMessage(message)}
              selectedClient={selectedClient}
              closeModal={() => this.setState({ showClientModal: false })}
              history={this.props.history}
            />
          }
          </CustomDialog>
        )}

        {alertFlag && (
          <AlertDialog
            title={message}
            onConfirm={this.hideDialogMessage.bind(this)}
          />
        )}

        {enableDateFilter && (
          <SideDialog
            showButton={false}
            alignSide={true}
            icon="calendar"
            onConfirm={() => this.setState({ enableDateFilter: false })}
            title={"Filters"}
          >
            <DashboardDateFilter
              filters={dateFilters}
              selectedFilter={selectedFilter}
              handleFilterSelect={(i) => this.setState({ selectedFilter: i })}
              resetFilter={(filter) =>
                this.setState(
                  {
                    selectedFilter: 1,
                    selectedCurrentDateFilter: 1,
                    selectedDateFilters: {
                      ...this.state.selectedDateFilters,
                      year: undefined,
                      month: undefined,
                      quarter: "",
                      lastDays: undefined,
                      fromDate: undefined,
                      toDate: undefined,
                    },
                  },
                  () => {
                    this.getListData();
                  }
                )
              }
              filterData={(filter, fromDate, toDate) => {
                let getFilterDates = {};
                if (filter !== 7) {
                  getFilterDates = this.onChangeFilter(filter);
                }
                this.setState(
                  {
                    selectedCurrentDateFilter: filter,
                    selectedFilter: filter,
                    enableDateFilter: false,
                    selectedDateFilters: {
                      ...this.state.selectedDateFilters,
                      fromDate:
                        filter === 7 ? fromDate : getFilterDates.fromDate,
                      toDate: filter === 7 ? toDate : getFilterDates.toDate,
                    },
                  },
                  () => {
                    this.getListData();
                  }
                );
              }}
              filter={selectedDateFilters}
              changeFilter={(filter) => {
                this.setState({ selectedDateFilters: filter });
              }}
            />
          </SideDialog>
        )}
      </Grid>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };
}

export default connect((state) => ({
  ...state.user,
  ...state.clientConfig,
  ...state.permissions,
}))(withStyles(styles)(Clients));
