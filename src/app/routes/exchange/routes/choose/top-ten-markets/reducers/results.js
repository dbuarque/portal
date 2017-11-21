import {UPDATE_TOP_TEN_RESULTS} from "../top-ten-markets.action-types";

export function results(state = [], action) {
    switch(action.type) {
        case UPDATE_TOP_TEN_RESULTS:
            return action.payload;
        default:
            return state;
    }
}
