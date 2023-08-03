var initialState = {
	list: [],
	onBoarding: {}
}

export default function user(state = initialState, action = {}) {
	switch (action.type) {
		case 'ADD_NEW_CLIENT':
			return {
				...state,
				list: [...state.list, action.payload]
			}
		case 'UPDATE_ONBOARDING_CLIENT':
			return {
				...state,
				onBoarding: {
					...state.onBoarding,
					...action.payload
				}
			}
		case 'UPDATE_ONBOARDING_STEP':
			return {
				...state,
				onBoarding: {
					...state.onBoarding,
					...action.payload
				}
			}
		default:
			return {
				...state
			}
	}
}
