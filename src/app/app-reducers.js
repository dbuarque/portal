/**
 * Created by Ishai on 12/20/2016.
 */

import _isEqual from 'lodash.isequal';
import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {appActionTypes} from './app-action-types';
import {exchange} from './routes/exchange/exchange-reducers';

const {UPDATE_MY_ACCOUNT, UPDATE_LUPOEX_ACCOUNT, UPDATE_MY_ACCOUNT_SEQNUM} = appActionTypes;

export const app = combineReducersProvideRootState({
    myAccount,
    lupoexAccount,
    exchange
});

function myAccount(state, action) {
    switch(action.type) {
        case UPDATE_MY_ACCOUNT:
            return !_isEqual(state, action.payload) ? action.payload : state;
        case UPDATE_MY_ACCOUNT_SEQNUM:
            return {
                ...state,
                seqNum: action.payload
            };
        default:
            return state;
    }
}

function lupoexAccount(state, action) {
    return action.type === UPDATE_LUPOEX_ACCOUNT ? action.payload : state;
}




