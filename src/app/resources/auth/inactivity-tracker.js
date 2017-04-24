/**
 * Created by Ishai on 4/23/2017.
 */

import moment from 'moment';
import {inject} from 'aurelia-framework';
import _throttle from 'lodash/throttle';

export class InactivityTracker {

    subscribers = [];
    allowedInactiveMinutes = 20;

    constructor() {
        this.reset();
    }

    reset() {
        const $body = $('body');
        this._updateLastUserAction();
        $body.off('click.inactivity mousemove.inactivity keyup.inactivity');
        $body.on('click.inactivity mousemove.inactivity keyup.inactivity', _throttle(this._updateLastUserAction.bind(this), 60000));

        if (this.inactivityTimer) {
            window.clearInterval(this.inactivityTimer);
        }
        this.inactivityTimer = window.setInterval(this.determineInactivityStatus.bind(this), 1000);
    }

    subscribe(s) {
        this.subscribers.push(s);
    }

    notifySubscribers(pastDue) {
        this.subscribers.forEach(s => s(pastDue));
    }

    determineInactivityStatus() {
        if (this._isInactiveForDuration(this.allowedInactiveMinutes)) {
            //if user sleeps machine and comes back, set pastDue variable (because the user has been inactive for longer than the allowedInactiveMinues).
            this.notifySubscribers(this._isInactiveForDuration(this.allowedInactiveMinutes + 2));
            this.reset();
        }
    }

    _updateLastUserAction() {
        window.localStorage.lastUserAction = moment().toISOString();
    }

    _isInactiveForDuration(minutes) {
        let now = moment();
        let lastUserAction = moment(window.localStorage.lastUserAction);
        let difference = moment.duration(now.diff(lastUserAction)).asMinutes();
        return difference > minutes;
    }
}
