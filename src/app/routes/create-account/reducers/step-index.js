import {STEP_BACK, STEP_FORWARD} from '../create-account.action-types';

export function stepIndex(state = 0, action) {
    switch (action.type) {
        case STEP_BACK:
            return state - 1;
        case STEP_FORWARD:
            return state + 1;
        default:
            return state;
    }
}
