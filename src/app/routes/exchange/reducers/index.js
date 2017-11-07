import {combineReducers} from 'redux';
import {restrictReducerToNamespace} from 'au-redux';
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
