import React from "react";
import Clients from "~/modules/Clients";
import ListView from "~/views/Campaigns/ListView/";
import { Box } from "@material-ui/core";
import { connect } from "react-redux";
import SubHeader from "~/components/_SubHeader";
import CardPayers from '~/modules/CardPayers'
import './style.scss';
import { fetchAppType } from "~/redux/helpers/clients";
import { EntityType } from "~/config/entityTypes";
import accessRights from "~/config/accessRights.js";

class ClientsTab extends React.Component {

  constructor(props){
    super(props);
    this.state={
      userType: [],
      isLoading: true,
    }
  }

  componentDidMount=()=>{
    this.getAppType()
  }

  getAppType = () => {
    fetchAppType().then((response) => {
      const { error } = response;
      if (error){
        this.setState({
          isLoading: false
        }, () => {
          return false;
        })        
      }        
      else {
        this.setState({
          userType: response?.data ?? [],
          isLoading: false
        })
      }
    })
  }

    render() {
      const {userType, isLoading} = this.state
      const claims = this.props.permissions.minified;
      const isClientViewAllowed   = (claims && claims.includes(accessRights["CLIENTS_LIST_VIEW"])) || false;
      const isCampaignViewAllowed = (claims && claims.includes(accessRights["CAMPAIGNS_VIEW"])) || false;      
      const isCCUser = Object.keys(userType).length > 0 && userType.includes(EntityType.CARDS ?? false);
      const isCardClientListViewAllowed = (claims && claims.includes(accessRights["CARDS_CLIENTS_LIST"])) || false;
      const isOnlyCCUser = Object.keys(userType).length === 1 && userType.includes(EntityType.CARDS ?? false);

    return (      
      <Box>
        {!isLoading && (
          <SubHeader 
            {...this.props}
            title={"Clients"}
            alias={"Clients"}
            tabs={[
              {
                url: "/clients",
                name: "Clients",
                items: [],
                component: <Clients {...this.props} />,
                alias: "Clients",
                isProtected: true,
                showTab: isClientViewAllowed && !isOnlyCCUser,
              },
              {
                url: "/cardpayers",
                name: "B2B Card Clients",
                items: [],
                component: <CardPayers {...this.props} />,
                alias: "cardPayers",
                isProtected: true,
                showTab: isCCUser && isCardClientListViewAllowed,
              },
              {
                url: "/campaign",
                name: "Campaigns",
                items: [],
                component: <ListView {...this.props} />,
                alias: "Campaigns",
                isProtected: true,
                showTab: isCampaignViewAllowed,
              }
            ]}
          />
        )}        
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user, ...state.permissions }))(
  ClientsTab
);
