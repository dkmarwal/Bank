import {
  Box,
  Grid,
  Paper,
  TextField,
  withStyles,
  MenuItem,
  Button,
  Typography
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Doughnut } from "react-chartjs-2";
import styles from "./styles";

import { Tooltip } from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";

class B2CPayments extends Component {
  state = {
    b2cPaymentGraphRef: null
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
      b2cPaymentGraphRef: ref
    }, ()=>{
      this.props.B2CGraphRef(ref)
    })
  }

  b2cPaymentLegendClick=(e)=>{    
    const {b2cPaymentGraphRef} = this.state;
    if(Boolean(b2cPaymentGraphRef)){ 
      const name = e.currentTarget.getAttribute("name");
      const index = b2cPaymentGraphRef.props.data.labels.indexOf(name);
      const meta = b2cPaymentGraphRef.chartInstance.getDatasetMeta(0); 
      const result= (meta.data[index].hidden === true) ? false : true;
      if(result === true)
      {
        meta.data[index].hidden = true;      
        e.currentTarget.classList.add("strike");
      }else{
        e.currentTarget.classList.remove("strike");
        meta.data[index].hidden = false;
      } 
      b2cPaymentGraphRef.chartInstance.update();
    }
    else{
      e.currentTarget.classList.toggle("strike");
    } 
  }

  render() {
    const { classes } = this.props;
    const {
      totalPayments, totalCADPayments, totalUSDPayments, totalPPLPayment,
      totalMSCPayment, totalZELPayment, totalCHKPayment, totalACHPayment, totalCADAmount, totalUSDAmount,
      achPercent, chkPercent, pplPercent, mscPercent, zelPercent,
      selectedCurrency, selectedView, selectedPayee, payeesList, selectedPayeeId,
      doughnutData, doughnutOptions,
      onPaymentsChange, onClickDate, onFilterChange,
      onUSDClick,
      paymentsData, lineChartOptions, onPaymentsClick, onAmountsClick, payeeEnrollGraphInfo, enrollmentConsumerData
    } = this.props;  
    
    const payData = {
      "BANK DEPOSIT (ACH)": achPercent || 0,
      "CHECK": chkPercent || 0,
      "PAYPAL": pplPercent || 0,
      "ZELLE": zelPercent || 0,
      "INSTANT PAY (P2C)": mscPercent || 0
    }    
    const getPaymentList = this.sortPaymentDataFn(payData);  
    return (
      <>
        <Box className={classes.B2CDataFilter}>
          <Box className='clientDropDown'>
            <TextField
              value={selectedPayeeId}
              select
              variant='outlined'
              size='small'
              style={{ width: '241px', marginRight: 28 }}
              onChange={onPaymentsChange}
            >
              <MenuItem selected={selectedPayeeId == 0} value={0}>
                All Payers
              </MenuItem>
              {payeesList &&
                payeesList.map((payee) => {
                  if (payee.appType === 2) {
                    return (
                      <MenuItem
                        selected={selectedPayeeId == payee.clientId}
                        value={payee.clientId}
                      >
                        {payee.clientName}
                      </MenuItem>
                    );
                  }
                })}
            </TextField>
          </Box>
          <Button
            variant='text'
            color='primary'
            startIcon={<EventIcon />}
            size='small'
            onClick={onClickDate}
          >
            Viewing {onFilterChange}{' '}
          </Button>
        </Box>

        <Paper
          elevation={2}
          style={{
            float: 'left',
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <Grid item container alignItems='flex-start'>
            <Box className={classes.B2CTopHead}>
              <Typography variant='h1'>Payments</Typography>
              <Box className='selectedClientName'>
                <Box
                  title={
                    selectedPayee &&
                    selectedPayee[0] &&
                    selectedPayee[0]['clientName']
                      ? selectedPayee[0]['clientName']
                      : 'All Payers'
                  }
                >
                  {selectedPayee &&
                  selectedPayee.length > 0 &&
                  selectedPayee[0] &&
                  selectedPayee[0]['clientName']
                    ? selectedPayee[0]['clientName']
                    : 'All Payers'}
                </Box>
              </Box>
            </Box>

            <Grid item container xs={3}>
              <Box
                textAlign='center'
                justifyContent='center'
                display='flex'
                flexGrow={1}
                mt={5}
                pb={2}
              >
                {totalCHKPayment ||
                totalACHPayment ||
                totalPPLPayment || totalMSCPayment || totalZELPayment ? (
                <Doughnut
                  id="doughnutChart"
                  width={250}
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
              <Box textAlign='center' width='100%'>
                <h1 className={classes.textNum}>{totalPayments}</h1>
                <span className={classes.dot}> </span>
                <span
                  style={{
                    color: '#4C4C4C',
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Total Payments Made
                </span>
              </Box>
              <Box
                mx='auto'
                pt={2}
                display='flex'
                flexDirection='column'
                alignItems='left'
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
                      onClick={(e)=>this.b2cPaymentLegendClick(e)} 
                      name={item[0]}
                    >
                      <span
                        className={classes.dot}
                        style={{ backgroundColor: item[0] === "ACH"
                          ? "#3F007D"
                          : item[0] === "CHECK"
                          ? "#DADAEB"
                          : item[0] === "PAYPAL"
                          ? "#C5BBDB"
                          : item[0] === "PUSH TO CARD"
                          ? "#9B7FBC"
                          : item[0] === "ZELLE"
                          ? "#6F459C"
                          : null
                        }}
                      >
                        {" "}
                      </span>
                      <span style={{ fontSize: 11, width: 140, fontWeight: 400}}>{item[0]}</span>
                      <span style={{paddingLeft: 60}}>
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
              <Box>
                <Box px={2} ml={2} style={{ borderLeft: `1px solid #8F9EC3` }}>                 
                  <Box display="flex" justifyContent="center">
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
                  </Box>

                  <Box className={classes.topGrphData}>
                    {enrollmentConsumerData?.dates?.length > 0
                      ? payeeEnrollGraphInfo?.currentPeriodText ?? ""
                      : null
                    }                    
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
                                color: 'rgba(18,18,18,0.87)',
                                fontSize: '12px',
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
                                fontSize: '12px',
                                color: 'rgba(18,18,18,0.87)',
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

                      {(selectedView === 'Payment' &&
                        ((selectedCurrency === 'USD' &&
                          (!totalUSDPayments || totalUSDPayments === 0)) ||
                          (selectedCurrency === 'CAD' &&
                            (!totalCADPayments || totalCADPayments === 0)))) ||
                      (selectedView === 'Amount' &&
                        ((selectedCurrency === 'USD' &&
                          (!totalUSDAmount || totalUSDAmount === 0)) ||
                          (selectedCurrency === 'CAD' &&
                            (!totalCADAmount || totalCADAmount === 0)))) ||
                      !paymentsData ||
                      paymentsData === null ? (
                        <Box
                          display='block'
                          textAlign='center'
                          width={1}
                          my={6}
                        >
                          <img
                            alt='no-data'
                            src={require('~/assets/images/nodata.svg')}
                          />

                          <Box
                            py={3}
                            color='#A1A1A1'
                            fontSize={14}
                            display='block'
                          >
                            {' '}
                            No Data to show{' '}
                          </Box>
                        </Box>
                      ) : (
                        <Line
                          id={'paymentsChart'}
                          width={794}
                          height={260}
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
        </Paper>
      </>
    );
  }

}
export default connect((state) => ({ ...state.user, ...state.campaign }))(
  withStyles(styles)(B2CPayments)
);
