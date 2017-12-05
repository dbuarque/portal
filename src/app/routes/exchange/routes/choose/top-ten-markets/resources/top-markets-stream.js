/**
 * Created by istrauss on 9/8/2017.
 */

import {subscriptionService} from 'global-resources';

@subscriptionService()
export class TopMarketsStream {
    isConnected = false;

    constructor() {
        io.socket.on('topMarkets', this._newPayload.bind(this));
    }

    _newPayload(payload) {
        this._notifySubscribers(payload);
    }

    subscribed() {
        if (this.subscribers.length === 1) {
            this.connectToSocket();
        }
    }

    unsubscribed() {
        if (this.subscribers.length === 0) {
            this.disconnectFromSocket();
        }
    }

    disconnectFromSocket() {
        this.isConnected = false;

        return new Promise((resolve, reject) => {
            io.socket.get('/Market/Top/Unsubscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                resolve();
            });
        });
    }

    connectToSocket() {
        return new Promise((resolve, reject) => {
            io.socket.get('/Market/Top/Subscribe', {}, (resData, jwRes) => {
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
