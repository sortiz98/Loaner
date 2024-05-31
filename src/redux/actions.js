export const SET_MARKED_DATES = 'SET_MARKED_DATES';

export const setMarkedDates = markedDates => dispatch => {
    dispatch({
        type: SET_MARKED_DATES,
        payload: markedDates,
    });
};
