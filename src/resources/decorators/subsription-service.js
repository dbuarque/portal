/**
 * Created by istrauss on 9/8/2017.
 */

import _findIndex from 'lodash.findindex';

export function subscriptionService() {
    return function (target) {
        target.prototype.subscribe = function subscribe(subscriber) {
            if (!this.subscribers) {
                this.subscribers = [];
            }

            this.subscribers.push(subscriber);

            if (this.subscribed) {
                this.subscribed();
            }

            return this.unsubscribe.bind(this, subscriber);
        };

        target.prototype.unsubscribe = function unsubscribe(subscriber) {
            const index = _findIndex(this.subscribers, s => s === subscriber);

            if (index > -1) {
                this.subscribers.splice(index, 1);
            }

            if (this.unsubscribed) {
                this.unsubscribed();
            }
        };

        target.prototype._notifySubscribers = function _notifySubscribers(payload) {
            this.subscribers.forEach(s => {
                s(payload);
            });
        };
    }
}