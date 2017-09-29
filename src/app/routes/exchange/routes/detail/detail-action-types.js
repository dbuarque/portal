/**
 * Created by istrauss on 1/7/2017.
 */

import {createNamespace} from 'au-redux';
import {namespace as exchangeNamespace} from '../../exchange-action-types';

export const namespace = exchangeNamespace + '_DETAIL';

export const detailActionTypes = createNamespace(
    [
        'UPDATE_ORDERBOOK',
        'UPDATE_MY_OFFERS',
        'UPDATE_MY_BID',
        'UPDATE_MY_ASK',
        'UPDATE_MY_ASSET_PAIR',
        'UPDATE_DISPLAYED_OFFER_TYPE',
        'UPDATE_RECENT_TRADES'
    ],
    namespace
);

