import {combineReducers} from 'redux';
import {restrictReducerToNamespace} from 'aurelia-redux-connect';
import {namespace} from '../choose.action-types';
import {topTenMarkets} from '../top-ten-markets/reducers';

export default restrictReducerToNamespace(
    combineReducers({
        topTenMarkets
    }),
    namespace
);
