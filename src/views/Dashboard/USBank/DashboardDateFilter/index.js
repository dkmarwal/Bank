import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "~/components/Forms/Checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventIcon from "@material-ui/icons/Event";
import { styles } from "./styles";
import "./styles.scss";

const DashboardFilter = ({
  filters,
  selectedFilter,
  classes,
  handleFilterSelect,
  selectedView,
  selectedCurrency,
  clientId,
  filterData,
  filter,
  changeFilter,
  resetFilter,
}) => {
  const [_fromDate, setFromDate] = useState(filter && filter["fromDate"]);
  const [_toDate, setToDate] = useState(filter && filter["toDate"]);
  const [filterIndex, setFilterIndex] = useState(selectedFilter);
  const [errors, setErrors] = useState({});

  const validate = () => {   
    if(filterIndex === 7){
      let flag = false;
      if (_fromDate > _toDate) {
        flag = true;
        setErrors({
          ...errors,
          date: "From Date must be less than To Date",
        });
      }
      else if (!Boolean(_fromDate) && !Boolean(_toDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: "From Date and To Date is required",
        });
      }
      else if (!Boolean(_fromDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: "From Date is required",
        });
      }
      else if (!Boolean(_toDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: "To Date is required",
        });
      }      
      else {
        setErrors({
          ...errors,
        });
      }
      return flag;
    }
    else{
      let flag = false;
      if (_fromDate > _toDate) {
        flag = true;
        setErrors({
          ...errors,
          date: "From Date must be less than To Date",
        });
      } 
      else {
        setErrors({
          ...errors,
        });
      }
      return flag;
    }
    
  };

  const onChangeFilter = (index) => {
    setFilterIndex(index);
    switch (index) {
      case 1:
        filter["year"] = 0;
        filter["month"] = undefined;
        filter["lastDays"] = 0;
        filter["quarter"] = "";
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 2:
        let _month = new Date().getMonth();
        let _year = new Date().getFullYear();
        if (_month === 0) {
          _month = 12;
          _year = _year - 1;
        }
        filter["year"] = _year;
        filter["month"] = _month;
        filter["quarter"] = "";
        filter["lastDays"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 3:
        let today = new Date();
        let quarter = Math.ceil(today.getMonth() / 3);
        let year;
        let previousQuarter = 0;
        if (quarter <= 1) {
          previousQuarter = 4;
          year = new Date().getFullYear() - 1;
        } else {
          previousQuarter = quarter - 1;
          year = new Date().getFullYear();
        }
        filter["month"] = undefined;
        filter["quarter"] = `Q${previousQuarter}`;
        filter["year"] = year;
        filter["lastDays"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 4:
        filter["year"] = new Date().getFullYear() - 1;
        filter["lastDays"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 5:
        filter["lastDays"] = 7;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 6:
        filter["lastDays"] = 30;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 7:
        filter["lastDays"] = undefined;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        changeFilter(filter);
        break;
      default:
    }
    // filterData(filter)
    // onDateFilterChange(index, FromDate, ToDate);
  };

  // const resetFilter = () => {
  //     // onDateFilterChange(null);
  // };

  return (
    <Grid item container direction="column" spacing={2}>
      <Box>
        {filters &&
          filters.map((item, index) => (
            <Grid class="gridContainerClass" key={index}>
              <Checkbox
                checked={filterIndex === index + 1}
                label={item.label}
                index={index + 1}
                onChange={(e, index, isChecked) => onChangeFilter(index)}
              />
            </Grid>
          ))}

        {filterIndex === 7 && (
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <Box mb={1}>
                <DatePicker
                  customInput={
                    <OutlinedInput
                      variant="outlined"
                      className="full-width"
                      color="primary"
                      endAdornment={
                        <InputAdornment position="end">
                          <EventIcon fontSize="small" style={{cursor: 'pointer'}}/>
                        </InputAdornment>
                      }
                    />
                  }
                  selected={_fromDate}
                  onChange={(val) => {
                    setFromDate(val);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  // onChange={this.handleDateChange}
                  // value={}
                  name="FromDate"
                  placeholderText={"From Date"}
                  dateFormat="MM-dd-yyyy"
                  className={classes.datePicker}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Box>
                <DatePicker
                  customInput={
                    <OutlinedInput
                      variant="outlined"
                      className="full-width"
                      color="primary"
                      endAdornment={
                        <InputAdornment position="end">
                          <EventIcon fontSize="small" style={{cursor: 'pointer'}}/>
                        </InputAdornment>
                      }
                    />
                  }
                  selected={_toDate}
                  onChange={(val) => {
                    setToDate(val);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                  // value={}
                  name="ToDate"
                  placeholderText={"To Date"}
                  dateFormat="MM-dd-yyyy"
                  className={classes.datePicker}
                />
              </Box>
            </Grid>
            <Box mx={4} my={1} style={{ color: "red", fontSize: "11px" }}>
              {errors["date"]}
            </Box>
          </Grid>
        )}
        <Grid
          container
          item
          spacing={3}
          direction="row"
          justify="space-between"
        >
          <Grid item xs>
            <Button
              type="submit"
              fullWidth={false}
              variant="outlined"
              color="primary"
              size="large"
              className={classes.filterBTN}
              onClick={() => {
                setFilterIndex(2);
                setFromDate(undefined);
                setToDate(undefined);
                resetFilter();
                setErrors({})
              }}
            >
              RESET FILTER
            </Button>
          </Grid>
          <Grid item xs>
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              disableElevation
              size="large"
              className={classes.filterBTN}
              color="primary"
              style={{ color: "white" }}
              onClick={() => {
                const isNotValid = validate();
                if (!isNotValid) {
                  filterData(filterIndex, _fromDate, _toDate);
                }
              }}
            >
              APPLY FILTER
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default withStyles(styles)(DashboardFilter);
