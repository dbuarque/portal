/**
 * Created by Ishai on 4/23/2017.
 */

import moment from 'moment';
import {inject} from 'aurelia-framework';
import _throttle from 'lodash/throttle';
import {ModalService} from 'resources';

@inject(ModalService)
export class InactivityTracker {

    subscribers = [];
    allowedInactiveMinutes = 20;

    constructor(modalService) {
        this.modalService = modalService;
        this.start();
    }

    start() {
        //This is a fallback. If somehow a user has not been logged out after 40 minutes, log the user out (this can happen if user sleeps machine etc).
        window.setInterval(this.userShouldAlreadyBeLoggedOut.bind(this), 1000);

        this.updateLastUserAction();
        this.reset();
    }

    reset() {
        //No reason to update more often than every 1m (because the inactivity timeout is in 20m intervals).
        $('body').on('click.inactivity mousemove.inactivity keyup.inactivity', _throttle(this.updateLastUserAction.bind(this), 60000));
        //Make sure these modals are synced across tabs to within 15s.
        this.inactivityTimer = window.setInterval(this.showInactivityTimeoutWarning.bind(this), 15000);
    }

    subscribe(s) {
        this.subscribers.push(s);
    }

    notifySubscribers(pastDue) {
        this.subscribers.forEach(s => s(pastDue));
    }

    userShouldAlreadyBeLoggedOut() {
        //if user sleeps machine and comes back, this should log the user out.
        if (this._isInactiveForDuration(this.allowedInactiveMinutes + 2)) {
            this.notifySubscribers(true);
        }
    }

    updateLastUserAction() {
        window.localStorage.lastUserAction = moment().toISOString();
    }

    showInactivityTimeoutWarning() {
        if (!this._isInactiveForDuration(this.allowedInactiveMinutes)) {
            return;
        }

        //Stop these while the alert modal is up.
        $('body').off('click.inactivity mousemove.inactivity keyup.inactivity');
        window.clearInterval(this.inactivityTimer);

        this.modalService
            .open('DTAureliaResources/auth/inactivity-timeout/inactivity-timeout', {}, {dismissable: false})
            .then(this.reset.bind(this))
            .catch(this.notifySubscribers.bind(this));
    }

    _isInactiveForDuration(minutes) {
        let now = moment();
        let lastUserAction = moment(window.localStorage.lastUserAction);
        let difference = moment.duration(now.diff(lastUserAction)).asMinutes();
        return difference > minutes;
    }
}