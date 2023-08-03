const initialState = {
    permissions: {
        minified: [],
        error: null,
        clientPermissions: [],
        permissionsGranted:[]
    }
};

export default function users(state = initialState, action = {}) {
    switch (action.type) {
        case "USER_PERMISSIONS_MINI_SUCCESS":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    minified: action.payload,
                    error: null
                }
            };

        case "USER_PERMISSIONS_MINI_FAILED":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    error: action.payload
                }
            };
        case "CLIENT_PERMISSION_SUCCESS":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    clientPermissions: action.payload,
                    error: null,
                }
            };

        case "CLIENT_PERMISSION_FAILED":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    error: action.payload
                }
            };
        case "UPDATE_CLIENT_PERMISSION_SUCCESS":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    permissionsGranted: action.payload,
                    error: null,
                }
            };

        case "UPDATE_CLIENT_PERMISSION_FAILED":
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    error: action.payload
                }
            };

        default:
            return {
                ...state
            };

    }
}