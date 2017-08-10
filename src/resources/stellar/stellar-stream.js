/**
 * Created by istrauss on 6/30/2017.
 */

import _findIndex from 'lodash.findindex';
import _throttle from 'lodash.throttle';

export class StellarStream {

    subscribers = [];

    constructor(stellarServer, alertToaster, type, options = {}) {
        this.stellarServer = stellarServer;
        this.alertToaster = alertToaster;
        this.type = type;

        this.alertUser = _throttle(this._alertUser.bind(this), (options.alertUserFrequency || 60) * 1000);

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
        if (this.subscribers.length === 0) {
            if (this.unsubscribeFromStream) {
                this.unsubscribeFromStream();
            }

            return;
        }

        if (!this.unsubscribeFromStream) {
            this.unsubscribeFromStream = this.server[this.type]().stream(
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