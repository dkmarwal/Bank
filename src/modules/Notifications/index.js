import React from "react";
import { Grid, Card, Box, Button, CircularProgress } from "@material-ui/core";
import { getNotifications, setNotification } from "../../redux/helpers/notifications";
import { AlertDialog } from "~/components/Dialogs/index"
import { connect } from "react-redux";
import "./styles.scss";

class Notifications extends React.Component {
    state = {
        notiListData: null,
        userDetails: {},
        btnLoader: false,
        setNoti: {
            notificationTypes: []
        }
    }

    componentDidMount() {
        const portalTypeId = 1;
        const { userId } = this.props.user.info;
        getNotifications(userId, portalTypeId).then(response => {
            if (response.error) {
                this.props.setDialogMessage(true, response.message);
                return false;
            }
            response.data.map((obj) => {
                obj.notificationTypes.map((o) => {
                    o.status = true;
                })
            })
            this.setState({ notiListData: response.data })
        })
    }


    setDialogMessage(message) {
        this.setState({ message: message, flag: true })
    }

    hideDialogMessage() {
        this.setState({ flag: false, message: "" })
    }

    saveDetails = () => {
        const { userId, portalProfileId } = this.props.user.info;
        const notificationData = [];
        this.setState({ btnLoader: true }, () => {
            this.state.notiListData.forEach(obj => {
                obj.notificationTypes.forEach(type => {
                    notificationData.push({
                        "notificationTypeId": type.notificationTypeId,
                        "notificationGroupId": type.notificationGroupId,
                        "isActive": type.isActive == true ? 1 : 0
                    })
                })
            })

            const payload = {
                "userId": userId,
                "portalTypeId": 1,
                "portalProfileId": portalProfileId,
                "notificationData": notificationData
            }
            setNotification(payload).then(response => {
                this.setDialogMessage(response.message);
                this.setState({ btnLoader: false })
            })
        })
    }
    onSiteChanged = (res) => {
        res.status = !res.status;
        this.setState({ ...this.state });
    }

    render() {
        const { flag, message } = this.state;
        return (
            <Box m={5}>
                <Card>
                  <Box style={{margin: "0 auto", display: "table"}}>
                    <Grid xs={6}>
                        {
                            this.state.notiListData && Object.keys(this.state.notiListData).map((rs) => {
                                return (
                                    <Box m={5}>
                                        <h4>{this.state.notiListData[rs].description}</h4>
                                        {
                                            this.state.notiListData[rs].notificationTypes.map((res, index) => {
                                                return (
                                                    <div className="notifiRow" key={res.index}>
                                                        <label key={res.index}>{res.notificationName}</label>

                                                        <div className="switch">
                                                            <input
                                                                type="radio"
                                                                className="switch-input"
                                                                readOnly={false}
                                                                onChange={() => this.onSiteChanged(res)}
                                                                name={res.notificationName}
                                                                value={res.notificationTypeId}
                                                                id={res.notificationTypeId}
                                                                checked={res.status} 
                                                            />
                                                            <label htmlFor={res.notificationTypeId} className="switch-label switch-label-off">ON</label>
                                                            <input
                                                                type="radio"
                                                                className="switch-input"
                                                                name={res.notificationName}
                                                                readOnly={false}
                                                                value={res.notificationTypeId + 'off'}
                                                                id={res.notificationTypeId + 'off'}
                                                                checked={!res.status}
                                                                onChange={() => this.onSiteChanged(res)}
                                                            />
                                                            <label
                                                                htmlFor={res.notificationTypeId + 'off'}
                                                                className="switch-label switch-label-on">OFF
                                                            </label>
                                                            <span className="switch-selection"></span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </Box>
                                )
                            })
                        }

                    </Grid>
                    <Grid xs={12}>
                        <Box my={12}>
                            <div style={{
                                justify: "center",
                                margin: "0 auto",
                                display: "table"
                            }}>
                                {/* <Box px={5}>
                                    <Button
                                        variant="contained"
                                        style={{ display: "inline-block", float: "left", padding: "6px 10px", width: "120px", margin: "0px 10px 0 0" }}
                                        color=""
                                    // onClick={onCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Box> */}

                                <Box px={2}>
                                    {false ?
                                        <CircularProgress color="primary" /> :
                                        <Button
                                            variant="contained"
                                            style={{ display: "inline-block", padding: "6px 10px", width: "120px", margin: "0px 10px 0 0" }}
                                            color="primary"
                                            onClick={() => this.saveDetails()}
                                        >
                                            Save
                                    </Button>}
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    </Box>
                </Card>

                {
                    flag &&
                    <AlertDialog
                        title={message}
                        onConfirm={this.hideDialogMessage.bind(this)}
                    />
                }
            </Box>
        )
    }
}

export default connect((state) => ({
    ...state.user,
    ...state.clientConfig
}))(Notifications);
