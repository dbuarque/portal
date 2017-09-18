/**
 * Created by Ishai on 12/20/2016.
 */

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {appActionTypes} from './app-action-types';
import {exchange} from './routes/exchange/exchange-reducers';

const {UPDATE_ACCOUNT, UPDATE_LUPOEX_ACCOUNT, UPDATE_OFFERS} = appActionTypes;

export const app = combineReducersProvideRootState({
    account,
    lupoexAccount,
    exchange
});

function account(state, action) {
    return action.type === UPDATE_ACCOUNT ? action.payload.account : state;
}

function lupoexAccount(state, action) {
    return action.type === UPDATE_LUPOEX_ACCOUNT ? action.payload.account : state;
}




