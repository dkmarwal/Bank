import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom';
import ListView from './ListView/';
import AddView from './Launch/';

import { withStyles } from '@material-ui/styles';
import styles from './styles';

class AuthRoute extends Component {

    constructor(props) {
        super(props);
        this.state = { title: this.props.title }
    }

    isAllowed(claims, name) {
        return true        
    }

    handleChangeTitle = (title) => {
        this.setState({ title: title });
    }

    render() {
        const { component: Component, name, claims, alias, title, ...rest } = this.props;        
        const isAccessable = this.isAllowed(claims, name);
        return (
            <Route exact={true} {...rest} render={(props) => (
                (isAccessable === true) ?
                    <Fragment>
                        <Component {...props} title={title} handleChangeTitle={this.handleChangeTitle} />
                    </Fragment>
                    : null
            )} />
        )
    }
}

class CampaignLaunchTab extends Component {
    render() {
        const { claims, classes } = this.props;

        return (
            <div className={classes.root}>
                <Fragment>
                    <Switch>
                        <AuthRoute exact path='/campaign' component={ListView} claims={claims} name={"campaign_view"} title="Campaigns" alias="campaign" />
                        <AuthRoute exact path='/campaign/launch' component={AddView} claims={claims} name={"campaign_add"} title="Campaigns" alias="campaign" />
                    </Switch>
                </Fragment>
            </div>
        )
    }
}

export default withStyles(styles)(CampaignLaunchTab);
