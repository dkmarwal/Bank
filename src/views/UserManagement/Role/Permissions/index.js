import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import RolesPermission from './rolesPermission';
import { fetchAccessRights, fetchPermissions, createRole, updateRole, fetchRoles } from "~/redux/actions/role";
import Notification from '~/components/Notification';
import { AlertDialog } from "~/components/Dialogs";
import config from '~/config'
import trim from 'deep-trim-node';

class Permissions extends React.Component {

    constructor(props) {
        super(props);
        const { state } = this.props.location;
        this.state = {
            selected: state,
            validation: {},
            rolePermissionOptions: [],
            permissionsGranted: [],
            roleList: [],
            sourceRoleId: null,
            currentPermissionIds: [], //
            alertType: "success",
            alertMessage: "",
            alertMessageCallbackType: null,
            updateProgress: false,
        };
    }

    hideAlertMessage = () => {
        this.setState({
            alertMessage: null,
            alertType: null,
            alertMessageCallbackType: null,
        })
    }

    fetchAccessRightsList = () => {
        const { info } = this.props.user;
        this.props.dispatch(fetchAccessRights({ portalTypeId: info.portalTypeId })).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.role.error
                });
                return false;
            }
            this.setState({
                rolePermissionOptions: this.props.role.accessRights
            })
        });
    }

    fetchRolePermissions = () => {
        const { info } = this.props.user;
        this.props.dispatch(fetchPermissions(info.portalProfileId, this.state.selected.roleId)).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.role.error
                });
                return false;
            }
            this.setState({
                permissionsGranted: this.props.role.permissions || [],
                currentPermissionIds: this.props.role.permissions || []
            })
        });
    }

    fetchPermissionsByRoleId = (roleId) => {
        const { info } = this.props.user;
        this.props.dispatch(fetchPermissions(info.portalProfileId, roleId)).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.role.error
                });
            }
            this.setState({
                permissionsGranted: this.props.role.permissions || [],
            })
        });
    }

    fetchRoleList = () => {
        const { info } = this.props.user;
        this.props.dispatch(fetchRoles({ portalProfileId: info.portalProfileId, portalTypeId: info.portalTypeId, userId: info.userId })).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.role.error
                });
                return false;
            }

            this.setState({
                roleList: this.props.role.list
            });
        });
    }

    componentDidMount() {
        this.fetchAccessRightsList();
        this.fetchRoleList();
        if (this.state.selected.roleId !== '') {
            this.fetchRolePermissions();
        }
    }

    goBack = () => {
        this.setState({
            alertMessage: null,
            alertMessageCallbackType: null,
        });
        this.backToRolesScreen();
    }

    backToRolesScreen = () => {
        this.props.history.push(`${config.baseName}/manage/user/role`);
    };

    createUserRoles = () => {
        const { info,isPayeeChoicePortal } = this.props.user;
        const data = {
            roleName: this.state.selected.roleName,
            permissions: this.state.permissionsGranted,
            portalTypeId: info.portalTypeId,
            portalProfileId: info.portalProfileId,
            description: this.state.selected.roleDescription
        };
        this.props.dispatch(createRole(trim(data))).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    updateProgress: false,
                    alertMessage: this.props.role.error
                });
                return false;
            } else {
                this.setState({
                    alertType: "success",
                    alertMessage: isPayeeChoicePortal ? "New role added successfully" :"New Role Added Successfully",
                    updateProgress: false,
                    alertMessageCallbackType: "REDIRECT",
                });
                //this.backToRolesScreen();
            }
        });
    }
    editUserRoles = () => {
        const { info } = this.props.user;
        const data = {
            roleName: this.state.selected.roleName,
            permissions: this.state.permissionsGranted,
            roleId: this.state.selected.roleId,
            portalProfileId: info.portalProfileId,
            description: this.state.selected.roleDescription
        };
        this.props.dispatch(updateRole(trim(data))).then((response) => {
            if (!response) {
                this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    updateProgress: false,
                    alertMessage: this.props.role.error
                });
                return false;
            } else {
                this.setState({
                    alertType: "success",
                    updateProgress: false,
                    alertMessage: "Role Updated Successfully",
                    alertMessageCallbackType: "REDIRECT",
                });
                //this.backToRolesScreen();
            }
        });
    }

    saveBtnClicked = () => {
        const valid = this.validate();
        if (!valid) {
            return false;
        }

        if (this.state.selected.isNewRole) {
            this.setState({ updateProgress: true }, () => {
                this.createUserRoles();
            });

        } else {
            this.setState({ updateProgress: true }, () => {
                this.editUserRoles();
            });

        }
    };

    validate = () => {
        const selectedRole = this.state.selected;
        let valid = true;
        let validation = {};
        if (!selectedRole.roleName || selectedRole.roleName.trim().length === 0) {
            validation["roleName"] = "Role name is required.";
            valid = false;
        }
        const str1 = selectedRole.roleName.replace(/[^a-zA-Z0-9]/g, '');
        const str2 = selectedRole.roleName.replace(/^0+/, "");
        if (!isNaN(selectedRole.roleName) || str1.trim().length === 0 || str2.trim().length === 0) {
            validation["roleName"] = "Please enter valid role name.";
            valid = false;
        }
        if (!selectedRole.roleDescription || selectedRole.roleDescription.trim().length === 0) {
            validation["roleDescription"] = "Role description is required.";
            valid = false;
        }
        this.setState({ validation: { ...validation } });
        return valid;
    }

    /*
        copy permission for selected roles drop down
    */
    handleCopyPermission = (event) => {
        const sourceRoleId = event.target.value;
        this.setState({
            sourceRoleId: sourceRoleId
        }, () => {
            if (sourceRoleId) {
                this.fetchPermissionsByRoleId(sourceRoleId);
            }
        }
        );
    }

    onRoleChange = (event) => {
        this.setState({
            selected: { ...this.state.selected, [event.target.name]: event.target.value }
        });
    }

    onClearAllPermissions = (event) => {
        this.setState({
            permissionsGranted: []
        });
    }

    flatten = (arr) => {
        return arr.reduce((flat, next) =>
            flat.concat(Array.isArray(next) ? this.flatten(next) : next), []);
    };

    onSaveAllPermissions = (event) => {
        const { rolePermissionOptions } = this.state;
        const allPermissions = this.flatten(rolePermissionOptions.map(({ RightsGroup }) => (
            RightsGroup.map(({ Rights }) => (
                Rights.map(({ AccessRightMappingId }) => {
                    return AccessRightMappingId
                })
            ))
        )));

        this.setState({ permissionsGranted: allPermissions });
    }

    onGroupSelection = (event, rightsGroup) => {
        const { permissionsGranted } = this.state;
        let newPermissions = [];
        const allGroupPermissons = this.flatten(rightsGroup.map(({ Rights }) => (
            Rights.map(({ AccessRightMappingId }) => {
                return AccessRightMappingId
            })
        )));
        if (event.target.checked) {
            newPermissions = new Set([...permissionsGranted, ...allGroupPermissons]);
        } else {
            newPermissions = permissionsGranted && permissionsGranted.filter(item => allGroupPermissons.indexOf(item) == -1)
        }

        this.setState({ permissionsGranted: [...newPermissions] });
    }

    onChangePermission = (event) => {
        const { name, type, value, checked } = event.target;
        const currentPermissionIDs = this.state.permissionsGranted;
        let permissionIDs;
        if (checked) {
            permissionIDs = ([...currentPermissionIDs, parseInt(value)])
        }
        else {
            let index = currentPermissionIDs.indexOf(parseInt(value));
            if (index > -1) {
                permissionIDs = currentPermissionIDs.splice(index, 1);
            }
            permissionIDs = currentPermissionIDs;
        }
        this.setState({
            permissionsGranted: permissionIDs
        });
    }

    render() {
        const { roleList, sourceRoleId, alertType, alertMessage, alertMessageCallbackType, updateProgress } = this.state;
        return (
            <Fragment>
                <RolesPermission
                    roleList={roleList}
                    saveBtnClicked={this.saveBtnClicked}
                    backToRolesScreen={this.backToRolesScreen}
                    sourceRoleId={sourceRoleId}
                    selectedRole={this.state.selected}
                    onRoleChange={this.onRoleChange}
                    validation={this.state.validation}
                    rolePermissionOptions={this.state.rolePermissionOptions}
                    permissionsGranted={this.state.permissionsGranted}
                    onSaveAllPermissions={this.onSaveAllPermissions}
                    onClearAllPermissions={this.onClearAllPermissions}
                    onChangePermission={this.onChangePermission}
                    handleCopyPermission={this.handleCopyPermission}
                    onGroupSelection={this.onGroupSelection}
                    updateProgress={updateProgress}
                />
                {alertMessage && this.renderAlertMessage('', alertMessage, alertMessageCallbackType)}
            </Fragment>
        );
    }

    renderSnackbar = (type, message) => {
        return <Notification variant={type} message={message} handleClose={this.hideAlertMessage} />
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
export default connect(state => (
    { ...state.user, ...state.role }
))(Permissions);