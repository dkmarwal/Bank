import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../styles.scss';
import Style from '../styles';
import GridBoxSelect from '~/components/Forms/GridBoxSelect';
import Grid from '@material-ui/core/Grid';

const RemittanceParams = (props) => {
  const { remittanceParams, onChangeParameter } = props;
  const {
    isPaymentId,
    isPaymentType,
    isValueDate,
    isPaymentReference,
    isAmount,
    isAmountPaid,
    isClientName,
    isPayeeName,
    isPaymentDate,
    isNotes,
    isClientPhoneNumber,
    isClientEmailAddress
  } = remittanceParams;
  return (
    <Grid container item spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isPaymentId'}
          label={'Payment ID'}
          checked={Boolean(isPaymentId)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isPaymentType'}
          label={'Payment Type'}
          checked={Boolean(isPaymentType)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isAmount'}
          label={'Amount'}
          checked={Boolean(isAmount)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isPaymentDate'}
          label={'Payment Date'}
          checked={Boolean(isPaymentDate)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isPaymentReference'}
          label={'Payment Reference'}
          checked={Boolean(isPaymentReference)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isPayeeName'}
          label={'Payee Name'}
          checked={Boolean(isPayeeName)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isClientName'}
          label={'Client Name'}
          checked={Boolean(isClientName)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isValueDate'}
          label={'Value Date'}
          checked={Boolean(isValueDate)}
          onChange={onChangeParameter}
        />
      </Grid>
      {1===0 &&<Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isAmountPaid'}
          label={'Amount Paid'}
          checked={Boolean(isAmountPaid)}
          onChange={onChangeParameter}
      />
      </Grid>}
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isNotes'}
          label={'Notes'}
          checked={Boolean(isNotes)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isClientPhoneNumber'}
          label={'Client Phone Number'}
          checked={Boolean(isClientPhoneNumber)}
          onChange={onChangeParameter}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <GridBoxSelect
          name={'isClientEmailAddress'}
          label={'Client Email Address'}
          checked={Boolean(isClientEmailAddress)}
          onChange={onChangeParameter}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(Style)(RemittanceParams);
