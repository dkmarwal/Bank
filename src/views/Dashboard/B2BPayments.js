import {
  Box,
  Grid,
  TextField,
  withStyles,
  MenuItem,
  Button,
  Tooltip
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Doughnut } from "react-chartjs-2";
import styles from "./styles";
import EventIcon from "@material-ui/icons/Event";


class B2BPayments extends Component {
  state = {
    b2bPaymentGraphRef: null
  };

  sortPaymentDataFn=(data)=>{
    if(Object.keys(data).length > 0){
      var sortable = [];
      for(var item in data) {
        sortable.push([item, data[item]]);
      }
      return sortable.sort(function(a, b) {
        return b[1] - a[1];
      });
    }
  }

  paymentGraphRef=(ref)=>{
    this.setState({
      b2bPaymentGraphRef: ref
    }, ()=>{
      this.props.B2BGraphRef(ref)
    })
  }
  paymentLegendClick=(e)=>{
    const {b2bPaymentGraphRef} = this.state;
    if(Boolean(b2bPaymentGraphRef)){
      const name = e.currentTarget.getAttribute("name");
      const index = b2bPaymentGraphRef.props.data.labels.indexOf(name);
      const meta = b2bPaymentGraphRef.chartInstance.getDatasetMeta(0);
      const result= (meta.data[index].hidden == true) ? false : true;
      if(result === true)
      {
        meta.data[index].hidden = true;
        e.currentTarget.classList.add("strike");
      }else{
        e.currentTarget.classList.remove("strike");
        meta.data[index].hidden = false;
      }
      b2bPaymentGraphRef.chartInstance.update();
    }
    else{
      e.currentTarget.classList.toggle("strike");
    }
  }

  render() {
    const { classes } = this.props;
    const {
      totalPayments, totalCADPayments, totalUSDPayments,
      totalCHKPayment, totalACHPayment, totalVCAPayment, totalCADAmount, totalUSDAmount,
      achPercent, chkPercent, vcaPercent,
      selectedCurrency, selectedView, selectedPayee, payeesList, selectedPayeeId,
      doughnutData, doughnutOptions,
      onPaymentsChange, onClickDate, onFilterChange,
      onUSDClick, onCADClick,
      paymentsData, lineChartOptions, onPaymentsClick, onAmountsClick,
    } = this.props;

    const payData = {
      "ACH": achPercent || 0,
      "CHK": chkPercent || 0,
      "VCA": vcaPercent || 0,
    }
    const getPaymentList = this.sortPaymentDataFn(payData);

    return (
      <>
        <Grid item container alignItems="flex-start">
          <Grid item container xs={3}>
            <Box className={classes.headingNew}>
              <div>Payments </div>
              <Box
                width="92%"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                title={
                  selectedPayee && selectedPayee[0] && selectedPayee[0]["clientName"]
                    ? selectedPayee[0]["clientName"]
                    : "All Payers"
                }
              >
                {" "}
                {selectedPayee &&
                  selectedPayee.length > 0 &&
                  selectedPayee[0] &&
                  selectedPayee[0]["clientName"]
                  ? selectedPayee[0]["clientName"]
                  : "All Payers"}
              </Box>
            </Box>
            <Box
              textAlign="center"
              justifyContent="center"
              display="flex"
              flexGrow={1}
              mt={6}
              pb={2}
            >
              {totalCHKPayment ||
                totalACHPayment ||
                totalVCAPayment ? (
                <Doughnut
                  id="doughnutChart"
                  width={180}
                  height={100}
                  data={doughnutData}
                  options={doughnutOptions}
                  ref={this.paymentGraphRef}
                />
              ) : (
                <Tooltip
                  title="No Data Available"
                  aria-label="No Data Available"
                >
                  <img
                    src={require(`~/assets/images/blankDoughnut.PNG`)}
                    alt={"No Data Found"}
                    style={{
                      height: "60px",
                      width: "63px",
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            <Box textAlign="center" width="100%">
              <h1 className={classes.textNum}>{totalPayments}</h1>
              <span className={classes.dot}> </span>
              <span
                style={{
                  color: "#4C4C4C",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {" "}
                Total Payments Made
              </span>
            </Box>
            <Box
              mx="auto"
              pt={2}
              display="flex"
              flexDirection="column"
              alignItems="left"
              className={classes.legendList}
            >

              {Boolean(getPaymentList)
                ? getPaymentList.map((item) =>{
                  return(
                      <Box
                        pt={1}
                        display="flex"
                        fontWeight={700}
                        fontSize={11}
                        alignItems="center"
                        className="legendItem"
                        onClick={(e)=>this.paymentLegendClick(e)}
                        name={item[0]}
                      >
                        <span
                          className={classes.dot}
                          style={{ backgroundColor: item[0] === "ACH"
                            ? "#54aca4"
                            : item[0] === "CHK"
                            ? "#478ce6"
                            : item[0] === "VCA"
                            ? "#cce4ff"
                            : null
                          }}
                        >
                          {" "}
                        </span>
                        <span style={{ fontSize: 12, width: 120, fontWeight: 600}}>{item[0]}</span>
                        <span style={{paddingLeft: 40}}>
                          {" "}
                          {item[1]}%
                        </span>
                      </Box>
                  )
                })
                : null
              }
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
            ></Box>
          </Grid>
          <Grid item container xs={9}>
            <Box py={3} width="100%">
              <Box display="flex" justifyContent="flex-end">
                <TextField
                  value={selectedPayeeId}
                  select
                  variant="outlined"
                  size="small"
                  style={{ width: "241px", marginRight: 28 }}
                  onChange={onPaymentsChange}
                >
                  <MenuItem selected={selectedPayeeId == 0} value={0}>
                    All Payers
                  </MenuItem>
                  {payeesList &&
                    payeesList.map((payee) =>{
                      if(payee.appType == 1){
                        return(
                          <MenuItem
                              selected={selectedPayeeId == payee.clientId}
                              value={payee.clientId}
                            >
                              {payee.clientName}
                            </MenuItem>
                        )
                      }
                    })}
                </TextField>

                <Button
                  variant="text"
                  color="primary"
                  startIcon={<EventIcon />}
                  style={{
                    textTransform: "capitalize",
                    color: "#0b1941",
                    marginRight: 15,
                    fontSize: 14,
                  }}
                  size="small"
                  onClick={onClickDate}
                >
                  {" "}
                  Viewing{" "}
                  {onFilterChange}{" "}
                </Button>
              </Box>

              <Box style={{ borderLeft: `2px solid #e6e6e6` }}>
                <Box py={1} px={2}>
                  <Box
                    pb={1}
                    display="flex"
                    justifyContent="center"
                  ></Box>
                  <Box my={2} display="flex" justifyContent="center">
                    <span
                      onClick={onUSDClick}
                      className={classes.flagContainer}
                    >
                      <img
                        src={require(`~/assets/icons/USAFlag.svg`)}
                        alt={"USA Flag"}
                        style={
                          selectedCurrency === "USD"
                            ? {
                              border: `2px solid #fff`,
                              boxShadow: `0 0 0 2px #002d72`,

                              borderRadius: "100%",
                              backgroundPosition: "center center",
                            }
                            : {
                              borderRadius: "100%",
                              backgroundPosition: "center center",
                            }
                        }
                      />{" "}
                      <h3>
                        {selectedView === "Amount" ? (
                          <Box
                            ml={1}
                            mr={4}
                            fontWeight="normal"
                            fontSize={16}
                            style={
                              selectedCurrency === "USD"
                                ? {
                                  color: "#002d72",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                }
                                : {}
                            }
                          >
                            USD ${totalUSDAmount || 0}
                          </Box>
                        ) : (
                          <Box
                            ml={1}
                            mr={4}
                            fontWeight="normal"
                            fontSize={16}
                            style={
                              selectedCurrency === "USD"
                                ? {
                                  color: "#002d72",
                                  fontWeight: "bold",
                                  fontSize: 16,
                                }
                                : {}
                            }
                          >
                            USD {totalUSDPayments || 0} payments
                          </Box>
                        )}
                      </h3>
                    </span>
                    <span
                      onClick={onCADClick}
                      className={classes.flagContainer}
                    >
                      <img
                        src={require(`~/assets/icons/CanadianFlag.svg`)}
                        alt={"Canadian Flag"}
                        style={
                          selectedCurrency == "CAD"
                            ? {
                              border: `2px solid #fff`,
                              boxShadow: `0 0 0 2px #002d72`,

                              borderRadius: "100%",
                              backgroundPosition: "center center",
                            }
                            : {
                              borderRadius: "100%",
                              backgroundPosition: "center center",
                            }
                        }
                      />
                      <h3>
                        {selectedView === "Amount" ? (
                          <Box
                            ml={1}
                            mr={4}
                            fontWeight="normal"
                            fontSize={16}
                            style={
                              selectedCurrency === "CAD"
                                ? {
                                  color: "#002d72",
                                  fontWeight: "bold",
                                }
                                : {}
                            }
                          >
                            CAD ${totalCADAmount || 0}
                          </Box>
                        ) : (
                          <Box
                            ml={1}
                            mr={4}
                            fontWeight="normal"
                            fontSize={16}
                            style={
                              selectedCurrency === "CAD"
                                ? {
                                  color: "#002d72",
                                  fontWeight: "bold",
                                }
                                : {}
                            }
                          >
                            CAD {totalCADPayments || 0} payments
                          </Box>
                        )}
                      </h3>
                    </span>
                  </Box>
                  <Box width="80%" mx="auto">
                    <Box display="block" width={1} mb={1}>
                      <span>
                        {selectedView === "Payment" ? (
                          <Box
                            fontWeight="normal"
                            style={{
                              color: "rgba(18,18,18,0.87)",
                              fontSize: "12px",
                            }}
                          >
                            {selectedCurrency}
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#282828",
                                fontWeight: 700,
                              }}
                            >
                              {" "}
                              $
                              {selectedCurrency === "USD"
                                ? totalUSDAmount
                                : totalCADAmount}
                            </span>
                          </Box>
                        ) : (
                          <Box
                            fontWeight="normal"
                            style={{
                              fontSize: "12px",
                              color: "rgba(18,18,18,0.87)",
                            }}
                          >
                            Payments{" "}
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#282828",
                                fontWeight: "bold",
                              }}
                            >
                              {selectedCurrency === "USD"
                                ? totalUSDPayments
                                : totalCADPayments}
                            </span>
                          </Box>
                        )}
                      </span>
                    </Box>

                    {(selectedView === "Payment" &&
                      ((selectedCurrency === "USD" &&
                        (!totalUSDPayments ||
                          totalUSDPayments === 0)) ||
                        (selectedCurrency === "CAD" &&
                          (!totalCADPayments ||
                            totalCADPayments === 0)))) ||
                      (selectedView === "Amount" &&
                        ((selectedCurrency === "USD" &&
                          (!totalUSDAmount || totalUSDAmount === 0)) ||
                          (selectedCurrency === "CAD" &&
                            (!totalCADAmount ||
                              totalCADAmount === 0)))) ||
                      !paymentsData ||
                      paymentsData === null ? (
                      <Box
                        display="block"
                        textAlign="center"
                        width={1}
                        my={6}
                      >
                        <img
                          alt="no-data"
                          src={require("~/assets/images/nodata.svg")}
                        />

                        <Box
                          py={3}
                          color="#A1A1A1"
                          fontSize={14}
                          display="block"
                        >
                          {" "}
                          No Data to show{" "}
                        </Box>
                      </Box>
                    ) : (
                      <Line
                        // plugins={{
                        //   afterDraw: function (chart, easing) {
                        //     const datasets = chart.config.data.datasets;
                        //     if (datasets) {
                        //       const { ctx } = chart.chart;

                        //       ctx.save();
                        //       ctx.fillStyle = "black";
                        //       ctx.font = "400 12px Open Sans, sans-serif";

                        //       for (let i = 0; i < datasets.length - 1; i++) {
                        //         const ds = datasets[i];
                        //         const label = ds.label;
                        //         const meta = chart.getDatasetMeta(i);
                        //         const len = meta.data.length - 1;
                        //         const xOffset = chart.canvas.width - 26;
                        //         const yOffset =
                        //           meta &&
                        //           meta.data &&
                        //           meta.data[len] &&
                        //           meta.data[len]._model.y;
                        //         ctx.fillText(label, xOffset, yOffset);
                        //       }
                        //       ctx.restore();
                        //     }
                        //   },
                        // }}
                        id={"paymentsChart"}
                        width={794}
                        height={250}
                        data={paymentsData}
                        options={lineChartOptions}
                        redraW={false}
                      />
                    )}
                  </Box>

                  <Box my={2} display="flex" justifyContent="center">
                    <span className={classes.tabContainer}>
                      <span
                        onClick={onPaymentsClick}
                        className={classes.tab}
                        style={
                          selectedView === "Payment"
                            ? {
                              color: "white",
                              background: "#0b1941",
                            }
                            : {}
                        }
                      >
                        No. of Payments
                      </span>
                      <span
                        className={classes.tab}
                        style={
                          selectedView === "Amount"
                            ? {
                              color: "white",
                              background: "#0b1941",
                            }
                            : {}
                        }
                        onClick={onAmountsClick}
                      >
                        Amount
                      </span>
                    </span>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }

}
export default connect((state) => ({ ...state.user, ...state.campaign }))(
  withStyles(styles)(B2BPayments)
);
