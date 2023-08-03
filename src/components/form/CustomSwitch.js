import React from 'react';
import { makeStyles, Grid, FormLabel, FormGroup, Switch } from "@material-ui/core";

const useStyle = makeStyles({
    root: {
        margin: '10px 10px 10px',
    }
})

const CustomSwitch = ({ id, name, label, checked = false, onChangeHandler, editMode = true, error = '', ...restProps }) => {
    const disabled = editMode ? false : true;
    const classes = useStyle();
    return (
        <Grid container item sm={12} xs={12} lg={6} key={name} direction="row">
            <Grid item xs={9} sm={9} >
                <FormLabel className={classes.formLabel} component="legend">
                    {label}
                </FormLabel>
            </Grid>
            <Grid item xs={3} sm={3}>
                <FormGroup aria-label="position" row>
                    <Switch
                        id={id}
                        checked={checked}
                        onChange={onChangeHandler}
                        color="primary"
                        name={name}
                        disabled={disabled}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        {...restProps}
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
};

export default CustomSwitch;
