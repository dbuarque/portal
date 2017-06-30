/**
 * Created by istrauss on 6/30/2017.
 */

import _findIndex from 'lodash.findindex';
import _throttle from 'lodash.throttle';
import {inject} from 'aurelia-framework';
import {StellarServer, AppStore, AlertToaster} from 'global-resources';

@inject(StellarServer, AppStore, AlertToaster)
export class EffectStream {

    subscribers = [];

    constructor(stellarServer, appStore, alertToaster) {
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.alertToaster = alertToaster;

        this.alertUser = _throttle(this._alertUser.bind(this), 60 * 1000);
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        this.assetPair = exchange.assetPair;
        this.updateStreamState();
    }

    subscribe(callback) {
        this.subscribers.push(callback);

        return () => {
            const index = _findIndex(this.subscribers, subscribedCallback => subscribedCallback === callback);

            if (index > -1) {
                this.subscribers.splice(index, 1);
            }

            this.updateStreamState();
        }
    }

    updateStreamState() {
        if (this.subscribers.length === 0 || !this.assetPair) {
            if (this.unsubscribeFromStream) {
                this.unsubscribeFromStream();
            }

            return;
        }

        if (!this.unsubscribeFromStream) {
            this.unsubscribeFromStream = this.server.effects().stream(
                {
                    onmessage: events => {
                        const filteredEvents = events.filter(e => {
                            //TODO filter by this.assetPair;
                            return true;
                        });

                        this.subscribers.forEach(s => s(events));
                    },
                    onerror: this.alertUser.bind(this)
                }
            );
        }
    }

    _alertUser() {
        this.alertToaster.warning('Something is wrong. We are having difficulties performing real time updates.');
    }
}