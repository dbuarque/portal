/**
 * Created by istrauss on 1/7/2017.
 */

import {namespace as exchangeNamespace} from '../../exchange.action-types';

export const namespace = exchangeNamespace + '/DETAIL';

export const UPDATE_ORDERBOOK = namespace + '/UPDATE_ORDERBOOK';
export const UPDATE_MY_OFFERS = namespace + '/UPDATE_MY_OFFERS';
export const UPDATE_MY_BID = namespace + '/UPDATE_MY_BID';
export const UPDATE_MY_ASK = namespace + '/UPDATE_MY_ASK';
export const UPDATE_MY_ASSET_PAIR = namespace + '/UPDATE_MY_ASSET_PAIR';
export const UPDATE_DISPLAYED_OFFER_TYPE = namespace + '/UPDATE_DISPLAYED_OFFER_TYPE';
export const UPDATE_RECENT_TRADES = namespace + '/UPDATE_RECENT_TRADES';
