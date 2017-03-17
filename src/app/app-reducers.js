/**
 * Created by Ishai on 12/20/2016.
 */

import {appActionTypes} from './app-action-types';

const {UPDATE_ACCOUNT, UPDATE_KEYPAIR} = appActionTypes;

export const app = function (state, action) {
    switch(action.type) {
        case UPDATE_ACCOUNT:
            return {
                ...state,
                account: action.payload.account
            };
        case UPDATE_KEYPAIR:
            return {
                ...state,
                keyPair: action.payload.keyPair
            };
        default:
            return state || {};
    }
};




