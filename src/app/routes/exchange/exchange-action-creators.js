/**
 * Created by istrauss on 1/7/2017.
 */


import {inject} from 'aurelia-framework';
import {namespace, exchangeActionTypes} from './exchange-action-types';
import {StellarServer} from 'global-resources';

const {UPDATE_ASSET_PAIR, REFRESH_ORDERBOOK} = exchangeActionTypes;

@inject(StellarServer)
export class ExchangeActionCreators {

    constructor(stellarServer) {
        this.stellarServer = stellarServer;
    }

    updateAssetPair(assetPair) {
        return {
            type: UPDATE_ASSET_PAIR,
            payload: {
                ...assetPair
            }
        };
    }

    refreshOrderbook() {
        return async (dispatch, getState) => {
            const assetPair = getState().exchange.assetPair;

            dispatch({
                type: REFRESH_ORDERBOOK,
                payload: {
                    loading: true
                }
            });

            const orderbook = await this.stellarServer.orderbook(
                    assetPair.selling.code === 'XLM' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(assetPair.selling.code, assetPair.selling.issuer),
                    assetPair.buying.code === 'XLM' ? this.stellarServer.sdk.Asset.native() : new this.stellarServer.sdk.Asset(assetPair.buying.code, assetPair.buying.issuer)
                )
                .call();

           dispatch({
               type: REFRESH_ORDERBOOK,
               payload: orderbook
           });
        }
    }
}
