import React from "react";
import "./styles.scss";
import { Card, Grid, Box, Typography, FormControl, Select, MenuItem } from "@material-ui/core";

class StackBar extends React.Component {
  state = {
    statusByAmount: true,
    showDropdown: false,
  };

  render() {
    const { classes, heading, data, otherReasons, campaignList, vendorList, selectedVendorId, selectedCampaignId, onChange } = this.props;
    const  totalCount  = data?.length> 0 ? data.reduce((total, item) => total + item.count,0) : 0;
    return (
      <Card
        className="cardWrap"
        elevation={0}
        style={{
          //  maxHeight: 148,
            width: '100%' }}
      >
        <div className="_content">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            color={"#4c4c4c"}
            fontWeight="700"
          >
            <Typography variant="span" className="chartHeading">{heading}</Typography>
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
                      <MenuItem value={item.campaignVendorId}>
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
          {totalCount && totalCount > 0
            ? data.map((obj, i) => (
                <span className="tooltip">
                  <span
                    className={"chip"}
                    style={{
                      width: `${(obj.count / totalCount) * 100}%`,
                      background: obj.color,
                    }}
                  />
                  {obj.label=="Others" ?
                  <span
                    // class={
                    //   i === data.length - 1
                    //     ? "showLeft tooltiptext"
                    //     : "tooltiptext"
                    // }
                    class="showLeft tooltiptext toolTipWidth"
                  >
                    {otherReasons?.length > 0 && otherReasons.map(item => 
                      <div>{item.label}: {item.count}</div>
                    )}
                  </span>
                  :<span
                    class={
                      i === data.length - 1
                        ? "showLeft tooltiptext"
                        : "tooltiptext"
                    }
                  >
                    {obj.label}
                  </span>
                  }
                </span>
              ))
            :
              <span>
                <span
                  className={"chip"}
                  style={{
                    width: "100%",
                    background: "#F4F4F4",
                  }}
                />
              </span>
            }
          <div className="keyPoints">
            <Grid container>
              {totalCount && totalCount > 0 ? data.map((obj) => (
                <Grid item xs={4}>
                <Box mb={1}>
                  <span className="infoGroup">
                    <span className="info">
                    <Grid container>
                    <Grid item xs={1}>
                    <span
                      className="squareBox"
                      style={{ background: obj.color }}
                    ></span>
                    </Grid>
                    <Grid item xs={5}>
                    <span className="text">
                        {obj.label}
                      </span>
                    </Grid>
                    <Grid item xs={5}>
                    <span className="percentage">
                        {obj.count.toString() && totalCount && totalCount > 0
                          ? `${obj.count
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${(
                              (obj.count / totalCount) *
                              100
                            ).toFixed(2)}%)`
                          : 0}
                    </span>
                    </Grid>
                    </Grid>
                    </span>
                  </span>
                </Box>
                </Grid>
              ))
              :
              <Box my={1}>
                <span className="infoGroup">
                  <span className="info">
                    <span className="text">
                      No Data to Show
                    </span>
                  </span>
                </span>
              </Box>
              }
            </Grid>
          </div>
        </div>
      </Card>
    );
  }
}

export default StackBar;
