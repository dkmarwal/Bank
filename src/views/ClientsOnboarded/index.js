import React from "react";
import ClientProfile from "~/modules/ClientProfile";
import ConfigureClientPortal from "~/modules/ConfigureClientPortal";
import B2CConfigureClientPortal from "~/modules/ConfigureClientPortal/B2C/";
import { Route, Switch } from "react-router-dom";
import { Box } from "@material-ui/core";
import ClientsTab from "~/modules/ClientsTab";

class ClientsOnboarded extends React.Component {
    render() {
        return (
            <Box>
                <Switch>
                    <Route exact path="/clients" component={ClientsTab} />
                    <Route exact path="/clients/clientDetail/:clientId" render={(props) => <ClientProfile {...props} />} />
                    <Route exact path="/clients/clientPermissions/:clientId" render={(props) => <ConfigureClientPortal {...props} />} />
                    <Route exact path="/clients/b2c/clientPermissions/:clientId" render={(props) => <B2CConfigureClientPortal {...props} />} />
                </Switch>
            </Box>
        )
    }
}
export default ClientsOnboarded;
