import {UPDATE_BIP_32_PATH} from '../app.action-types';

export function bip32Path(state = null, action) {
    return action.type === UPDATE_BIP_32_PATH ? action.payload : state;
}
