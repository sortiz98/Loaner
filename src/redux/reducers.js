import { SET_MARKED_DATES } from './actions';

const initialState = {
    markedDates: {
        ["2022-06-22"]: { disabled: true }
    }
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MARKED_DATES:
            return { ...state, markedDates: action.payload };
        default:
            return state;
    }
}

export default userReducer;