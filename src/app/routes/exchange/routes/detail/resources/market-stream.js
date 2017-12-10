/**
 * Created by istrauss on 9/8/2017.
 */

import {inject} from 'aurelia-framework';
import {subscriptionService, AlertToaster} from 'global-resources';
import {connected} from 'aurelia-redux-connect';
import {AssetPairToUrlValueConverter, assetPairsAreDifferent} from 'app-resources';

@inject(AlertToaster, AssetPairToUrlValueConverter)
@subscriptionService()
export class MarketStream {
    @connected('exchange.assetPair')
    assetPair;

    previousAssetPair;
    isConnected = false;

    constructor(alertToaster, assetPairToUrl) {
        this.alertToaster = alertToaster;
        this.assetPairToUrl = assetPairToUrl;

        io.socket.on('trades', this._newPayload.bind(this, 'trades'));
        io.socket.on('orderbook', this._newPayload.bind(this, 'orderbook'));
    }

    init() {
        this.bind();
        this._connectToSocket();
    }

    deinit() {
        this._disconnectFromSocket();
        this.unbind();
    }

    async assetPairChanged() {
        if (!assetPairsAreDifferent(this.previousAssetPair, this.assetPair)) {
            return;
        }

        this._disconnectFromSocket();
        this._connectToSocket();
    }

    _newPayload(type, payload) {
        this._notifySubscribers({
            type,
            payload
        });
    }

    _disconnectFromSocket() {
        const previousAssetPair = this.previousAssetPair;

        this.previousAssetPair = undefined;

        if (!previousAssetPair) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get('/Market' + this.assetPairToUrl.toView(previousAssetPair) + '/Unsubscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                this.isConnected = false;

                resolve();
            });
        });
    }

    _connectToSocket() {
        this.previousAssetPair = this.assetPair;

        if (!this.previousAssetPair) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get('/Market' + this.assetPairToUrl.toView(this.previousAssetPair) + '/Subscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                this.isConnected = true;

                resolve();
            });
        });
    }
}
