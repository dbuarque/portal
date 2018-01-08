import {UPDATE_PUBLIC_KEY} from '../create-account.action-types';

export function publicKey(state = null, action) {
    return action.type === UPDATE_PUBLIC_KEY ? action.payload : state;
}

