import React from "react";
import {
  Grid,
  Box,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import StackBar from "~/components/StackBar";
import PercentageBar from "~/components/PercentageBar";
import { declinedPercentageOptions } from "~/config/entityTypes";

class DeclinedData extends React.Component {
  render() {
    const { classes, declinedStatus, otherReasons, payees, annualSpendUSD, annualSpendCAD, campaignList, vendorList, onChange, selectedVendorId, selectedCampaignId, selectedCurrencyDeclined} = this.props;
    return (
      <Grid item lg={12}>
        <Paper elevation={0}>
          <Box display="flex" width={1} justifyContent="space-between">
            <Box display="flex" justifyContent="flex-start" m={2} sx={{ width: '25%' }}>
              <Box sx={{ width: '100%' }}>
                <Box
                  mb={1}
                  display="flex"
                  justifyContent="center"
                  color={"#4c4c4c"}
                  fontWeight="700"
                >
                  <FormControl>
                    <Select
                      name="selectedCurrencyDeclined"
                      value={selectedCurrencyDeclined || "USD"}
                      onChange={(e) => onChange(e)}
                      className={classes.selectItem}
                    >
                      {declinedPercentageOptions.map(opt => 
                        <MenuItem key={opt.key} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <PercentageBar
                  totalTitle={`All Payees $${((selectedCurrencyDeclined=="USD" ? annualSpendUSD.totalAnnualSpend : annualSpendCAD.totalAnnualSpend) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                  partialTitle={`Payees Declined $${((selectedCurrencyDeclined=="USD" ? annualSpendUSD.lostSpend : annualSpendCAD.lostSpend) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                  total={(selectedCurrencyDeclined=="USD" ? annualSpendUSD.totalAnnualSpend : annualSpendCAD.totalAnnualSpend) || 0}
                  partial={(selectedCurrencyDeclined=="USD" ? annualSpendUSD.lostSpend : annualSpendCAD.lostSpend) || 0}
                  taskCompleted={payees?.campaignCompleted || 0}
                  taskRunning={payees?.campaignRunning || 0}
                  stats={true}
                />
              </Box>              
            </Box>
            <Box display="flex" justifyContent="flex-end" m={2} sx={{ width: '70%' }}>
              <StackBar
                classes={classes}
                heading="Declined Reason"
                data={declinedStatus}
                otherReasons={otherReasons}
                campaignList={campaignList}
                vendorList={vendorList}
                selectedVendorId={selectedVendorId}
                selectedCampaignId={selectedCampaignId}
                onChange={onChange}
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    );
  }
}

export default (
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(DeclinedData))
);
