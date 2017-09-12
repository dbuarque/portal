/**
 * Created by istrauss on 1/7/2017.
 */

import {createNamespace} from 'au-redux';

export const namespace = 'EXCHANGE';

export const exchangeActionTypes = createNamespace(
    [
        'UPDATE_ASSET_PAIR',
        'UPDATE_ORDERBOOK'
    ],
    namespace
);

