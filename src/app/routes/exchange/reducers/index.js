import {combineReducers} from 'redux';
import {restrictReducerToNamespace} from 'aurelia-redux-connect';
import {assetPair} from './asset-pair';
import {namespace} from '../exchange.action-types';
import choose from '../routes/choose/reducers';
import detail from '../routes/detail/reducers';

export const exchange = restrictReducerToNamespace(
    combineReducers({
        assetPair,
        choose,
        detail
    }),
    namespace
);
