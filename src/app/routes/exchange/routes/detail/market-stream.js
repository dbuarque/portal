/**
 * Created by istrauss on 9/8/2017.
 */

import {inject} from 'aurelia-framework';
import {subscriptionService, AlertToaster} from 'global-resources';
import {connected} from 'au-redux';

@inject(AlertToaster)
@subscriptionService()
export class MarketStream {

    @connected('exchange.assetPair')
    assetPair;

    previousAssetPair;

    constructor(alertToaster) {
        const self = this;

        self.alertToaster = alertToaster;

        io.socket.on('trades', function(payload) {
            self._notifySubscribers({
                type: 'trades',
                payload
            });
        });
        io.socket.on('bids', function(payload) {
            self._notifySubscribers({
                type: 'bids',
                payload
            })
        });
        io.socket.on('asks', function(payload) {
            self._notifySubscribers({
                type: 'asks',
                payload
            })
        });

        this.connect();
    }

    async assetPairChanged() {
        try {
            try {
                await this._unsubscribeFromSocket();
                this.previousAssetPair = undefined;
            }
            catch (e) {
                throw e;
            }
            await this._subscribeToSocket();
            this.previousAssetPair = this.assetPair;
        }
        catch(e) {
            this.alertToaster.error('Something went wrong. We are having trouble connecting to our server.');
        }
    }

    _unsubscribeFromSocket() {
        if (!this.previousAssetPair) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get(this._assetPairToUrl(this.previousAssetPair) + '/Unsubscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                resolve();
            });
        });
    }

    _subscribeToSocket() {
        if (!this.assetPair) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get(this._assetPairToUrl(this.assetPair) + '/Subscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                resolve();
            });
        });
    }

    _assetPairToUrl(assetPair) {
        return '/Market/' + assetPair.selling.code + '/' + assetPair.selling.issuer + '/' + assetPair.buying.code + '/' + assetPair.buying.issuer;
    }
}
