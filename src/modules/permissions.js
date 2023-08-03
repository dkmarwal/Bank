import React, { Fragment } from 'react';
import {
    Grid,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,FormControlLabel, Checkbox, FormLabel, FormGroup
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    formLabel: {
        textAlign: "left",
        marginLeft: "20px",
        marginTop: "10px",
        fontSize: "0.9rem",
    },
});

const Permissions = (props) => {
    const { classes, permissionOptions, permissionsGranted, onChangePermission } = props;

    const PermissionAccessItem = ({ label, options }) => {
        const accessOptions = options.map(({ AccessRightMappingId, Description, DisplayOrder }) => {
            return (
                <FormControlLabel
                    key={AccessRightMappingId}
                    control={
                        <Checkbox
                            name={Description}
                            value={AccessRightMappingId}
                            checked={permissionsGranted && permissionsGranted.length > 0 ? permissionsGranted.includes(AccessRightMappingId) : false}
                            onChange={onChangePermission}
                            color="primary"
                        />
                    }
                    label={Description}
                />
            );
        });

        return (
            <React.Fragment>
                <Grid item xs={12} sm={4} align="center">
                    <FormLabel className={classes.formLabel} component="legend">
                        {label}
                    </FormLabel>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <FormGroup aria-label="position" row>
                        {accessOptions}
                    </FormGroup>
                </Grid>
            </React.Fragment>
        );
    };

    const getRolePermissionsOptionList = permissionOptions.length > 0 && permissionOptions.map(({ AccessGroup, RightsGroup }) => {
        return (
            <ExpansionPanel key={AccessGroup}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography>{AccessGroup}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="row">
                        {RightsGroup.map(({ AccessName, Rights }) => (
                            <Grid container direction="row" key={AccessName}>
                                <PermissionAccessItem
                                    key={AccessName}
                                    label={AccessName}
                                    options={Rights}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    });
    return (
        <Fragment>
            {getRolePermissionsOptionList}
        </Fragment>
        )
}

export default withStyles(styles)(Permissions);
