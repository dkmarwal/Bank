import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom';
import SubHeader from '~/components/SubHeader/Reports/';
import ListView from './Report/ListView/';
import ReportEdit from './Report/EditView/';
import ReportAdd from './Report/AddView/';
import ReportView from './Report/View/';
import PayeeAuditReport from "./Report/View/PayeeAuditReport"
import { withStyles } from '@material-ui/styles';
import config from '~/config'
import accessRights from '~/config/accessRights.js';

import styles from './styles';

class AuthRoute extends Component {

    isAllowed(claims, name) {
        //return true;

        const permissions = claims;
        const accessId = accessRights[name] || null;
        const isEnabled = accessId && permissions && permissions.includes(accessId);
        if (isEnabled) {
            return true
        }
        return false;
    }

    render() {
        const { component: Component, name, claims, title, alias, ...rest } = this.props;
        const isAccessable = this.isAllowed(claims, name);
        return (
            <Route exact={true} {...rest} render={(props) => (
                (isAccessable === true) ?
                    <Fragment>
                        <SubHeader {...props} title={title} alias={alias} claims={claims} />
                        <Component {...props} />
                    </Fragment>
                    : null
            )} />
        )
    }
}

class Reports extends Component {
    render() {
        const { user, classes, claims } = this.props;
        //const claims = user.userRoles;
        return (
            <div className={classes.root}>
                <Fragment>
                    <Switch>
                        <AuthRoute exact path={`${config.baseName}/reports`} component={ListView} claims={claims} name={"REPORTS_VIEW"} title="Reports" alias="REPORTS_VIEW" />
                        <AuthRoute exact path={`${config.baseName}/reports/add`} component={ReportAdd} claims={claims} name={"REPORTS_DYNAMIC_CREATE"} title="Reports" alias="REPORTS_DYNAMIC_CREATE" />
                        <AuthRoute exact path={`${config.baseName}/reports/edit`} component={ReportEdit} claims={claims} name={"REPORTS_DYNAMIC_EDIT"} title="Reports" alias="REPORTS_DYNAMIC_EDIT" />
                        <AuthRoute exact path={`${config.baseName}/reports/view`} component={ReportView} claims={claims} name={"REPORTS_VIEW"} title="Reports" alias="REPORTS_VIEW" />
                        <AuthRoute exact path={`${config.baseName}/reports/view/payeeauditreport`} component={PayeeAuditReport} claims={claims} name={"REPORTS_VIEW"} title="Reports" alias="PAYEE_AUDIT_REPORT" />
                    </Switch>
                </Fragment>
            </div>
        )
    }
}

export default withStyles(styles)(Reports);