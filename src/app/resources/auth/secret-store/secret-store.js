/**
 * Created by istrauss on 4/24/2017.
 */

import {inject} from 'aurelia-framework';
import {ModalService} from 'global-resources';
import {InactivityTracker} from '../inactivity-tracker';

@inject(ModalService, InactivityTracker)
export class SecretStore {

    constructor(modalService, inactivityTracker) {
        this.modalService = modalService;
        this.inactivityTracker = inactivityTracker;
    }

    update(secret, remember) {
        this._secret = secret;

        if (remember) {
            this.unsubscribeFromInactivityTracker = this.inactivityTracker.subscribe(this.forget.bind(this));
        }
    }

    async forget(pastDue) {
        if (!pastDue) {
            await this.modalService.open('app/resources/auth/secret-store/timeout-modal/timeout-modal');
        }

        this._secret = undefined;

        this.unsubscribeFromInactivityTracker();
    }
}
