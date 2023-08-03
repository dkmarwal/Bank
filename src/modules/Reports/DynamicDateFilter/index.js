import React, { useState } from 'react';
import {
  Box, Button, CircularProgress,
} from '@material-ui/core';
import Checkbox from "~/components/Forms/Checkbox";
import CustomDateRange from "~/components/Filter/customDateRange";
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import moment from 'moment';

const DynamicDateFilter = (props) => {
  const { filterList, selectedDateFilter, startDate, endDate, classes, resetFilter, applyFilter, processing } = props;
  const [selectedFilter, setSelectedFilter] = useState(selectedDateFilter);
  const [startDt, setStartDt] = useState(startDate);
  const [endDt, setEndDt] = useState(endDate);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let flag = false;
    if (new Date(startDt) > new Date(endDt)) {
      flag = true;
      setErrors({
        ...errors,
        date: "Start Date must be less than End Date",
      });
    } else {
      setErrors({
        ...errors,
      });
    }
    return flag;
  };
  const filterListOptions = filterList && filterList.map((item, index) => {
    return { id: item.value, label: item.name, selected: item.value == selectedFilter };
  }) || [];

  const handleFilterChange = (val) => {
    setSelectedFilter(val);
    setDateRange(val);
  }

  const handleFilterDateChange = (fieldName, date) => {
    switch (fieldName) {
      case 'startDate':
        setStartDt(getFormattedDate(date));
        break;
      case 'endDate':
        setEndDt(getFormattedDate(date));
        break;
      default:
        break;
    }
  }

  const getFormattedDate = (dateVal) => {
    return moment(dateVal).format('YYYY-MM-DD');
  }

  const resetDateRange = () => {
    setSelectedFilter("PM");
    setDateRange("PM");
    resetFilter("PM", startDt, endDt);
  }

  const setDateRange = (val) => {
    const currentDate = new Date();
    switch (val) {
      case 'LW':
        setStartDt(getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 7))));
        setEndDt(getFormattedDate(new Date(new Date().setDate(new Date().getDate()))));

        break;
      case 'PM':
        setStartDt(getFormattedDate(new Date(currentDate.getFullYear(), new Date().getMonth() - 1, 1)));
        setEndDt(getFormattedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)));

        break;
      case 'PY':
        setStartDt(getFormattedDate(new Date(currentDate.getFullYear() - 1, 0, 1)));
        setEndDt(getFormattedDate(new Date(currentDate.getFullYear() - 1, 11, 31)));

        break;
      case 'LM':
        setStartDt(getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 30))));
        setEndDt(getFormattedDate(new Date(new Date().setDate(new Date().getDate()))));
        break;
      case 'PQ':
        const quarter = Math.floor((new Date().getMonth() / 3));
        const quarterStartDate = new Date(new Date().getFullYear(), quarter * 3 - 3, 1);

        setStartDt(getFormattedDate(quarterStartDate));
        setEndDt(getFormattedDate(new Date(quarterStartDate.getFullYear(), quarterStartDate.getMonth() + 3, 0)));
        break;
      case 'AT':
        setStartDt("1970-01-01");
        setEndDt(getFormattedDate(new Date()))
        break;
      case 'CUSTOM':
        setStartDt(getFormattedDate(new Date()));
        setEndDt(getFormattedDate(new Date()));
        break;
      default:
        break;
    }
  }

  return (
    <Box display="flex" width="100%" flexDirection="column">
      <Box p={1} display="flex" justifyContent="flex-start">
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          {filterListOptions && filterListOptions.map((item, index) => {
            return <Box p={1} pb={2} width="100%">
              <Checkbox
                // onChange={(event, index, checked) => handleDateChange("selectedDateFilter", event, item.id)}
                onChange={() => handleFilterChange(item.id)}
                label={item.label}
                checked={item.selected}
                index={index}
              />
            </Box>
          })
          }
        </Box>
      </Box>
      {selectedFilter === "CUSTOM" && <><Box display="flex" justifyContent="flex-start">
        <CustomDateRange
          startDate={startDt}
          endDate={endDt}
          handleDateChange={handleFilterDateChange}
        />
      </Box>
        <Box mx={4} my={1} style={{ color: "red", fontSize: "11px" }}>{errors["date"]}</Box></>}

      <Box p={1} display="flex" justifyContent="center">
        <Box mt={2}>
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            className={classes.btnScpace}
            onClick={resetDateRange}
          >
            RESET FILTER
          </Button>
        </Box>
        <Box mt={2} pl={2}>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              color="primary"
              className={classes.btnScpace}
              // onClick={() => applyFilter(selectedFilter, startDt, endDt)}
              onClick={() => {
                const isNotValid = validate();
                if (!isNotValid) {
                  applyFilter(selectedFilter, startDt, endDt);
                }
              }}
            >
              APPLY FILTER
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default withStyles(styles)(DynamicDateFilter);
