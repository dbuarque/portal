import {UPDATE_TOP_TEN_ORDER} from "../top-ten-markets.action-types";

export function order(state = 'tradeCount', action) {
    switch(action.type) {
        case UPDATE_TOP_TEN_ORDER:
            return action.payload;
        default:
            return state;
    }
}
