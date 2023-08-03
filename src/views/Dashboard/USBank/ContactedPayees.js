import React from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Typography,
  withStyles,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import PayeeDetail from '~/components/PayeeDetail';
import styles from './styles';
import { barChartOptions } from './chartOptions';

export const ContactedPayees = (props) => {
  const {
    selectedPayee,
    fileType,
    payeeEnrollGraphInfo,
    enrollmentConsumerData,
    viewAllStatus,
    mixedGraphData,
    mixedGraphOpt,
    handleAllStatus,
    handleFileType,
    classes,
    totalPaymentCount,
    enrolledPayeesBarChartData,
    isPayeeChoicePortal,
  } = props;
  return (
    <Grid item xs={12} sm={12}>
      <Box my={3}>
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
            <Grid item container className={classes.B2CBottomGraph}>
              <h1 className={classes.headingNew}>Contacted Payees</h1>

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

              {!isPayeeChoicePortal && (
                <Grid item xs={4} className='fileType'>
                  <TextField
                    value={fileType}
                    select
                    variant='outlined'
                    size='small'
                    style={{ width: '200px' }}
                    onChange={(e) => handleFileType(e)}
                  >
                    <MenuItem value='ALL'>All Files</MenuItem>

                    <MenuItem value='CAMPAIGN'>Campaign Files</MenuItem>

                    <MenuItem value='COMBO'>Combo Files</MenuItem>
                  </TextField>
                </Grid>
              )}
            </Grid>
            <Grid container>
              {!enrolledPayeesBarChartData ? (
                <Grid
                  item
                  xs={12}
                  justifyContent='center'
                  style={{ margin: 'auto', paddingLeft: '100px' }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Box width={'100%'}>
                    <Box width='100%'>
                      <span className={classes.dot}> </span>
                      <span
                        style={{
                          color: '#4C4C4C',
                          fontSize: 16,
                          fontWeight: 500,
                        }}
                      >
                        Payment Preferences shared | Enrolled
                      </span>
                      <h1 className={classes.textNum}>
                        {totalPaymentCount ?? 0}
                      </h1>
                    </Box>
                    <Box
                      display='flex'
                      width={1}
                      mt={3}
                      justifyContent='flex-end'
                    >
                      <Grid container>
                        <Grid item xs={12}>
                          <Box>
                            {Boolean(Number(totalPaymentCount)) ? (
                              <Box className={classes.B2CEnrollDoughnutChrt}>
                                <Bar
                                  height={350}
                                  data={enrolledPayeesBarChartData}
                                  options={barChartOptions}
                                />
                              </Box>
                            ) : (
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
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Divider style={{ width: '100%', background: '#8F9EC4' }} />
            <Grid container>
              {!enrollmentConsumerData ? (
                <Grid
                  item
                  xs={12}
                  style={{
                    margin: 'auto',
                    paddingLeft: '339px',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Box className={classes.B2CPayeeGraph}>
                    <Grid item xs={12}>
                      <Box className={classes.payeeGraphTitles}>
                        <Typography variant='h3'>
                          Payees Enrollment Status
                        </Typography>

                        {enrollmentConsumerData?.dates?.length > 0 ? (
                          <>
                            <Typography variant='subtitle2'>
                              {payeeEnrollGraphInfo?.currentPeriodText ?? ''}
                            </Typography>

                            <Box className='viewAllStatus'>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={viewAllStatus}
                                    onChange={(e) => handleAllStatus(e)}
                                    name='viewAllStatus'
                                    color='primary'
                                  />
                                }
                                label='View All Status'
                              />
                            </Box>
                          </>
                        ) : null}
                      </Box>

                      {enrollmentConsumerData?.dates?.length > 0 ? (
                        <Box className={classes.mixedGraph}>
                          <Typography variant='h3'>Number of Payees</Typography>
                          <Box className='GraphHolder'>
                            <Bar
                              data={mixedGraphData}
                              options={mixedGraphOpt}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          py={10}
                          color='#A1A1A1'
                          fontSize={14}
                          display='block'
                          textAlign='center'
                          mb={4}
                        >
                          <img
                            src={require('~/assets/images/nodata.svg')}
                            alt=''
                            height={90}
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
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>

            {payeeEnrollGraphInfo?.difference?.length > 0 &&
              enrollmentConsumerData?.dates?.length > 0 && (
                <Grid container>
                  <Grid item xs={12} className={classes.payeGraphDiffBox}>
                    <Box className={classes.PayeeDetailBox}>
                      <Box className='box'>
                        <PayeeDetail
                          data={payeeEnrollGraphInfo?.difference ?? []}
                        />
                      </Box>

                      <Typography variant='h4' className='bottomTxt'>
                        {payeeEnrollGraphInfo?.currentPeriodText &&
                          payeeEnrollGraphInfo?.previousPeriodText && (
                            <>
                              Change in {payeeEnrollGraphInfo.currentPeriodText}{' '}
                              vs Previous Period (
                              {payeeEnrollGraphInfo.previousPeriodText})
                            </>
                          )}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}
          </Grid>
        </Paper>
      </Box>
    </Grid>
  );
};

export default withStyles(styles)(ContactedPayees);
