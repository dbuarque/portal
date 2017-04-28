/**
 * Created by Ishai on 12/20/2016.
 */

import {ReducerHelper} from 'global-resources';
import {appActionTypes} from './app-action-types';
import {exchange} from './routes/exchange/exchange-reducers';

const {UPDATE_ACCOUNT} = appActionTypes;

export const app = ReducerHelper.combineReducersProvideRootState({
    account,
    exchange
});

function account(state, action) {
    return action.type === UPDATE_ACCOUNT ? action.payload.account : state;
}




