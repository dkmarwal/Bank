import {
    Box
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import Enrolled from "./Enrolled";
import Pending from "./Pending";
import Declined from "./Declined";
import SubHeader from "~/components/_SubHeader";
import accessRights from "~/config/accessRights.js";

class Payees extends Component {
    render() {
        const claims = this.props.permissions.minified;
        const isPayeesViewAllowed   = (claims && claims.includes(accessRights["PAYEES_LIST_VIEW"])) || false;
        return (
            <Box>
                <SubHeader
                    {...this.props}
                    title={"Card Payees"}
                    alias={"Card Payees"}
                    tabs={[
                        {
                            url: "/enrolled",
                            name: "Enrolled",
                            items: [],
                            component: <Enrolled {...this.props} />,
                            alias: "Enrolled",
                            isProtected: true,
                            showTab: isPayeesViewAllowed,
                        },
                        {
                            url: "/pending",
                            name: "Pending",
                            items: [],
                            component: <Pending {...this.props} />,
                            alias: "Pending",
                            isProtected: true,
                            showTab: isPayeesViewAllowed,
                        },
                        {
                            url: "/declined",
                            name: "Declined",
                            items: [],
                            component: <Declined {...this.props} />,
                            alias: "Declined",
                            isProtected: true,
                            showTab: isPayeesViewAllowed,
                        },
                    ]}
                />
            </Box>

        );
    }
}

export default connect((state) => ({ ...state.user, ...state.campaign, ...state.permissions }))((Payees)
);
