const initialState = {
    filesettings:{
        items: null,
        error: null,
    }
}

export default function filesettings(state = initialState, action = {}) {
	switch (action.type) {
		case 'FETCH_FILESETTING_SUCCESS':
			return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    items: action.payload,
                    error: null,
                }
            }
        case 'FETCH_FILESETTING_FAILED':
			return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    error: action.payload
                }
            }
        case 'CREATE_FILESETTING_SUCCESS':
            return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    items: action.payload,
                    error: null
                }
            }
        case 'CREATE_FILESETTING_FAILED':
            return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    error: action.payload
                }
            }
        case 'UPDATE_FILESETTING_SUCCESS':
            return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    items: action.payload,
                    error: null
                }
            }
        case 'UPDATE_FILESETTING_FAILED':
            return {
                ...state,
                filesettings: {
                    ...state.filesettings,
                    error: action.payload
                }
            }
		default:
			return {
				...state
			}
	}
}