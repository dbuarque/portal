/**
 * Created by Ishai on 4/23/2017.
 */

import moment from 'moment';
import {inject} from 'aurelia-framework';
import _throttle from 'lodash.throttle';
import _findIndex from 'lodash.findindex';

export class InactivityTracker {

    subscribers = [];
    allowedInactiveMinutes = 20;

    restart() {
        this.stop();
        this.start();
    }

    stop() {
        const $body = $('body');
        $body.off('click.inactivity mousemove.inactivity keyup.inactivity');
        if (this.inactivityTimer) {
            window.clearInterval(this.inactivityTimer);
        }
    }

    start() {
        const $body = $('body');
        this._updateLastUserAction();
        $body.on('click.inactivity mousemove.inactivity keyup.inactivity', _throttle(this._updateLastUserAction.bind(this), 60000));

        this.inactivityTimer = window.setInterval(this.determineInactivityStatus.bind(this), 1000);
    }

    subscribe(s) {
        if (typeof s !== 'function') {
            throw new Error('InactivityTracker.subscribe() expects a function argument.');
        }

        this.subscribers.push(s);

        if (this.subscribers.length === 1) {
            this.start();
        }

        return this.unsubscribe.bind(this, s);
    }

    unsubscribe(s) {
        const index = _findIndex(this.subscribers, _s => _s === s);

        if (index === -1) {
            throw new Error('Subscriber not found in InactivityTracker.');
        }

        this.subscribers.splice(index, 1);

        if (this.subscribers.length === 0) {
            this.stop();
        }
    }

    notifySubscribers(pastDue) {
        this.subscribers.forEach(s => s(pastDue));
    }

    determineInactivityStatus() {
        if (this._isInactiveForDuration(this.allowedInactiveMinutes)) {
            //if user sleeps machine and comes back, set pastDue variable (because the user has been inactive for longer than the allowedInactiveMinues).
            this.notifySubscribers(this._isInactiveForDuration(this.allowedInactiveMinutes + 2));
            this.restart();
        }
    }

    _updateLastUserAction() {
        window.localStorage.lastUserAction = moment().toISOString();
    }

    _isInactiveForDuration(minutes) {
        let now = moment();
        let lastUserAction = moment(window.localStorage.lastUserAction);
        let difference = moment.duration(now.diff(lastUserAction)).asSeconds();
        return difference > minutes;
    }
}
