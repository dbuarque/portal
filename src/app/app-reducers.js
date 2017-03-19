/**
 * Created by Ishai on 12/20/2016.
 */

import {ReducerHelper} from 'utils';
import {appActionTypes} from './app-action-types';
import {exchange} from './routes/exchange/exchange-reducers';

const {UPDATE_ACCOUNT, UPDATE_KEYPAIR} = appActionTypes;

export const app = ReducerHelper.combineReducersProvideRootState({
    account,
    keyPair,
    exchange
});

function keyPair(state, action) {
    return action.type === UPDATE_KEYPAIR ? {
        ...state,
        keyPair: action.payload.keyPair
    } : state;
}

function account(state, action) {
    return action.type === UPDATE_ACCOUNT ? {
        ...state,
        account: action.payload.account
    } : state;
}




