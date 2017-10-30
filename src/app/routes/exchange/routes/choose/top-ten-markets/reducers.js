
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace, UPDATE_TOP_TEN_RESULTS, UPDATE_TOP_TEN_ORDER} from "./top-ten-markets-action-types";

const initialState = {
    order: 'tradeCount',
    results: []
};

export default restrictReducerToNamespace(
    combineReducersProvideRootState({
        results,
        order
    }),
    namespace
);

function results(state = [], action) {
    switch(action.type) {
        case UPDATE_TOP_TEN_RESULTS:
            return action.payload;
        default:
            return state;
    }
}

function order(state = 'tradeCount', action) {
    switch(action.type) {
        case UPDATE_TOP_TEN_ORDER:
            return action.payload;
        default:
            return state;
    }
}
