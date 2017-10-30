/**
 * Created by istrauss on 9/8/2017.
 */

import {inject} from 'aurelia-framework';
import {subscriptionService, AlertToaster} from 'global-resources';
import {connected} from 'au-redux';
import {AssetPairToUrlValueConverter} from 'app-resources';

@inject(AlertToaster, AssetPairToUrlValueConverter)
@subscriptionService()
export class MarketStream {

    @connected('exchange.assetPair')
    assetPair;

    previousAssetPair;
    isConnected = false;

    constructor(alertToaster, assetPairToUrl) {
        const self = this;

        self.alertToaster = alertToaster;
        self.assetPairToUrl = assetPairToUrl;

        io.socket.on('trades', this._newPayload.bind(this, 'trades'));
        io.socket.on('orderbook', this._newPayload.bind(this, 'orderbook'));

        this.bind();
    }

    async assetPairChanged() {
        try {
            await this._disconnectFromSocket();
            this.previousAssetPair = undefined;

            await this._connectToSocket();
            this.previousAssetPair = this.assetPair;
        }
        catch(e) {
            this.alertToaster.networkError();
            throw e;
        }
    }

    _newPayload(type, payload) {
        this._notifySubscribers({
            type,
            payload
        });
    }

    _disconnectFromSocket() {
        if (!this.previousAssetPair) {
            return Promise.resolve();
        }

        this.isConnected = false;

        return new Promise((resolve, reject) => {
            io.socket.get('/Market' + this.assetPairToUrl.toView(this.previousAssetPair) + '/Unsubscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                resolve();
            });
        });
    }

    _connectToSocket() {
        if (!this.assetPair) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get('/Market' + this.assetPairToUrl.toView(this.assetPair) + '/Subscribe', {}, (resData, jwRes) => {
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
