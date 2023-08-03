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
import PercentageBar from "~/components/PercentageBar";
import { pendingPercentageOptions } from "~/config/entityTypes";

class PendingData extends React.Component {
  render() {
    const { classes, payees, annualSpendUSD, annualSpendCAD, campaignList, vendorList, onChange, selectedVendorId, selectedCampaignId, selectedCurrencySpend } = this.props;
    return (
      <Grid item lg={12}>
        <Paper elevation={0}>
          <Box display="flex" width={1} justifyContent="space-between">
            <Box display="flex" justifyContent="flex-start" m={2} sx={{ width: '35%' }}>
              <Box width={1}>
                <Box
                  // mb={1}
                  display="flex"
                  // justifyContent="center"
                  pt={0.5}
                  color={"#4c4c4c"}
                  fontWeight="700"
                  minHeight={"45px"}
                >
                  Pending vs All payees of all time
                </Box>
                <PercentageBar
                    totalTitle={`All Campaign Payees ${(payees?.allPayees || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    partialTitle={`Pending Payees ${(payees?.pendingPayees || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                    total={payees?.allPayees || 0}
                    partial={payees?.pendingPayees || 0}
                    taskCompleted={payees?.campaignCompleted || 0}
                    taskRunning={payees?.campaignRunning || 0}
                    stats={true}
                    primaryBarColor="#B2DFFF"
                    secondaryBarColor="#295D91"
                    stacked={false}
                />
              </Box>              
            </Box>
            <Box display="flex" m={2} sx={{ width: '65%' }}>
                <Box sx={{ width: '100%' }}>
                    <Box
                        mb={1}
                        display="flex"
                        justifyContent="space-between"
                        color={"#4c4c4c"}
                        fontWeight="700"
                        minHeight={"45px"}
                    >
                      <FormControl className={classes.formControl}>
                          <Select
                              value={selectedCurrencySpend || "USD"}
                              name="selectedCurrencySpend"
                              onChange={(e) => onChange(e)}
                              className={classes.selectItem}
                          >
                            {pendingPercentageOptions.map(opt => 
                              <MenuItem key={opt.key} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            )}
                          </Select>
                      </FormControl>
                      <Box display="flex">
                        <Box
                          mb={1}
                          display="flex"
                          justifyContent="center"
                          color={"#4c4c4c"}
                          fontWeight="700"
                        >
                          <FormControl>
                            <Select
                              value={selectedVendorId || " "}
                              name="selectedVendorId"
                              onChange={(e) => onChange(e)}
                              className={classes.selectItemRadius}
                            >
                              <MenuItem id="" value=" ">
                                All Vendors
                              </MenuItem>
                              {vendorList.length > 0 && 
                                vendorList.map(item => 
                                <MenuItem id={item.campaignVendorId} value={item.campaignVendorId}>
                                  {item.campaignVendorName}
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                        <Box
                          mb={1}
                          display="flex"
                          justifyContent="center"
                          color={"#4c4c4c"}
                          fontWeight="700"
                          ml={3}
                        >
                          <FormControl>
                            <Select
                              name="selectedCampaignId"
                              value={selectedCampaignId || " "}
                              onChange={(e) => onChange(e)}
                              className={classes.selectItemRadius}
                            >
                              <MenuItem id="" value=" ">
                                All Campaigns
                              </MenuItem>
                              {campaignList.length > 0 && 
                                campaignList.map(item => 
                                  <MenuItem value={item.ccCampaignId}>
                                    {item.ccCampaignName}
                                  </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ width:"40%"}}>
                      <PercentageBar
                          totalTitle={`${selectedCurrencySpend} ${((selectedCurrencySpend=="USD" ? annualSpendUSD?.totalAnnualSpend : annualSpendCAD?.totalAnnualSpend) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                          partialTitle={`${selectedCurrencySpend} ${((selectedCurrencySpend=="USD" ? annualSpendUSD.potentialSpend : annualSpendCAD.potentialSpend) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                          total={(selectedCurrencySpend=="USD" ? annualSpendUSD.totalAnnualSpend : annualSpendCAD.totalAnnualSpend) || 0}
                          partial={(selectedCurrencySpend=="USD" ? annualSpendUSD.potentialSpend : annualSpendCAD.potentialSpend) || 0}
                          stacked={true}
                          primaryBarColor="#B2DFFF"
                          secondaryBarColor="#295D91"
                      />
                    </Box>
                </Box>              
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
  }))(withStyles(styles)(PendingData))
);
