const initialState = {
    bankClients:{
        clientsList: [],
        selectedClients:[],
    }
}

export default function bankClients(state = initialState, action = {}) {
	switch (action.type) {
        case 'FETCH_CLIENTS_LIST_SUCCESS':
			return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    clientsList: action.payload,
                    error: null,
                }
            }
        case 'FETCH_CLIENTS_LIST_FAILED':
			return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    error: action.payload
                }
            }
        case 'CLIENTS_ACCESS_LIST_SUCCESS':
            return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    selectedClients: action.payload,
                    error: null,
                }
            }
        case 'CLIENTS_ACCESS_LIST_FAILED':
            return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    error: action.payload
                }
            }
        case 'CLIENTS_UPDATE_LIST_SUCCESS':
            return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    selectedClients: action.payload,
                    error: null,
                }
            }
        case 'CLIENTS_UPDATE_LIST_FAILED':
            return {
                ...state,
                bankClients: {
                    ...state.bankClients,
                    error: action.payload
                }
            }

		default:
			return {
				...state
			}
	}
}