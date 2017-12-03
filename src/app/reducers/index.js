import {combineReducers} from 'redux';

import {myAccount} from './my-account';
import {bip32Path} from './bip-32-path';

import {exchange} from '../routes/exchange/reducers';

export const app = combineReducers({
    myAccount,
    bip32Path,
    exchange
});
