/**
 * Created by istrauss on 9/8/2017.
 */

import {inject} from 'aurelia-framework';
import {subscriptionService, AlertToaster} from 'global-resources';
import {connected} from 'au-redux';

@inject(AlertToaster)
@subscriptionService()
export class AccountStream {

    @connected('account.accountId')
    accountId;

    previousAccountId;
    isConnected = false;

    constructor(alertToaster) {
        const self = this;

        self.alertToaster = alertToaster;

        io.socket.on('effects', this._newPayload.bind(this, 'effects'));

        this.bind();
    }

    async accountIdChanged() {
        if (this.previousAccountId && this.accountId === this.previousAccountId) {
            return;
        }

        try {
            try {
                await this._disconnectFromSocket();
                this.previousAccountId = undefined;
            }
            catch (e) {
                throw e;
            }
            await this._connectToSocket();
            this.previousAccountId = this.accountId;
        }
        catch(e) {
            const i = e;
            this.alertToaster.error('Something went wrong. We are having trouble connecting to our server.');
        }
    }

    _newPayload(type, payload) {
        this._notifySubscribers({
            type,
            payload
        });
    }

    _disconnectFromSocket() {
        if (!this.previousAccountId) {
            return Promise.resolve();
        }

        this.isConnected = false;

        return new Promise((resolve, reject) => {
            io.socket.get('/Account/' + this.previousAccountId + '/Unsubscribe', {}, (resData, jwRes) => {
                if (jwRes.statusCode > 300) {
                    reject();
                    return;
                }

                resolve();
            });
        });
    }

    _connectToSocket() {
        if (!this.accountId) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            io.socket.get('/Account/' + this.accountId + '/Subscribe', {}, (resData, jwRes) => {
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
