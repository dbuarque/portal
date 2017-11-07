import {combineReducers} from 'redux';
import {restrictReducerToNamespace} from 'au-redux';
import {namespace} from '../top-ten-markets.action-types';
import {order} from './order';
import {results} from './results';

export const topTenMarkets = restrictReducerToNamespace(
    combineReducers({
        order,
        results
    }),
    namespace
);
