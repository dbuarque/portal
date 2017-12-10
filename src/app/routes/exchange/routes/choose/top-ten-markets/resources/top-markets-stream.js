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

    init() {
        this._connectToSocket();
    }

    deinit() {
        this._disconnectFromSocket();
    }

    _newPayload(payload) {
        this._notifySubscribers(payload);
    }

    _disconnectFromSocket() {
        return new Promise((resolve, reject) => {
            io.socket.get('/Market/Top/Unsubscribe', {}, (resData, jwRes) => {
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
