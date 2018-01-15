import {UPDATE_STEP_INDEX} from '../create-account.action-types';

export function stepIndex(state = 0, action) {
    switch (action.type) {
        case UPDATE_STEP_INDEX:
            return action.payload;
        default:
            return state;
    }
}
