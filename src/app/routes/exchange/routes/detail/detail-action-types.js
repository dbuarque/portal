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
        'UPDATE_NEW_OFFER'
    ],
    namespace
);

