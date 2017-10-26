

import {combineReducersProvideRootState, restrictReducerToNamespace} from 'au-redux';
import {namespace} from '../choose-action-types';
import topTenMarkets from '../top-ten-markets/reducers';

export default restrictReducerToNamespace(
    combineReducersProvideRootState({
        topTenMarkets
    }),
    namespace
);
