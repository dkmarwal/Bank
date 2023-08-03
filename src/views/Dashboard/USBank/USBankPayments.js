import {
  Box,
  Grid,
  Paper,
  TextField,
  withStyles,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import styles from './styles';
import { barChartOptions } from './chartOptions';
import EventIcon from '@material-ui/icons/Event';
import { formatter } from '~/utils/common.js';

export const USBankPayments = (props) => {
  const {
    classes,
    usBankData,
    selectedCurrency,
    selectedView,
    selectedPayee,
    payeesList,
    selectedPayeeId,
    onPaymentsChange,
    onClickDate,
    onFilterChange,
    paymentsData,
    lineChartOptions,
    handlePaymentsAmountClick,
    payeeEnrollGraphInfo,
    enrollmentConsumerData,
    barChartData,
  } = props;
  const { totalAmount, totalPayments } = usBankData ?? {};
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
            <MenuItem selected={selectedPayeeId === 0} value={0}>
              All Payers
            </MenuItem>
            {payeesList &&
              payeesList.map((payee) => {
                if (payee.appType === 2) {
                  return (
                    <MenuItem
                      selected={selectedPayeeId === payee.clientId}
                      value={payee.clientId}
                      key={payee.clientId}
                    >
                      {payee.clientName}
                    </MenuItem>
                  );
                }
                return null;
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

          {!barChartData ? (
            <Grid
              item
              container
              xs={3}
              justifyContent='center'
              style={{ margin: 'auto', marginTop: '8px' }}
            >
              <Box width='100%'>
                <Box px={2} ml={2}>
                  <CircularProgress />
                </Box>
              </Box>
            </Grid>
          ) : (
            <Grid item container xs={12}>
              <Box width='100%'>
                <Box width='100%'>
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
                  <h1 className={classes.textNum}>{totalPayments}</h1>
                </Box>
                <Box px={2} ml={2}>
                  <Box
                    textAlign='center'
                    justifyContent='center'
                    display='flex'
                    flexGrow={1}
                    mt={5}
                    pb={2}
                  >
                    {totalPayments &&
                    barChartData &&
                    Object.keys(barChartData).length ? (
                      <Bar
                        height={350}
                        options={barChartOptions}
                        data={barChartData}
                      />
                    ) : (
                      <Box display='block' textAlign='center' width={1} my={6}>
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
                          No Data to show
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
          <Divider style={{ width: '100%', background: '#8F9EC4' }} />
          {!usBankData ? (
            <Grid
              item
              container
              xs={12}
              justifyContent='center'
              style={{ margin: 'auto', marginTop: '8px' }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <Grid item container xs={12}>
              <Box py={3} width='100%' mt={2}>
                <Box>
                  <Box px={2} ml={2}>
                    <Box display='flex' justifyContent='center'>
                      <span className={classes.flagContainer}>
                        <img
                          src={require(`~/assets/icons/USAFlag.svg`)}
                          alt={'USA Flag'}
                          style={{
                            border: `2px solid #fff`,
                            boxShadow: `0 0 0 2px #002d72`,
                            borderRadius: '100%',
                            backgroundPosition: 'center center',
                          }}
                        />
                        <h3>
                          {selectedView === 'Amount' ? (
                            <Box
                              ml={1}
                              mr={4}
                              fontWeight='normal'
                              fontSize={16}
                              style={
                                selectedCurrency === 'USD'
                                  ? {
                                      color: '#002d72',
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                    }
                                  : {}
                              }
                            >
                              {totalAmount
                                ? `USD ${formatter.format(totalAmount)}`
                                : `USD $0`}
                            </Box>
                          ) : (
                            <Box
                              ml={1}
                              mr={4}
                              fontWeight='normal'
                              fontSize={16}
                              style={
                                selectedCurrency === 'USD'
                                  ? {
                                      color: '#002d72',
                                      fontWeight: 'bold',
                                      fontSize: 16,
                                    }
                                  : {}
                              }
                            >
                              {`USD  ${totalPayments || 0} payment${
                                totalPayments > 1 ? 's' : ''
                              }`}
                            </Box>
                          )}
                        </h3>
                      </span>
                    </Box>

                    <Box className={classes.topGrphData}>
                      {enrollmentConsumerData?.dates?.length > 0
                        ? payeeEnrollGraphInfo?.currentPeriodText ?? ''
                        : null}
                    </Box>

                    <Box width='80%' mx='auto'>
                      <Box display='block' width={1} mb={1}>
                        <span>
                          {selectedView === 'Payment' ? (
                            <Box
                              fontWeight='normal'
                              style={{
                                color: 'rgba(18,18,18,0.87)',
                                fontSize: '12px',
                              }}
                            >
                              {selectedCurrency}
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: '#282828',
                                  fontWeight: 700,
                                  paddingLeft: '4px',
                                }}
                              >
                                ${totalAmount}
                              </span>
                            </Box>
                          ) : (
                            <Box
                              fontWeight='normal'
                              style={{
                                fontSize: '12px',
                                color: 'rgba(18,18,18,0.87)',
                              }}
                            >
                              Payments{' '}
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: '#282828',
                                  fontWeight: 'bold',
                                }}
                              >
                                {totalPayments}
                              </span>
                            </Box>
                          )}
                        </span>
                      </Box>

                      {(selectedView === 'Payment' && !totalPayments) ||
                      (selectedView === 'Amount' && !totalAmount) ||
                      !paymentsData ||
                      !Object.keys(paymentsData).length ? (
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
                            No Data to show
                          </Box>
                        </Box>
                      ) : (
                        <Line
                          id={'paymentsChart'}
                          width={794}
                          height={340}
                          data={paymentsData}
                          options={lineChartOptions}
                          redraW={false}
                        />
                      )}
                    </Box>

                    <Box my={2} display='flex' justifyContent='center'>
                      <span className={classes.tabContainer}>
                        <span
                          onClick={() => handlePaymentsAmountClick('Payment')}
                          className={classes.tab}
                          style={
                            selectedView === 'Payment'
                              ? {
                                  color: 'white',
                                  background: '#0b1941',
                                }
                              : {}
                          }
                        >
                          No. of Payments
                        </span>
                        <span
                          className={classes.tab}
                          style={
                            selectedView === 'Amount'
                              ? {
                                  color: 'white',
                                  background: '#0b1941',
                                }
                              : {}
                          }
                          onClick={() => handlePaymentsAmountClick('Amount')}
                        >
                          Amount
                        </span>
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default connect((state) => ({ ...state.user, ...state.campaign }))(
  withStyles(styles)(USBankPayments)
);
