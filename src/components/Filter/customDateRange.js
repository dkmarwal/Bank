import React, { Component } from 'react';
import { Box } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class CustomDateRange extends Component {
    constructor() {
        super();
        this.state = {
            startDate: null,
            endDate: null,
        }
    }

    handleStartDateChange = date => {
        this.setState({startDate:date});
        this.props.handleDateChange('startDate', date);
    };

    handleEndDateChange = date => {
        this.setState({endDate:date});
        this.props.handleDateChange('endDate', date);
    }

  render() {
    const { startDate, endDate} = this.props;

    return (<MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Box display="flex">
            <Box p={1}>
                <KeyboardDatePicker
                  autoOk={true}
                  clearable={true}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="startDate"
                  name="startDate"
                  label="Start Date"
                  value={startDate}
                  onChange={this.handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'Start Date',
                  }}
                />
            </Box>
            <Box p={1}>
                <KeyboardDatePicker
                  autoOk={true}
                  clearable={true}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="endDate"
                  name="endDate"
                  label="End Date"
                  value={endDate}
                  onChange={this.handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'End Date',
                  }}
                />
            </Box>
        </Box>
     </MuiPickersUtilsProvider>
    )
  }
}

export default CustomDateRange;
