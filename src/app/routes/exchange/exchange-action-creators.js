/**
 * Created by istrauss on 1/7/2017.
 */


import {namespace, exchangeActionTypes} from './exchange-action-types';

const {UPDATE_ASSET_PAIR} = exchangeActionTypes;

export class ExchangeActionCreators {
    updateAssetPair(assetPair) {
        return {
            type: UPDATE_ASSET_PAIR,
            payload: {
                ...assetPair
            }
        };
    }
}
