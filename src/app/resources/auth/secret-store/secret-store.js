/**
 * Created by istrauss on 4/24/2017.
 */

import {PLATFORM} from 'aurelia-pal';
import {inject} from 'aurelia-framework';
import {Store} from 'au-redux';
import {ModalService, AlertToaster} from 'global-resources';
import {InactivityTracker} from '../inactivity-tracker';

@inject(ModalService, Store, AlertToaster, InactivityTracker)
export class SecretStore {

    get canSign() {
        return !!this._keypair;
    }

    constructor(modalService, store, alertToaster, inactivityTracker) {
        this.modalService = modalService;
        this.store = store;
        this.alertToaster = alertToaster;
        this.inactivityTracker = inactivityTracker;
    }

    async sign(transaction) {
        if (!this._keypair) {
            throw new Error('There is no secret to sign with.');
        }

        transaction.sign(this._keypair);

        return transaction;
    }

    remember(keypair) {
        this.unsubscribeFromInactivityTracker = this.inactivityTracker.subscribe(this.forget.bind(this));

        this._keypair = keypair;
    }

    async forget(pastDue) {
        if (!pastDue) {
            try {
                await this.modalService.open(PLATFORM.moduleName('app/resources/auth/secret-store/timeout-modal/timeout-modal'), {}, {modalClass: 'sm'});
                //If the modal does not throw then that means the user selected not to forget the secret.
                return;
            }
            catch (e) {}
        }
        this._secret = undefined;
        this.alertToaster.primary('Secret key has been removed from memory.');
        this.unsubscribeFromInactivityTracker();
    }
}
