import React from "react";
import { Grid, Card, Box, Button, CircularProgress, Typography } from "@material-ui/core";
import {  getNotifications, setNotification } from '~/redux/actions/notifications';
import { AlertDialog } from "~/components/Dialogs/index";
import CheckboxGroup from "~/components/Forms/CheckboxGroup";
import { connect } from "react-redux";

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            isLoading: true,
            fetchingList: true,
            alertMessage: "",
            alertMessageCallbackType: null,
            updateProgress:false,
        }
    }

    componentDidMount() {
        this.fetchNotification();
    }

    fetchNotification = () => {
        this.setState({
            fetchingList: true
        }, () => {
            const { info } = this.props.user;
            this.props.dispatch(getNotifications({ userId: info.userId, portalTypeId: info.portalTypeId })).then((response) => {
                if (!response) {
                    this.setState({
                        alertType: "error",
                        alertMessage: this.props.notification.error,
                        alertMessageCallbackType: null,
                        isLoading: false,
                        fetchingList: false,
                    });
                    return false;
                }

                this.setState({
                    isLoading: false,
                    fetchingList: false,
                    details: this.props.notification.details,
                })
            })
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
        let notificationData = [];
        this.setState({ btnLoader: true }, () => {
            this.state.notiListData.forEach(obj => {
                obj.notificationTypes.forEach(type => {
                    notificationData.push({
                        "notificationTypeId": type.notificationTypeId,
                        "notificationGroupId": obj.notificationGroupId,
                        "isActive": type.isActive == true ? 1 : 0
                    })
                })
            })

            let payload = {
                "userId": userId,
                "portalTypeId": 3,
                "portalProfileId": portalProfileId,
                "notificationData": notificationData
            }
            setNotification(payload).then(response => {
                this.setDialogMessage(response.message);
                this.setState({ btnLoader: false })
            })
        })
    }

    handleSubmit = () => {
        const { details } = this.state;

        this.setState({
            updateProgress: true,
        }, () => {
            const { info } = this.props.user;
            let notificationData = [];
            details && details.forEach(obj => {
                obj.notificationTypes && obj.notificationTypes.forEach(type => {
                    notificationData.push({
                        "notificationTypeId": type.notificationTypeId,
                        "notificationGroupId": obj.notificationGroupId,
                        "isActive": type.isActive
                    })
                })
            })
            this.props
                .dispatch(
                    setNotification({
                        userId: info.userId,
                        portalTypeId: info.portalTypeId,
                        portalProfileId: info.portalProfileId,
                        notificationData: notificationData
                    })
                )
                .then((response) => {
                    if (!response) {
                        this.setState({
                            alertMessage: this.props.notification.error,
                            alertMessageCallbackType: null,
                            updateProgress: false
                        });
                        return false;
                    }

                    this.setState({
                        updateProgress: false,
                        showDetail: false,
                        editDetail: false,
                        alertMessage: "Notifications updated successfully.",
                        alertMessageCallbackType: null,
                    });
                });
        });
    }

    handleChange = (itemIndex, res, value) => {
        const {details} = this.state;
        const newData = [...details];
        newData.forEach((obj) => {
            obj.notificationTypes && obj.notificationTypes.forEach((item, index) => {
                if(item.notificationTypeId == res.notificationTypeId ) {
                    item.isActive = value.value;
                }
            })
        })
        this.setState({ details:[...newData] });
    }

    hideAlertMessage = () => {
        this.setState({
            alertMessage: null,
            alertMessageCallbackType: null,
        })
    }

    goBack = () => {
        this.setState({
            alertMessage: null,
            alertMessageCallbackType: null,
        })
    }

    render() {
        const { alertMessage, alertMessageCallbackType, details, isLoading, updateProgress } = this.state;

        if (isLoading) {
            return <Box display="flex" p={10} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
        }
        return (
            <Box m={5}>
                <Card>
                  <Box style={{margin: "0 auto", display: "table"}}>
                    <Grid xs={12}>
                        {
                            details && details.map((detail, parentIndex) => {
                                return (
                                     detail.notificationTypes && detail.notificationTypes.length> 0? <Box m={5}>
                                        <h4>{detail.description}</h4>
                                        {
                                            detail.notificationTypes && detail.notificationTypes.map((res, index) => {
                                                return (
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" p={1} key={res.index}>
                                                        <Typography variant='body1'>{res.notificationName}</Typography>
                                                        <Box p={1} width={"175px"}>
                                                            <CheckboxGroup
                                                              options={[
                                                                {
                                                                  label: "On",
                                                                  value: 1,
                                                                },
                                                                {
                                                                  label: "Off",
                                                                  value: 0,
                                                                },
                                                              ]}
                                                              onChange={(value, index, event) => this.handleChange(index, res, value)}
                                                              selectedOption={res.isActive || 0}
                                                            />
                                                        </Box>
                                                    </Box>
                                                );
                                            })
                                        }
                                    </Box>:null
                                )
                            })
                        }

                    </Grid>
                     {details && details.length> 0 &&<Grid xs={12}>
                        <Box display="flex" justifyContent="center" p={3}>
                           {updateProgress ? (
                              <CircularProgress color="primary" />
                            ) : (
                                <Button variant="contained" color="primary" onClick={()=> this.handleSubmit()} >
                                  Save
                                </Button>
                              )}
                        </Box>
                    </Grid>
                     }
                    </Box>
                </Card>
                {alertMessage && this.renderAlertMessage('', alertMessage, alertMessageCallbackType)}
            </Box>
        )
    }

    renderAlertMessage = (title, message, callbackType) => {
        return <AlertDialog
            dialogClassName={"alert-dialoge-root"}
            title={title}
            message={message}
            onConfirm={() => { callbackType === 'REDIRECT' ? this.goBack() : this.hideAlertMessage() }}
        />
    }
}

export default connect((state) => ({
    ...state.user,
    ...state.notification
}))(Notifications);
