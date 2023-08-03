import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../styles.scss';
import Style from '../styles';
import GridBoxSelect from '~/components/Forms/GridBoxSelect';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RemittanceParams from './remittanceParams';

const RemittanceConfig = (props) => {
  const {
    classes,
    remittanceConfig,
    clientRemittanceConfig,
    onChangeDelivery,
    onChangeFormat,
    remittanceParams,
    remittanceScheme,
    onRemittanceSchemeChange,
    onChangeParameter,
    remittanceFormat,
  } = props;
  return (
    <>
    <Grid container item xs={12} spacing={3}>
        <Grid container item xs={12}>
          <Typography className={classes.genralTitleBold}>
            Remittance System*
          </Typography>
        </Grid>
        <Grid container item spacing={2}>
          {remittanceScheme.map(({ id, label,selected },index) => {
            return (
              <Grid key={id} item xs={12} sm={6} md={3}>
                <GridBoxSelect
                  name={id}
                  label={label}
                  checked={selected}
                  onChange={onRemittanceSchemeChange}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={3}>
        <Grid container item xs={12}>
          <Typography className={classes.genralTitleBold}>
            Remittance Delivery Mode*
          </Typography>
        </Grid>
        <Grid container item spacing={2}>
          {remittanceConfig.map(({ rmtDeliveryOptionId, description }) => {
            let checked = false;
            if (Array.isArray(clientRemittanceConfig[rmtDeliveryOptionId])) {
              checked = clientRemittanceConfig[rmtDeliveryOptionId].length > 0;
            }
            return (
              <Grid key={rmtDeliveryOptionId} item xs={12} sm={6} md={3}>
                <GridBoxSelect
                  name={rmtDeliveryOptionId}
                  label={description}
                  checked={checked}
                  onChange={onChangeDelivery}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={5}>
        <Grid container item xs={12}>
          <Typography className={classes.genralTitleBold}>
            Remittance Format for Download and Email*
          </Typography>
        </Grid>
        <Grid container item spacing={3}>
          {remittanceFormat.map(({ formatId, selected, description },index) => (
            <>
              <Grid container item spacing={2}>
                <Grid key={formatId} item xs={12} sm={6} md={3}>
                  <GridBoxSelect
                    name={formatId}
                    label={description}
                    checked={selected}
                    onChange={(checked, event) =>
                      onChangeFormat(formatId, selected,index)
                    }
                  />
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={3}>
        <Grid container item xs={12}>
          <Typography className={classes.genralTitleBold}>
            Remittance Parameters
          </Typography>
        </Grid>
        <RemittanceParams
          remittanceParams={remittanceParams}
          onChangeParameter={onChangeParameter}
        />
      </Grid>
    </>
  );
};

export default withStyles(Style)(RemittanceConfig);
