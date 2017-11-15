/**
 * Created by istrauss on 9/18/2017.
 */

import {combineReducers} from 'redux';
import {orderbook} from './orderbook';
import {myOffers} from './my-offers';
import {myAssetPair} from './my-asset-pair';
import {myBid} from './my-bid';
import {myAsk} from './my-ask';
import {displayedOfferType} from './displayed-offer-type';
import {recentTrades} from './recent-trades';

export default combineReducers({
    myBid,
    myAsk,
    orderbook,
    myOffers,
    myAssetPair,
    displayedOfferType,
    recentTrades
});
